import { redirect } from "next/navigation"
import { getReaderRoomSession } from "@/lib/readerRoomAccess"
import { readerRoomHref } from "@/lib/readerRoomLinks"

export const dynamic = "force-dynamic"
export const revalidate = 0

export default async function LegacyReaderChapterPage({
  params,
}: {
  params: Promise<{ slug?: string }>
}) {
  const auth = await getReaderRoomSession()

  if (!auth.ok) {
    redirect(await readerRoomHref("/reader-room"))
  }

  const { slug } = await params
  redirect(await readerRoomHref(slug ? `/reader-room/read/${slug}` : "/reader-room"))
}
