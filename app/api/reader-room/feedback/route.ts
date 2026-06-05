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
  const trimmedNote = typeof note === "string" ? note.trim() : ""
  const answers: Record<string, string> = {}

  for (const [key, value] of formData.entries()) {
    if (key.startsWith("answer-") && typeof value === "string" && value.trim()) {
      answers[key] = value.trim()
    }
  }

  if (!trimmedNote && Object.keys(answers).length === 0) {
    return new NextResponse("Private note cannot be empty.", {
      status: 400,
      headers: { "Cache-Control": "no-store, private" },
    })
  }

  const chapterSlug = typeof slug === "string" && slug ? slug : undefined

  await saveReaderRoomNote(auth.reader, {
    slug: chapterSlug,
    checkpoint:
      checkpoint === "chapter-03" || checkpoint === "chapter-07" || checkpoint === "chapter-20"
        ? checkpoint
        : undefined,
    note: trimmedNote || undefined,
    answers: Object.keys(answers).length > 0 ? answers : undefined,
  })
  const redirectUrl = new URL(
    readerRoomRedirectPathForHost(
      request.headers.get("host"),
      chapterSlug ? `/reader-room/read/${chapterSlug}` : "/reader-room"
    ),
    request.url
  )

  if (chapterSlug) {
    redirectUrl.searchParams.set("note", "saved")
    redirectUrl.hash = "private-notes"
  }

  return NextResponse.redirect(redirectUrl, {
    status: 303,
    headers: { "Cache-Control": "no-store, private" },
  })
}
