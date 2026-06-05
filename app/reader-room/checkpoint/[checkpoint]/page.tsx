import Link from "next/link"
import { notFound } from "next/navigation"
import { createPageMetadata } from "@/lib/siteMetadata"
import { getReaderRoomSession } from "@/lib/readerRoomAccess"
import { readerRoomHref } from "@/lib/readerRoomLinks"

const checkpointQuestions = {
  "chapter-03": [
    "Did the opening make you want to continue reading?",
    "Where, if anywhere, did your attention begin to drift?",
    "Did the slow-burn pacing feel intriguing or too slow?",
    "Which character interested you most so far?",
    "Was anything confusing?",
  ],
  "chapter-07": [
    "Did the Massawa section feel immersive, repetitive, or both?",
    "Did the visual detail help you picture the city, hotel, kitchen, bazaar, and beach?",
    "Were there any paragraphs you skimmed?",
    "Did June, April, and May feel like distinct people?",
    "Did June and Alemu’s connection feel natural and earned?",
    "Did the inland danger arrive at the right time?",
  ],
  "chapter-20": [
    "Did Volume One feel satisfying as a complete novel?",
    "Which character arc affected you most?",
    "Were there any sections where the pace dragged?",
    "Did the ending feel earned?",
    "Did Sarah’s wooden elephant, vine crown, and hidden box register clearly?",
    "Did the unopened Italian wine bottle feel meaningful in the closing sequence?",
    "Would you voluntarily read Volume Two?",
    "What is the single most important improvement you would recommend?",
  ],
} as const

export const dynamic = "force-dynamic"
export const revalidate = 0

export const metadata = {
  ...createPageMetadata({
    title: "Reader Checkpoint — W.D. Blackwoods",
    description: "A private beta-reader checkpoint.",
    path: "/reader-room/checkpoint",
  }),
  robots: {
    index: false,
    follow: false,
  },
}

export default async function ReaderRoomCheckpointPage({
  params,
}: {
  params: Promise<{ checkpoint?: string }>
}) {
  const auth = await getReaderRoomSession()

  if (!auth.ok) {
    return notFound()
  }

  const { checkpoint } = await params
  const questions = checkpointQuestions[checkpoint as keyof typeof checkpointQuestions]

  if (!checkpoint || !questions) {
    return notFound()
  }
  const feedbackAction = await readerRoomHref("/api/reader-room/feedback")
  const roomHref = await readerRoomHref("/reader-room")

  return (
    <main className="reader-room-page document-page">
      <section className="reader-room-panel">
        <p className="system-layer-label">Reader checkpoint</p>
        <h1>{checkpoint.replace("-", " ")}</h1>
        <p>
          Please answer only what is useful. Direct, reader-level reactions are
          more valuable than polished critique.
        </p>
        <form action={feedbackAction} method="post" className="reader-room-form">
          <input type="hidden" name="checkpoint" value={checkpoint} />
          {questions.map((question, index) => (
            <label key={question}>
              {question}
              <textarea name={`answer-${index + 1}`} rows={4} />
            </label>
          ))}
          <button type="submit" className="text-cta">
            Submit checkpoint
          </button>
        </form>
        <Link href={roomHref} className="system-link">
          Return to Reader Room
        </Link>
      </section>
    </main>
  )
}
