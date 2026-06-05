import { createPageMetadata } from "@/lib/siteMetadata"
import {
  hasReaderIntelligenceAccess,
  isReaderIntelligenceConfigured,
} from "@/lib/readerIntelligenceAccess"
import {
  getReaderIntelligenceSummary,
  type ReaderIntelligenceSummary,
} from "@/lib/posthogReaderIntelligence"
import { getReaderRoomAdminSummary } from "@/lib/readerRoomAccess"
import { getReaderRoomBookVersion } from "@/lib/readerRoomConfig"

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

async function BetaReaderRoomSection() {
  const summary = await getReaderRoomAdminSummary().catch(() => undefined)

  if (!summary) {
    return (
      <section className="system-section">
        <p className="system-layer-label">Private beta readers</p>
        <h1>Reader Room is not configured</h1>
        <p>
          Add the private Blob token and reader-room signing secret before beta
          reader records can be shown.
        </p>
      </section>
    )
  }

  return (
    <section className="system-section reader-room-admin-section">
        <p className="system-layer-label">Private beta readers</p>
        <h1>Reader Room</h1>
        <p className="meta">Book version: {getReaderRoomBookVersion()}</p>

        <form
          action="/system/reader-intelligence/reader-room/create-invite"
          method="post"
          className="reader-tool-form"
        >
          <label htmlFor="displayName">Reader display name</label>
          <input id="displayName" name="displayName" required />
          <label htmlFor="email">Reader email address</label>
          <input id="email" name="email" type="email" required />
          <label htmlFor="expiresAt">Invitation expires</label>
          <input id="expiresAt" name="expiresAt" type="date" />
          <button type="submit" className="text-cta">
            Create private invitation
          </button>
        </form>

        <p>
          The invitation URL is shown only once after creation. Raw invitation
          tokens are not stored.
        </p>

        <p>
          <a href="/system/reader-intelligence/reader-room/export" className="system-link">
            Export feedback CSV
          </a>
        </p>

        {summary.readers.length > 0 ? (
          <div className="reader-room-admin-table">
            {summary.readers.map(({ reader, progress, feedback }) => {
              const completed = progress.completedSlugs.length
              const lastOpened = progress.lastOpenedSlug || "Not opened"
              const checkpointEntries = new Set(
                feedback.entries
                  .map((entry) => entry.checkpoint)
                  .filter((checkpoint): checkpoint is NonNullable<typeof checkpoint> =>
                    Boolean(checkpoint)
                  )
              )

              return (
                <article key={reader.readerId} className="reader-room-admin-row">
                  <h2>{reader.displayName}</h2>
                  <p className="meta">{reader.email}</p>
                  <dl>
                    <div>
                      <dt>Invitation status</dt>
                      <dd>{reader.redeemedAt ? "Redeemed" : "Prepared"}</dd>
                    </div>
                    <div>
                      <dt>Redeemed</dt>
                      <dd>{reader.redeemedAt || "Not yet"}</dd>
                    </div>
                    <div>
                      <dt>Expiration</dt>
                      <dd>{reader.expiresAt}</dd>
                    </div>
                    <div>
                      <dt>Revoked</dt>
                      <dd>{reader.revoked ? "Yes" : "No"}</dd>
                    </div>
                    <div>
                      <dt>Last opened chapter</dt>
                      <dd>{lastOpened}</dd>
                    </div>
                    <div>
                      <dt>Percent complete</dt>
                      <dd>{completed} completed</dd>
                    </div>
                    <div>
                      <dt>Last activity</dt>
                      <dd>{progress.lastActivityAt || reader.lastActivityAt || "No activity"}</dd>
                    </div>
                    <div>
                      <dt>Chapter Three checkpoint</dt>
                      <dd>{checkpointEntries.has("chapter-03") ? "Submitted" : "Open"}</dd>
                    </div>
                    <div>
                      <dt>Chapter Seven checkpoint</dt>
                      <dd>{checkpointEntries.has("chapter-07") ? "Submitted" : "Open"}</dd>
                    </div>
                    <div>
                      <dt>Chapter Twenty checkpoint</dt>
                      <dd>{checkpointEntries.has("chapter-20") ? "Submitted" : "Open"}</dd>
                    </div>
                    <div>
                      <dt>Notes count</dt>
                      <dd>{feedback.entries.length}</dd>
                    </div>
                  </dl>
                  {feedback.entries.length > 0 ? (
                    <details>
                      <summary>Feedback viewer</summary>
                      {feedback.entries.map((entry) => (
                        <div key={entry.id} className="reader-room-feedback-entry">
                          <p className="meta">{entry.createdAt}</p>
                          {entry.slug ? <p>Chapter: {entry.slug}</p> : null}
                          {entry.checkpoint ? <p>Checkpoint: {entry.checkpoint}</p> : null}
                          {entry.note ? <p>{entry.note}</p> : null}
                          {entry.answers
                            ? Object.entries(entry.answers).map(([key, value]) => (
                                <p key={key}>
                                  <strong>{key}:</strong> {value}
                                </p>
                              ))
                            : null}
                        </div>
                      ))}
                    </details>
                  ) : null}
                  <form
                    action="/system/reader-intelligence/reader-room/revoke"
                    method="post"
                  >
                    <input type="hidden" name="readerId" value={reader.readerId} />
                    <button type="submit" className="text-cta">
                      Revoke access
                    </button>
                  </form>
                </article>
              )
            })}
          </div>
        ) : (
          <p>No beta-reader records are available yet.</p>
        )}
    </section>
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

      <BetaReaderRoomSection />

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
