import { redirect } from "next/navigation"

export const dynamic = "force-dynamic"
export const revalidate = 0

export default async function LegacyReaderChapterPage({
  params,
}: {
  params: Promise<{ slug?: string }>
}) {
  const { slug } = await params
  redirect(slug ? `/reader-room/read/${slug}` : "/reader-room")
}
