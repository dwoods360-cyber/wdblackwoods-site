import { createPageMetadata } from "@/lib/siteMetadata"
import {
  hasReaderIntelligenceAccess,
  isReaderIntelligenceConfigured,
} from "@/lib/readerIntelligenceAccess"
import {
  getReaderIntelligenceSummary,
  type ReaderIntelligenceSummary,
} from "@/lib/posthogReaderIntelligence"

export const dynamic = "force-dynamic"
export const revalidate = 300

export const metadata = {
  ...createPageMetadata({
    title: "Reader Intelligence — What Coffee Demands",
    description:
      "An internal archive instrument for aggregated reader behavior signals.",
    path: "/system/reader-intelligence",
  }),
  robots: {
    index: false,
    follow: false,
  },
}

function formatRefreshTime(value: string) {
  return new Intl.DateTimeFormat("en", {
    dateStyle: "medium",
    timeStyle: "short",
    timeZone: "UTC",
  }).format(new Date(value))
}

function MetricList({
  title,
  label,
  rows,
  emptyText,
}: {
  title: string
  label: string
  rows: ReaderIntelligenceSummary["eventCounts"]
  emptyText: string
}) {
  return (
    <section className="system-section">
      <p className="system-layer-label">{label}</p>
      <h1>{title}</h1>
      {rows.length > 0 ? (
        <dl>
          {rows.map((row) => (
            <div key={`${row.label}-${row.detail ?? "summary"}`}>
              <dt>{row.label}</dt>
              {row.detail ? <dd>{row.detail}</dd> : null}
              <dd>{row.count}</dd>
            </div>
          ))}
        </dl>
      ) : (
        <p>{emptyText}</p>
      )}
    </section>
  )
}

function ReaderIntelligenceAccessForm({ denied }: { denied: boolean }) {
  return (
    <main className="system-page document-page">
      <section className="system-section">
        <p className="system-layer-label">Internal archive instrument</p>
        <h1>Reader Intelligence</h1>
        <p>This instrument is reserved for internal archive review.</p>
        <form
          action="/system/reader-intelligence/access"
          method="post"
          className="reader-tool-form"
        >
          <label htmlFor="passphrase">Access phrase</label>
          <input id="passphrase" name="passphrase" type="password" required />
          <button type="submit" className="text-cta">
            Open instrument
          </button>
        </form>
        {denied ? <p>Access was not granted.</p> : null}
      </section>
    </main>
  )
}

function ReaderIntelligenceUnconfigured() {
  return (
    <main className="system-page document-page">
      <section className="system-section">
        <p className="system-layer-label">Configuration</p>
        <h1>Reader Intelligence is not configured</h1>
        <p>
          Add the server-only access secret before this internal instrument can
          be opened.
        </p>
      </section>
    </main>
  )
}

export default async function ReaderIntelligencePage({
  searchParams,
}: {
  searchParams: Promise<{ access?: string }>
}) {
  const resolvedSearchParams = await searchParams

  if (!isReaderIntelligenceConfigured()) {
    return <ReaderIntelligenceUnconfigured />
  }

  const hasAccess = await hasReaderIntelligenceAccess()

  if (!hasAccess) {
    return <ReaderIntelligenceAccessForm denied={resolvedSearchParams.access === "denied"} />
  }

  const summary = await getReaderIntelligenceSummary()
  const hasWarnings = summary.warnings.length > 0

  return (
    <main className="system-page document-page">
      <section className="system-section">
        <p className="system-layer-label">Internal archive instrument</p>
        <h1>Reader Intelligence</h1>
        <p>
          A restrained server-side summary of reader signals collected through
          the existing W.D. Blackwoods analytics system.
        </p>
        <p className="meta">
          Period: {summary.periodLabel} · Last refreshed:{" "}
          {formatRefreshTime(summary.refreshedAt)} UTC · Mode:{" "}
          {summary.analyticsMode}
        </p>
        <form action="/system/reader-intelligence/logout" method="post">
          <button type="submit" className="text-cta">
            Close instrument
          </button>
        </form>
      </section>

      {summary.status === "missing_env" ? (
        <section className="system-section">
          <p className="system-layer-label">Configuration</p>
          <h1>Reader data is not configured</h1>
          <p>{summary.warnings[0]}</p>
          <p>
            Add the server-only PostHog project ID and personal API key before
            this internal page can read aggregate signals.
          </p>
        </section>
      ) : null}

      {summary.status !== "missing_env" && hasWarnings ? (
        <section className="system-section">
          <p className="system-layer-label">Notes</p>
          <h1>Available Signals</h1>
          {summary.warnings.map((warning) => (
            <p key={warning}>{warning}</p>
          ))}
        </section>
      ) : null}

      {summary.status !== "missing_env" ? (
        <>
          <MetricList
            title="Reader Funnel"
            label="Entry sequence"
            rows={summary.funnelCounts}
            emptyText="No entry funnel events are available for this period."
          />

          <MetricList
            title="Event Counts"
            label="Aggregate events"
            rows={summary.eventCounts}
            emptyText="No curated analytics events are available for this period."
          />

          <MetricList
            title="Archive Entry Signals"
            label="Routes and pages"
            rows={summary.routeCounts}
            emptyText="No pageview route signals are available for this period."
          />

          <MetricList
            title="Device Classes"
            label="Device class"
            rows={summary.deviceCounts}
            emptyText="No device class breakdown is available for this period."
          />
        </>
      ) : null}
    </main>
  )
}
