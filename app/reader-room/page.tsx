import Link from "next/link"
import { createPageMetadata } from "@/lib/siteMetadata"
import { getAuthorizedChapters, getAuthorizedReader } from "@/lib/earlyReaderAccess"

export const dynamic = "force-dynamic"
export const revalidate = 0

export const metadata = {
  ...createPageMetadata({
    title: "Early Reader Room — W.D. Blackwoods",
    description: "A private reading room for selected early pages.",
    path: "/reader-room",
  }),
  robots: {
    index: false,
    follow: false,
  },
}

export default async function ReaderRoomPage() {
  const reader = await getAuthorizedReader()
  const chapters = getAuthorizedChapters(reader)

  return (
    <main className="system-page document-page">
      <section className="system-section">
        <p className="system-layer-label">Early Reader Room</p>
        <h1>Hold the Earth</h1>
        <p>
          This reading room contains selected pages shared for private review.
        </p>
        <p>
          Please read naturally. Honest reactions are more useful than polished
          critique.
        </p>
      </section>

      {chapters.length > 0 ? (
        <section className="system-section">
          <p className="system-layer-label">Selected pages</p>
          <h1>Available Readings</h1>
          <ul className="suggested-order">
            {chapters.map((chapter) => (
              <li key={chapter.slug} className="primary">
                <Link href={`/reader-room/chapter/${chapter.slug}`} className="system-link">
                  {chapter.title}
                </Link>
              </li>
            ))}
          </ul>
        </section>
      ) : (
        <section className="system-section">
          <p className="system-layer-label">Private access</p>
          <h1>Reading link required</h1>
          <p>
            This room opens only from a private invitation link. If your link has
            expired, a new one will need to be prepared.
          </p>
        </section>
      )}
    </main>
  )
}
