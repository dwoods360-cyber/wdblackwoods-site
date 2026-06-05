import { createPageMetadata } from "@/lib/siteMetadata"
import { readerRoomHref } from "@/lib/readerRoomLinks"

export const dynamic = "force-dynamic"
export const revalidate = 0

export const metadata = {
  ...createPageMetadata({
    title: "Leave Reader Room — W.D. Blackwoods",
    description: "Leave the private beta-reader room.",
    path: "/reader-room/logout",
  }),
  robots: {
    index: false,
    follow: false,
  },
}

export default async function ReaderRoomLogoutPage() {
  const logoutAction = await readerRoomHref("/api/reader-room/logout")

  return (
    <main className="reader-room-page document-page">
      <section className="reader-room-panel">
        <p className="system-layer-label">Private reader room</p>
        <h1>Leave Reader Room</h1>
        <p>This clears private reading access from this browser.</p>
        <form action={logoutAction} method="post">
          <button type="submit" className="text-cta">
            Leave Reader Room
          </button>
        </form>
      </section>
    </main>
  )
}
