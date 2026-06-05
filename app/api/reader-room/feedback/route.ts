import { NextResponse } from "next/server"
import { getReaderRoomSession, saveReaderRoomNote } from "@/lib/readerRoomAccess"
import { readerRoomRedirectPathForHost } from "@/lib/readerRoomLinks"

export const dynamic = "force-dynamic"

export async function POST(request: Request) {
  const auth = await getReaderRoomSession()

  if (!auth.ok) {
    return new NextResponse("Unavailable.", {
      status: 404,
      headers: { "Cache-Control": "no-store, private" },
    })
  }

  const formData = await request.formData()
  const slug = formData.get("slug")
  const checkpoint = formData.get("checkpoint")
  const note = formData.get("note")
  const answers: Record<string, string> = {}

  for (const [key, value] of formData.entries()) {
    if (key.startsWith("answer-") && typeof value === "string" && value.trim()) {
      answers[key] = value.trim()
    }
  }

  await saveReaderRoomNote(auth.reader, {
    slug: typeof slug === "string" ? slug : undefined,
    checkpoint:
      checkpoint === "chapter-03" || checkpoint === "chapter-07" || checkpoint === "chapter-20"
        ? checkpoint
        : undefined,
    note: typeof note === "string" && note.trim() ? note.trim() : undefined,
    answers: Object.keys(answers).length > 0 ? answers : undefined,
  })

  return NextResponse.redirect(new URL(readerRoomRedirectPathForHost(request.headers.get("host"), "/reader-room"), request.url), {
    status: 303,
    headers: { "Cache-Control": "no-store, private" },
  })
}
