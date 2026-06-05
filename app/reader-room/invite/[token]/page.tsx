import { createPageMetadata } from "@/lib/siteMetadata"
import {
  readerRoomAuthor,
  readerRoomBookTitle,
  readerRoomVolumeTitle,
} from "@/lib/readerRoomConfig"
import { inspectReaderRoomInvite } from "@/lib/readerRoomAccess"

export const dynamic = "force-dynamic"
export const revalidate = 0

export const metadata = {
  ...createPageMetadata({
    title: "Private Invitation — W.D. Blackwoods",
    description: "A private beta-reader invitation.",
    path: "/reader-room/invite",
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
        <p className="system-layer-label">Private invitation</p>
        <h1>Reading link unavailable</h1>
        <p>
          This private reading invitation is unavailable or has expired. A new
          invitation can be prepared if needed.
        </p>
      </section>
    </main>
  )
}

export default async function ReaderRoomInvitePage({
  params,
}: {
  params: Promise<{ token?: string }>
}) {
  const { token } = await params

  if (!token) {
    return unavailable()
  }

  const invite = await inspectReaderRoomInvite(token)

  if (!invite) {
    return unavailable()
  }

  return (
    <main className="reader-room-page document-page">
      <section className="reader-room-panel">
        <p className="system-layer-label">Private beta-reading invitation</p>
        <h1>{readerRoomBookTitle}</h1>
        <p className="reader-room-kicker">{readerRoomVolumeTitle}</p>
        <p className="meta">by {readerRoomAuthor}</p>
        <p>
          This invitation opens a private browser-based reading room. It does
          not provide a downloadable manuscript file.
        </p>
        <form action="/api/reader-room/redeem" method="post" className="reader-room-form">
          <input type="hidden" name="token" value={token} />
          <button type="submit" className="primary-cta">
            Enter Reader Room
          </button>
        </form>
      </section>
    </main>
  )
}
