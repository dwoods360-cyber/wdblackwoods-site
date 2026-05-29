import "server-only"

type MetricRow = {
  label: string
  count: number
  detail?: string
}

export type ReaderIntelligenceSummary = {
  status: "ready" | "missing_env" | "error"
  periodLabel: string
  refreshedAt: string
  analyticsMode: string
  eventCounts: MetricRow[]
  funnelCounts: MetricRow[]
  routeCounts: MetricRow[]
  deviceCounts: MetricRow[]
  warnings: string[]
}

type QueryResponse = {
  results?: unknown[][]
}

const posthogProjectId = process.env.POSTHOG_PROJECT_ID
const posthogPersonalApiKey = process.env.POSTHOG_PERSONAL_API_KEY
const posthogQueryHost = process.env.POSTHOG_QUERY_HOST ?? "https://app.posthog.com"
const analyticsMode = process.env.NEXT_PUBLIC_ANALYTICS_MODE ?? "off"
const periodLabel = "Last 7 days"
const revalidateSeconds = 300

const curatedEvents = [
  "page_view_home",
  "page_view_begin",
  "page_view_archive_index",
  "page_view_archive_slug",
  "enter_begin",
  "enter_vine_crown",
  "enter_arithmetic",
  "enter_caravanserai",
  "scroll_25",
  "scroll_50",
  "scroll_75",
  "scroll_100",
  "time_on_page_30s",
  "time_on_page_60s",
  "time_on_page_120s",
  "exit",
]

function quote(value: string) {
  return `'${value.replaceAll("'", "\\'")}'`
}

function getMissingEnvVars() {
  return [
    ["POSTHOG_PROJECT_ID", posthogProjectId],
    ["POSTHOG_PERSONAL_API_KEY", posthogPersonalApiKey],
  ]
    .filter(([, value]) => !value)
    .map(([name]) => name)
}

function createEmptySummary(status: ReaderIntelligenceSummary["status"], warnings: string[]) {
  return {
    status,
    periodLabel,
    refreshedAt: new Date().toISOString(),
    analyticsMode,
    eventCounts: [],
    funnelCounts: [],
    routeCounts: [],
    deviceCounts: [],
    warnings,
  }
}

function toCount(value: unknown) {
  const count = Number(value)
  return Number.isFinite(count) ? count : 0
}

function toLabel(value: unknown, fallback = "Unknown") {
  return typeof value === "string" && value.trim().length > 0 ? value : fallback
}

async function runHogql(query: string) {
  const endpoint = new URL(`/api/projects/${posthogProjectId}/query/`, posthogQueryHost)
  const response = await fetch(endpoint, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${posthogPersonalApiKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      query: {
        kind: "HogQLQuery",
        query,
      },
    }),
    next: {
      revalidate: revalidateSeconds,
    },
  })

  if (!response.ok) {
    throw new Error(`PostHog query failed with status ${response.status}`)
  }

  return (await response.json()) as QueryResponse
}

async function safeQuery(name: string, query: string) {
  try {
    const data = await runHogql(query)
    return { name, rows: data.results ?? [], warning: undefined }
  } catch {
    return {
      name,
      rows: [],
      warning: `${name} could not be read from PostHog for this period.`,
    }
  }
}

function mapSimpleRows(rows: unknown[][]) {
  return rows.map((row) => ({
    label: toLabel(row[0]),
    count: toCount(row[1]),
  }))
}

function mapRouteRows(rows: unknown[][]) {
  return rows.map((row) => {
    const eventName = toLabel(row[0], "Route event")
    const pageName = toLabel(row[1], eventName)
    const slug = toLabel(row[2], "")

    return {
      label: pageName,
      detail: slug ? `/archive/${slug}` : eventName,
      count: toCount(row[3]),
    }
  })
}

export async function getReaderIntelligenceSummary(): Promise<ReaderIntelligenceSummary> {
  const missingEnvVars = getMissingEnvVars()

  if (missingEnvVars.length > 0) {
    return createEmptySummary("missing_env", [
      `Missing server environment variables: ${missingEnvVars.join(", ")}.`,
    ])
  }

  const eventList = curatedEvents.map(quote).join(", ")

  const eventCountsQuery = `
    SELECT event, count() AS count
    FROM events
    WHERE timestamp >= now() - INTERVAL 7 DAY
      AND event IN (${eventList})
    GROUP BY event
    ORDER BY count DESC
    LIMIT 50
  `

  const funnelCountsQuery = `
    SELECT event, count() AS count
    FROM events
    WHERE timestamp >= now() - INTERVAL 7 DAY
      AND event IN ('enter_begin', 'enter_vine_crown')
    GROUP BY event
    ORDER BY event ASC
  `

  const routeCountsQuery = `
    SELECT event, properties.pageName, properties.slug, count() AS count
    FROM events
    WHERE timestamp >= now() - INTERVAL 7 DAY
      AND event IN ('page_view_home', 'page_view_begin', 'page_view_archive_index', 'page_view_archive_slug')
    GROUP BY event, properties.pageName, properties.slug
    ORDER BY count DESC
    LIMIT 50
  `

  const deviceCountsQuery = `
    SELECT properties.$device_type, count() AS count
    FROM events
    WHERE timestamp >= now() - INTERVAL 7 DAY
      AND event IN (${eventList})
    GROUP BY properties.$device_type
    ORDER BY count DESC
    LIMIT 10
  `

  const [eventCounts, funnelCounts, routeCounts, deviceCounts] = await Promise.all([
    safeQuery("Event counts", eventCountsQuery),
    safeQuery("Reader funnel", funnelCountsQuery),
    safeQuery("Route counts", routeCountsQuery),
    safeQuery("Device classes", deviceCountsQuery),
  ])

  const warnings = [
    eventCounts.warning,
    funnelCounts.warning,
    routeCounts.warning,
    deviceCounts.warning,
  ].filter((warning): warning is string => Boolean(warning))

  if (analyticsMode !== "full") {
    warnings.push(
      "Full pageview, device, scroll, and time-depth signals require NEXT_PUBLIC_ANALYTICS_MODE=full."
    )
  }

  return {
    status: warnings.length === 4 ? "error" : "ready",
    periodLabel,
    refreshedAt: new Date().toISOString(),
    analyticsMode,
    eventCounts: mapSimpleRows(eventCounts.rows),
    funnelCounts: mapSimpleRows(funnelCounts.rows),
    routeCounts: mapRouteRows(routeCounts.rows),
    deviceCounts: mapSimpleRows(deviceCounts.rows),
    warnings,
  }
}
