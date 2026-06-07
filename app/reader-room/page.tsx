import Link from "next/link"
import { createPageMetadata } from "@/lib/siteMetadata"
import {
  readerRoomAuthor,
  readerRoomBookTitle,
  readerRoomVolumeTitle,
} from "@/lib/readerRoomConfig"
import {
  getReaderRoomProgressSummary,
  getReaderRoomSession,
} from "@/lib/readerRoomAccess"
import { readerRoomHref } from "@/lib/readerRoomLinks"
import { getReaderRoomManifest } from "@/lib/readerRoomStorage"

export const dynamic = "force-dynamic"
export const revalidate = 0

export const metadata = {
  ...createPageMetadata({
    title: "Reader Room — W.D. Blackwoods",
    description: "A private beta-reader room for Hold the Earth.",
    path: "/reader-room",
  }),
  robots: {
    index: false,
    follow: false,
  },
}

function unavailable() {
  return (
    <main className="reader-room-page document-page">
      <section className="reader-room-panel">
        <p className="system-layer-label">Private access</p>
        <h1>Reading link required</h1>
        <p>
          This room opens only from a private invitation link. If your link has
          expired, a new one can be prepared.
        </p>
      </section>
    </main>
  )
}

export default async function ReaderRoomPage() {
  const auth = await getReaderRoomSession()

  if (!auth.ok) {
    return unavailable()
  }

  const manifest = await getReaderRoomManifest(auth.reader.bookVersion)

  if (!manifest) {
    return (
      <main className="reader-room-page document-page">
        <section className="reader-room-panel">
          <p className="system-layer-label">Configuration</p>
          <h1>Reader Room is not ready</h1>
          <p>The private manuscript has not been uploaded for this edition.</p>
        </section>
      </main>
    )
  }

  const { progress, percentComplete } = await getReaderRoomProgressSummary(auth.reader)
  const resumeSlug = progress.lastOpenedSlug || manifest.sections[0]?.slug
  const resumeHref = resumeSlug ? await readerRoomHref(`/reader-room/read/${resumeSlug}`) : undefined
  const logoutAction = await readerRoomHref("/api/reader-room/logout")
  const sectionsWithHrefs = await Promise.all(
    manifest.sections.map(async (section) => ({
      ...section,
      href: await readerRoomHref(`/reader-room/read/${section.slug}`),
    }))
  )

  return (
    <main className="reader-room-page document-page">
      <section className="reader-room-panel">
        <p className="system-layer-label">Private beta-reader room</p>
        <h1>{readerRoomBookTitle}</h1>
        <p className="reader-room-kicker">{readerRoomVolumeTitle}</p>
        <p className="meta">by {readerRoomAuthor}</p>
        <div className="reader-room-entry-notice">
          <p>© 2026 Wilford Dereck Woods. All rights reserved.</p>
          <p>Private beta-reader edition. Not for distribution.</p>
          <p>Private reader copy · {auth.reader.displayName} · {auth.reader.bookVersion}</p>
        </div>
        <p>
          Thank you for reading this early edition. Please read at your natural
          pace. I am looking for your honest reactions as a reader, not
          line-by-line proofreading. At the end of Chapters Three, Seven, and
          Twenty, you will see a short feedback form.
        </p>
        <p className="meta">{percentComplete}% complete</p>
        {resumeHref ? (
          <Link href={resumeHref} className="primary-cta">
            Resume reading
          </Link>
        ) : null}
      </section>

      <section className="reader-room-panel">
        <p className="system-layer-label">Table of contents</p>
        <h2>Hold the Earth</h2>
        <ol className="reader-room-toc">
          {sectionsWithHrefs.map((section) => (
            <li key={section.slug}>
              <Link href={section.href}>
                <span>{section.label}</span>
                <strong>{section.title}</strong>
              </Link>
            </li>
          ))}
        </ol>
      </section>

      <section className="reader-room-panel">
        <form action={logoutAction} method="post">
          <button type="submit" className="text-cta">
            Leave Reader Room
          </button>
        </form>
      </section>
    </main>
  )
}
