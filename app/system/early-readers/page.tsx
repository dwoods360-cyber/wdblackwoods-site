import Link from "next/link"
import { notFound } from "next/navigation"
import { createPageMetadata } from "@/lib/siteMetadata"
import {
  getEligibleEarlyReaders,
  getLatestPreparedBatch,
  getReaderSelectionOptions,
  getReaderHistorySummaries,
  hasGeneratedMailMergeCsv,
  isEarlyReaderToolEnabled,
  readEarlyReaders,
} from "@/lib/earlyReaderMailMerge"

export const dynamic = "force-dynamic"
export const revalidate = 0

export const metadata = {
  ...createPageMetadata({
    title: "Early Readers — W.D. Blackwoods",
    description: "A local-only control surface for private early-reader invitations.",
    path: "/system/early-readers",
  }),
  robots: {
    index: false,
    follow: false,
  },
}

export default async function EarlyReadersPage({
  searchParams,
}: {
  searchParams: Promise<{
    generated?: string
    selection?: string
    expires?: string
    batch?: string
    sent?: string
  }>
}) {
  if (!isEarlyReaderToolEnabled()) {
    notFound()
  }

  const resolvedSearchParams = await searchParams
  const readerFile = readEarlyReaders()
  const eligibleReaders = getEligibleEarlyReaders()
  const options = getReaderSelectionOptions()
  const readerHistories = getReaderHistorySummaries()
  const latestPreparedBatch = getLatestPreparedBatch()
  const selectedOption =
    options.find((option) => option.id === resolvedSearchParams.selection) ?? options[0]
  const generated = resolvedSearchParams.generated === "1" && hasGeneratedMailMergeCsv()
  const activeBatchId = resolvedSearchParams.batch ?? latestPreparedBatch?.batchId
  const expirationLabel = resolvedSearchParams.expires ?? "30 days after generation"

  return (
    <main className="system-page document-page">
      <section className="system-section">
        <p className="system-layer-label">Local instrument</p>
        <h1>Early Readers</h1>
        <p>
          Generate a reviewable Gmail mail-merge CSV for private invitation links.
          This tool reads local data only and sends no email.
        </p>
      </section>

      <section className="system-section">
        <p className="system-layer-label">Reader file</p>
        <h1>{eligibleReaders.length} eligible readers</h1>
        {readerFile.missing ? (
          <p>
            Copy <code>private/early-readers.example.csv</code> to{" "}
            <code>private/early-readers.csv</code> before generating invitations.
          </p>
        ) : (
          <p>
            Only rows marked <code>active</code> are eligible. Rows marked{" "}
            <code>paused</code> or <code>do_not_contact</code> are excluded.
          </p>
        )}
      </section>

      <section className="system-section">
        <p className="system-layer-label">Invitation set</p>
        <h1>Gmail merge CSV</h1>
        <form action="/system/early-readers/generate" method="post" className="reader-tool-form">
          <label htmlFor="selection">Selected chapter or pack</label>
          <select id="selection" name="selection" defaultValue={selectedOption?.id} required>
            {options.map((option) => (
              <option key={option.id} value={option.id}>
                {option.label}
              </option>
            ))}
          </select>
          <button type="submit" className="text-cta">
            Generate Gmail mail-merge CSV
          </button>
        </form>
        {generated ? (
          <div className="reader-tool-actions">
            <p>
              <Link href="/system/early-readers/download" className="system-link">
                Download generated CSV
              </Link>
            </p>
            {activeBatchId ? (
              <form action="/system/early-readers/mark-sent" method="post">
                <input type="hidden" name="batchId" value={activeBatchId} />
                <button type="submit" className="text-cta">
                  Mark batch as sent
                </button>
              </form>
            ) : null}
          </div>
        ) : null}
        {resolvedSearchParams.sent === "1" ? (
          <p>Batch marked as sent. Future feedback can now be tied to this version.</p>
        ) : null}
      </section>

      <section className="system-section">
        <p className="system-layer-label">Preview</p>
        <h1>Recipients</h1>
        {eligibleReaders.length > 0 ? (
          <div className="reader-tool-table-wrap">
            <table className="reader-tool-table">
              <thead>
                <tr>
                  <th>First name</th>
                  <th>Last name</th>
                  <th>Email</th>
                  <th>Selected chapter or pack</th>
                  <th>Expiration date</th>
                  <th>Invite-link status</th>
                </tr>
              </thead>
              <tbody>
                {eligibleReaders.map((reader) => (
                  <tr key={`${reader.readerId}-${reader.email}`}>
                    <td>{reader.firstName}</td>
                    <td>{reader.lastName}</td>
                    <td>{reader.email}</td>
                    <td>{selectedOption?.label ?? "Unavailable"}</td>
                    <td>{expirationLabel}</td>
                    <td>{generated ? "Generated locally" : "Ready to generate"}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <p>No active early-reader rows are available.</p>
        )}
      </section>

      <section className="system-section">
        <p className="system-layer-label">Send history</p>
        <h1>Reader Records</h1>
        {readerHistories.length > 0 ? (
          <div className="reader-tool-table-wrap">
            <table className="reader-tool-table">
              <thead>
                <tr>
                  <th>Reader</th>
                  <th>Email</th>
                  <th>Status</th>
                  <th>Last sent</th>
                  <th>Last version</th>
                  <th>Last sent date</th>
                  <th>Send count</th>
                  <th>Notes</th>
                </tr>
              </thead>
              <tbody>
                {readerHistories.map((history) => (
                  <tr key={`${history.reader.readerId}-history`}>
                    <td>
                      <details>
                        <summary>
                          {history.reader.firstName} {history.reader.lastName}
                        </summary>
                        {history.records.length > 0 ? (
                          <table className="reader-tool-history">
                            <thead>
                              <tr>
                                <th>Prepared</th>
                                <th>Sent</th>
                                <th>Chapter</th>
                                <th>Version</th>
                                <th>Status</th>
                              </tr>
                            </thead>
                            <tbody>
                              {history.records.map((record) => (
                                <tr
                                  key={`${record.batchId}-${record.readerId}-${record.chapterSlug}`}
                                >
                                  <td>{record.preparedAt.slice(0, 10)}</td>
                                  <td>{record.sentAt ? record.sentAt.slice(0, 10) : "—"}</td>
                                  <td>{record.chapterTitle}</td>
                                  <td>{record.chapterVersion || record.packVersion || "—"}</td>
                                  <td>{record.status}</td>
                                </tr>
                              ))}
                            </tbody>
                          </table>
                        ) : (
                          <p>No prepared sends yet.</p>
                        )}
                      </details>
                    </td>
                    <td>{history.reader.email}</td>
                    <td>{history.reader.status}</td>
                    <td>{history.lastTitle}</td>
                    <td>{history.lastVersion}</td>
                    <td>{history.lastSentDate}</td>
                    <td>{history.sendCount}</td>
                    <td>{history.reader.notes || "—"}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <p>No reader rows are available.</p>
        )}
      </section>
    </main>
  )
}
