import { NextResponse } from "next/server"
import { getReaderRoomSession, recordReaderRoomOpen } from "@/lib/readerRoomAccess"
import { getReaderRoomChapter, getReaderRoomManifest } from "@/lib/readerRoomStorage"

export const dynamic = "force-dynamic"

const privateHeaders = {
  "Cache-Control": "no-store, private",
  "X-Robots-Tag": "noindex, nofollow, noarchive",
}

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ slug?: string }> }
) {
  const auth = await getReaderRoomSession()

  if (!auth.ok) {
    return NextResponse.json({ error: "Unavailable." }, { status: 404, headers: privateHeaders })
  }

  const { slug } = await params

  if (!slug) {
    return NextResponse.json({ error: "Unavailable." }, { status: 404, headers: privateHeaders })
  }

  const [manifest, chapter] = await Promise.all([
    getReaderRoomManifest(auth.reader.bookVersion),
    getReaderRoomChapter(auth.reader.bookVersion, slug),
  ])

  if (!manifest || !chapter || !manifest.sections.some((section) => section.slug === slug)) {
    return NextResponse.json({ error: "Unavailable." }, { status: 404, headers: privateHeaders })
  }

  await recordReaderRoomOpen(auth.reader, slug)

  return NextResponse.json(
    {
      slug: chapter.slug,
      title: chapter.title,
      label: chapter.label,
      html: chapter.html,
      checkpoint: chapter.checkpoint || null,
    },
    { headers: privateHeaders }
  )
}
