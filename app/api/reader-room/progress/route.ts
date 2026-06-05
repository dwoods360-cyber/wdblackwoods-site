import { NextResponse } from "next/server"
import { getReaderRoomSession, markReaderRoomChapterComplete } from "@/lib/readerRoomAccess"
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

  if (typeof slug !== "string") {
    return new NextResponse("Unavailable.", {
      status: 400,
      headers: { "Cache-Control": "no-store, private" },
    })
  }

  await markReaderRoomChapterComplete(auth.reader, slug)

  return NextResponse.redirect(new URL(readerRoomRedirectPathForHost(request.headers.get("host"), `/reader-room/read/${slug}`), request.url), {
    status: 303,
    headers: { "Cache-Control": "no-store, private" },
  })
}
