import Link from "next/link"
import { notFound } from "next/navigation"
import { createPageMetadata } from "@/lib/siteMetadata"
import {
  getEligibleEarlyReaders,
  getInviteModeLabel,
  getLatestPreparedBatch,
  getReaderHistorySummaries,
  getReaderSelectionOptions,
  getTestHistory,
  hasGeneratedLiveTestCsv,
  hasGeneratedMailMergeCsv,
  isEarlyReaderToolEnabled,
  readEarlyReaders,
  type InviteMode,
} from "@/lib/earlyReaderMailMerge"

export const dynamic = "force-dynamic"
export const revalidate = 0

const liveTestSubject = "Early-reader invitation test — What Coffee Demands"
const liveTestBody = `Hello @FirstName,

This is a test of the private early-reader invitation flow for What Coffee Demands.

Please open the link below:

@InviteLink

Expected result:
- the link opens the deployed website
- the invitation token disappears from the browser URL
- the Early Reader Room opens
- the selected chapter version is visible

— W.D. Blackwoods`

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

function normalizeMode(mode: string | undefined): InviteMode {
  if (mode === "live_test" || mode === "live_batch") {
    return mode
  }

  return "local_test"
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
    mode?: string
  }>
}) {
  if (!isEarlyReaderToolEnabled()) {
    notFound()
  }

  const resolvedSearchParams = await searchParams
  const inviteMode = normalizeMode(resolvedSearchParams.mode)
  const readerFile = readEarlyReaders()
  const eligibleReaders = getEligibleEarlyReaders()
  const options = getReaderSelectionOptions()
  const readerHistories = getReaderHistorySummaries()
  const testHistory = getTestHistory()
  const latestPreparedBatch = getLatestPreparedBatch()
  const selectedOption =
    options.find((option) => option.id === resolvedSearchParams.selection) ?? options[0]
  const generated = resolvedSearchParams.generated === "1"
  const generatedMailMerge = generated && inviteMode !== "live_test" && hasGeneratedMailMergeCsv()
  const generatedLiveTest = generated && inviteMode === "live_test" && hasGeneratedLiveTestCsv()
  const activeBatchId = resolvedSearchParams.batch ?? latestPreparedBatch?.batchId
  const expirationLabel = resolvedSearchParams.expires ?? "30 days after generation"
  const isLiveMode = inviteMode === "live_test" || inviteMode === "live_batch"
  const isLiveTest = inviteMode === "live_test"
  const isLiveBatch = inviteMode === "live_batch"

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
            Only rows marked <code>active</code> are eligible for LIVE BATCH. Rows
            marked <code>paused</code> or <code>do_not_contact</code> are excluded.
          </p>
        )}
      </section>

      <section className="system-section">
        <p className="system-layer-label">Invitation destination</p>
        <h1>{getInviteModeLabel(inviteMode)}</h1>
        <p>
          LOCAL TEST links open only on this Mac. LIVE TEST verifies the deployed
          reading-room path with one test recipient. LIVE BATCH prepares reviewed
          invitations for actual early readers.
        </p>
        <form action="/system/early-readers" method="get" className="reader-tool-form">
          <label htmlFor="mode">Invitation destination</label>
          <select id="mode" name="mode" defaultValue={inviteMode}>
            <option value="local_test">LOCAL TEST — localhost only</option>
            <option value="live_test">
              LIVE TEST — send one production-valid invitation to yourself
            </option>
            <option value="live_batch">LIVE BATCH — prepare invitations for early readers</option>
          </select>
          <button type="submit" className="text-cta">
            Set invitation destination
          </button>
        </form>
      </section>

      <section className="system-section">
        <p className="system-layer-label">Invitation set</p>
        <h1>Gmail merge CSV</h1>
        {isLiveMode ? <p className="reader-tool-warning">LIVE INVITATION BATCH</p> : null}
        <form action="/system/early-readers/generate" method="post" className="reader-tool-form">
          <input type="hidden" name="inviteMode" value={inviteMode} />
          <label htmlFor="selection">Selected chapter or pack</label>
          <select id="selection" name="selection" defaultValue={selectedOption?.id} required>
            {options.map((option) => (
              <option key={option.id} value={option.id}>
                {option.label}
              </option>
            ))}
          </select>

          {isLiveTest ? (
            <fieldset className="reader-tool-fieldset">
              <legend>Test recipient</legend>
              <p>This address is used only for the current test invitation.</p>
              <label htmlFor="testRecipientFirstName">Test recipient first name</label>
              <input id="testRecipientFirstName" name="testRecipientFirstName" required />
              <label htmlFor="testRecipientEmail">Test recipient email</label>
              <input id="testRecipientEmail" name="testRecipientEmail" type="email" required />
            </fieldset>
          ) : null}

          {isLiveMode ? (
            <label className="reader-tool-checkbox">
              <input name="liveAccessConfirmed" type="checkbox" required />I understand that{" "}
              {isLiveBatch ? "these links" : "this will generate a link"} will grant access through
              the live website.
            </label>
          ) : null}

          {isLiveBatch ? (
            <label className="reader-tool-checkbox">
              <input name="reviewedRecipientsConfirmed" type="checkbox" required />I have reviewed
              the selected readers and chapter version.
            </label>
          ) : null}

          <button type="submit" className="text-cta">
            Generate Gmail mail-merge CSV
          </button>
        </form>

        {generatedMailMerge || generatedLiveTest ? (
          <div className="reader-tool-actions">
            <p>
              <Link
                href={
                  generatedLiveTest
                    ? "/system/early-readers/download?file=live-test"
                    : "/system/early-readers/download"
                }
                className="system-link"
              >
                Download generated CSV
              </Link>
            </p>
            {generatedMailMerge && activeBatchId ? (
              <form action="/system/early-readers/mark-sent" method="post">
                <input type="hidden" name="batchId" value={activeBatchId} />
                <button type="submit" className="text-cta">
                  Mark batch as sent
                </button>
              </form>
            ) : null}
          </div>
        ) : null}

        {generatedLiveTest ? (
          <div className="reader-tool-draft">
            <p className="system-layer-label">LIVE TEST email draft</p>
            <label htmlFor="liveTestSubject">Subject</label>
            <textarea id="liveTestSubject" readOnly rows={1} value={liveTestSubject} />
            <label htmlFor="liveTestBody">Body</label>
            <textarea id="liveTestBody" readOnly rows={12} value={liveTestBody} />
          </div>
        ) : null}

        {resolvedSearchParams.sent === "1" ? (
          <p>Batch marked as sent. Future feedback can now be tied to this version.</p>
        ) : null}
      </section>

      <section className="system-section">
        <p className="system-layer-label">Preview</p>
        <h1>Recipients</h1>
        <div className="reader-tool-table-wrap">
          <table className="reader-tool-table">
            <thead>
              <tr>
                <th>Invitation mode</th>
                <th>Recipient source</th>
                <th>Selected chapter or pack</th>
                <th>Expiration date</th>
                <th>Invite-link status</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>{getInviteModeLabel(inviteMode)}</td>
                <td>{isLiveTest ? "One manually entered test recipient" : "Active reader CSV"}</td>
                <td>{selectedOption?.label ?? "Unavailable"}</td>
                <td>{expirationLabel}</td>
                <td>{generated ? "Generated locally" : "Ready to generate"}</td>
              </tr>
            </tbody>
          </table>
        </div>
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
                                <th>Mode</th>
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
                                  <td>{record.inviteMode}</td>
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

      <section className="system-section">
        <p className="system-layer-label">Test history</p>
        <h1>LIVE TEST Records</h1>
        {testHistory.length > 0 ? (
          <div className="reader-tool-table-wrap">
            <table className="reader-tool-table">
              <thead>
                <tr>
                  <th>Prepared</th>
                  <th>Chapter</th>
                  <th>Version</th>
                  <th>Expiration date</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {testHistory.map((record) => (
                  <tr key={`${record.batchId}-${record.preparedAt}`}>
                    <td>{record.preparedAt.slice(0, 10)}</td>
                    <td>{record.chapterTitle}</td>
                    <td>{record.chapterVersion || record.packVersion || "—"}</td>
                    <td>{record.inviteExpiresAt.slice(0, 10)}</td>
                    <td>{record.status}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <p>No LIVE TEST invitations have been prepared.</p>
        )}
      </section>
    </main>
  )
}
