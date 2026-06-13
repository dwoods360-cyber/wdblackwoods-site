import type { Metadata } from "next"
import Link from "next/link"
import { notFound } from "next/navigation"
import ArchiveSignup from "@/components/ArchiveSignup"
import { createPageMetadata } from "@/lib/siteMetadata"
import { getPublishedArchiveEntry } from "../../../content/archive"

export const dynamic = "force-dynamic"
export const dynamicParams = true
export const revalidate = 0

export async function generateMetadata({ params }: { params: Promise<{ slug?: string }> }): Promise<Metadata> {
  const resolvedParams = await params
  const rawSlug = resolvedParams?.slug
  const slug = typeof rawSlug === "string" ? decodeURIComponent(rawSlug) : undefined
  const entry = slug ? getPublishedArchiveEntry(slug) : undefined
  const isVineCrown = slug === "vine-crown"

  if (!entry || !slug) {
    return createPageMetadata({
      title: "Archive Entry — What Coffee Demands Archive",
      description: "An archive record from What Coffee Demands.",
      path: "/archive",
      type: "article",
    })
  }

  return createPageMetadata({
    title: isVineCrown
      ? "The Vine Crown — An Excerpt from What Coffee Demands"
      : `${entry.title} — W.D. Blackwoods`,
    description: isVineCrown
      ? "A hidden box, a carved elephant, and a vine crown wait at the edge of a family’s unfinished journey."
      : entry.descriptor || entry.hook,
    path: `/archive/${slug}`,
    type: "article",
  })
}

export default async function ArchiveEntryPage({ params }: { params: Promise<{ slug?: string }> }) {
  const resolvedParams = await params
  const rawSlug = resolvedParams?.slug
  const slug = typeof rawSlug === "string" ? decodeURIComponent(rawSlug) : undefined
  const entry = slug ? getPublishedArchiveEntry(slug) : undefined

  if (!entry) {
    return notFound()
  }

  const openingLine = entry.openingLine || entry.hook
  const bodyParagraphs =
    entry.body[0] === openingLine ? entry.body.slice(1) : entry.body
  const isVineCrown = slug === "vine-crown"
  const excerptLabel = "— an archive excerpt —"
  const pageClassName = `document-page archive-document-page public-archive-page${
    isVineCrown ? " archive-parchment-surface" : ""
  }`

  return (
    <main className={pageClassName}>
      <nav>
        <Link href="/">Home</Link>
        <Link href="/begin">Begin</Link>
        <Link href="/archive">Archive</Link>
        <Link href="/about">About</Link>
      </nav>

      {isVineCrown ? (
        <section className="archive-landing-intro">
          <h1>THE VINE CROWN</h1>
          <p className="archive-landing-kicker">
            An excerpt from
            <br />
            WHAT COFFEE DEMANDS
            <br />
            Volume One — Hold the Earth
          </p>
          <p className="archive-landing-byline">by W.D. Blackwoods</p>
          <p>
            A hidden box, a carved elephant, and a vine crown wait at the edge of
            a family’s unfinished journey.
          </p>
        </section>
      ) : null}

      <section>
        <p className="meta">From the Archive of What Coffee Demands</p>
        <p className="archive-entry-subline">{excerptLabel}</p>
        {isVineCrown ? null : <h1>{entry.title}</h1>}
        {entry.descriptor ? (
          <p className="archive-entry-descriptor">{entry.descriptor}</p>
        ) : null}
        <p>{openingLine}</p>
        {entry.descriptor ? null : <p className="meta">{entry.context}</p>}
        {bodyParagraphs.map((paragraph, index) => (
          <p key={`${index}-${paragraph}`}>{paragraph}</p>
        ))}
        {entry.bookLine ? <p className="meta">{entry.bookLine}</p> : null}
        <p className="meta archive-entry-ending">End of extracted field record</p>
      </section>
      <ArchiveSignup />
    </main>
  )
}
