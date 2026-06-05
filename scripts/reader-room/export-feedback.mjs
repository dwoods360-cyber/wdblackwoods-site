import { bookVersion, listJson, prefix } from "./common.mjs"

function csvEscape(value) {
  const text = String(value ?? "")
  return `"${text.replaceAll('"', '""')}"`
}

const version = bookVersion()
const [readers, feedbackRecords] = await Promise.all([
  listJson(`${prefix(version)}/readers/`),
  listJson(`${prefix(version)}/feedback/`),
])
const rows = [["ReaderId", "Reader", "Email", "EntryType", "Chapter", "Checkpoint", "CreatedAt", "Text"]]

for (const reader of readers) {
  const feedback = feedbackRecords.find((record) => record.readerId === reader.readerId)

  for (const entry of feedback?.entries || []) {
    rows.push([
      reader.readerId,
      reader.displayName,
      reader.email,
      entry.checkpoint ? "checkpoint" : "note",
      entry.slug || "",
      entry.checkpoint || "",
      entry.createdAt,
      entry.note || Object.entries(entry.answers || {}).map(([key, value]) => `${key}: ${value}`).join("\n"),
    ])
  }
}

console.log(rows.map((row) => row.map(csvEscape).join(",")).join("\n"))
