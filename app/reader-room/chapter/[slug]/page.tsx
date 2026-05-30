import Link from "next/link"
import { notFound } from "next/navigation"
import { createPageMetadata } from "@/lib/siteMetadata"
import { getAuthorizedReader, isChapterAuthorized } from "@/lib/earlyReaderAccess"
import { getReaderChapter } from "@/content/reader-room/manifest"

export const dynamic = "force-dynamic"
export const revalidate = 0

export const metadata = {
  ...createPageMetadata({
    title: "Private Reading — W.D. Blackwoods",
    description: "A private early-reader chapter page.",
    path: "/reader-room",
  }),
  robots: {
    index: false,
    follow: false,
  },
}

export default async function ReaderChapterPage({
  params,
}: {
  params: Promise<{ slug?: string }>
}) {
  const resolvedParams = await params
  const slug = resolvedParams.slug

  if (!slug) {
    return notFound()
  }

  const chapter = getReaderChapter(slug)
  const reader = await getAuthorizedReader()

  if (!chapter || !isChapterAuthorized(reader, slug)) {
    return notFound()
  }

  return (
    <main className="document-page archive-document-page">
      <nav>
        <Link href="/reader-room">Reader Room</Link>
      </nav>

      <section>
        <p className="meta">{chapter.volume}</p>
        <h1>{chapter.title}</h1>
        <p>
          Selected reading pages will appear here when the opening chapters are
          ready.
        </p>
        <p className="meta">
          Optional feedback link will be placed here when review pages are
          prepared.
        </p>
      </section>
    </main>
  )
}
