import Link from "next/link"
import { notFound, redirect } from "next/navigation"
import ReaderRoomThemeToggle from "@/components/ReaderRoomThemeToggle"
import { createPageMetadata } from "@/lib/siteMetadata"
import {
  getReaderRoomChapterNotes,
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
  searchParams,
}: {
  params: Promise<{ slug?: string }>
  searchParams: Promise<{ note?: string; status?: string }>
}) {
  const auth = await getReaderRoomSession()

  if (!auth.ok) {
    redirect(await readerRoomHref("/reader-room"))
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
  const [{ progress, percentComplete }, savedNotes, query] = await Promise.all([
    getReaderRoomProgressSummary(auth.reader),
    getReaderRoomChapterNotes(auth.reader, slug),
    searchParams,
  ])
  const isComplete = progress.completedSlugs.includes(slug)
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
        {isComplete ? <p className="reader-room-state-label">Completed</p> : null}
        <div
          className="reader-room-prose"
          dangerouslySetInnerHTML={{ __html: chapter.html }}
        />
      </article>

      <section id="chapter-actions" className="reader-room-actions">
        {query.status === "complete" ? (
          <p className="reader-room-confirmation">Chapter marked complete.</p>
        ) : null}
        <form action={progressAction} method="post">
          <input type="hidden" name="slug" value={slug} />
          <input type="hidden" name="status" value="complete" />
          <button type="submit" className="text-cta">
            Mark chapter complete
          </button>
        </form>
      </section>

      <section id="private-notes" className="reader-room-actions">
        {query.note === "saved" ? (
          <p className="reader-room-confirmation">Private note saved.</p>
        ) : null}
        <form action={feedbackAction} method="post" className="reader-room-form">
          <input type="hidden" name="slug" value={slug} />
          <label htmlFor="note">Private note after this chapter</label>
          <textarea id="note" name="note" rows={5} />
          <button type="submit" className="text-cta">
            Save note
          </button>
        </form>

        {savedNotes.length > 0 ? (
          <div className="reader-room-saved-notes">
            <h2>Saved private notes for this chapter</h2>
            <ul>
              {savedNotes.map((entry) => (
                <li key={entry.id}>
                  <p>{entry.note}</p>
                  <time dateTime={entry.createdAt}>
                    {new Intl.DateTimeFormat("en", {
                      dateStyle: "medium",
                      timeStyle: "short",
                    }).format(new Date(entry.createdAt))}
                  </time>
                </li>
              ))}
            </ul>
          </div>
        ) : null}
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
