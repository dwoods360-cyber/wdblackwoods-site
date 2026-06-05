import Link from "next/link"
import { notFound } from "next/navigation"
import ReaderRoomThemeToggle from "@/components/ReaderRoomThemeToggle"
import { createPageMetadata } from "@/lib/siteMetadata"
import {
  getReaderRoomProgressSummary,
  getReaderRoomSession,
  recordReaderRoomOpen,
} from "@/lib/readerRoomAccess"
import { readerRoomHref } from "@/lib/readerRoomLinks"
import { getReaderRoomChapter, getReaderRoomManifest } from "@/lib/readerRoomStorage"

export const dynamic = "force-dynamic"
export const revalidate = 0

export const metadata = {
  ...createPageMetadata({
    title: "Private Reading — W.D. Blackwoods",
    description: "A private beta-reader chapter page.",
    path: "/reader-room/read",
  }),
  robots: {
    index: false,
    follow: false,
  },
}

export default async function ReaderRoomReadPage({
  params,
}: {
  params: Promise<{ slug?: string }>
}) {
  const auth = await getReaderRoomSession()

  if (!auth.ok) {
    return notFound()
  }

  const { slug } = await params

  if (!slug) {
    return notFound()
  }

  const [manifest, chapter] = await Promise.all([
    getReaderRoomManifest(auth.reader.bookVersion),
    getReaderRoomChapter(auth.reader.bookVersion, slug),
  ])

  if (!manifest || !chapter || !manifest.sections.some((section) => section.slug === slug)) {
    return notFound()
  }

  await recordReaderRoomOpen(auth.reader, slug)
  const { percentComplete } = await getReaderRoomProgressSummary(auth.reader)
  const currentIndex = manifest.sections.findIndex((section) => section.slug === slug)
  const previous = currentIndex > 0 ? manifest.sections[currentIndex - 1] : undefined
  const next = currentIndex >= 0 ? manifest.sections[currentIndex + 1] : undefined
  const roomHref = await readerRoomHref("/reader-room")
  const progressAction = await readerRoomHref("/api/reader-room/progress")
  const feedbackAction = await readerRoomHref("/api/reader-room/feedback")
  const checkpointHref = chapter.checkpoint
    ? await readerRoomHref(`/reader-room/checkpoint/${chapter.checkpoint}`)
    : undefined
  const previousHref = previous ? await readerRoomHref(`/reader-room/read/${previous.slug}`) : undefined
  const nextHref = next ? await readerRoomHref(`/reader-room/read/${next.slug}`) : undefined

  return (
    <main className="reader-room-page reader-room-reading-page document-page">
      <nav className="reader-room-nav">
        <Link href={roomHref}>Reader Room</Link>
        <ReaderRoomThemeToggle />
      </nav>

      <article className="reader-room-chapter">
        <p className="system-layer-label">{chapter.label}</p>
        <h1>{chapter.title}</h1>
        <p className="meta">{percentComplete}% complete</p>
        <div
          className="reader-room-prose"
          dangerouslySetInnerHTML={{ __html: chapter.html }}
        />
      </article>

      <section className="reader-room-actions">
        <form action={progressAction} method="post">
          <input type="hidden" name="slug" value={slug} />
          <input type="hidden" name="status" value="complete" />
          <button type="submit" className="text-cta">
            Mark chapter complete
          </button>
        </form>

        <form action={feedbackAction} method="post" className="reader-room-form">
          <input type="hidden" name="slug" value={slug} />
          <label htmlFor="note">Private note after this chapter</label>
          <textarea id="note" name="note" rows={5} />
          <button type="submit" className="text-cta">
            Save note
          </button>
        </form>
      </section>

      {checkpointHref ? (
        <section className="reader-room-actions">
          <Link href={checkpointHref} className="primary-cta">
            Open checkpoint questions
          </Link>
        </section>
      ) : null}

      <nav className="reader-room-chapter-nav">
        {previous && previousHref ? <Link href={previousHref}>Previous: {previous.title}</Link> : <span />}
        {next && nextHref ? <Link href={nextHref}>Next: {next.title}</Link> : <span />}
      </nav>

      <footer className="reader-room-watermark">
        Private reader copy · {auth.reader.displayName} · {auth.reader.bookVersion}
      </footer>
    </main>
  )
}
