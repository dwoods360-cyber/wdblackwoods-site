import { NextResponse } from "next/server"
import { hasReaderIntelligenceAccess } from "@/lib/readerIntelligenceAccess"
import { getReaderRoomAdminSummary } from "@/lib/readerRoomAccess"

export const dynamic = "force-dynamic"

function csvEscape(value: unknown) {
  const text = String(value ?? "")
  return `"${text.replaceAll('"', '""')}"`
}

export async function GET() {
  if (!(await hasReaderIntelligenceAccess())) {
    return new NextResponse("Not found.", { status: 404 })
  }

  const summary = await getReaderRoomAdminSummary()
  const rows = [
    ["Reader", "Email", "LastOpenedChapter", "CompletedCount", "NotesCount", "Revoked"],
    ...summary.readers.map(({ reader, progress, feedback }) => [
      reader.displayName,
      reader.email,
      progress.lastOpenedSlug || "",
      progress.completedSlugs.length,
      feedback.entries.length,
      reader.revoked ? "yes" : "no",
    ]),
  ]
  const csv = rows.map((row) => row.map(csvEscape).join(",")).join("\n")

  return new NextResponse(csv, {
    headers: {
      "Cache-Control": "no-store, private",
      "Content-Disposition": "attachment; filename=reader-room-feedback.csv",
      "Content-Type": "text/csv; charset=utf-8",
      "X-Robots-Tag": "noindex, nofollow, noarchive",
    },
  })
}
