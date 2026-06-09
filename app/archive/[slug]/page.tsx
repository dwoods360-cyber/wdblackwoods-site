import type { Metadata } from "next"
import Link from "next/link"
import { notFound } from "next/navigation"
import ArchiveSignup from "@/components/ArchiveSignup"
import { createPageMetadata } from "@/lib/siteMetadata"
import { getArchiveEntry, archiveSlugs } from "../../../content/archive"

export const dynamicParams = false

export function generateStaticParams() {
  return archiveSlugs.map((slug) => ({ slug }))
}

export async function generateMetadata({ params }: { params: Promise<{ slug?: string }> }): Promise<Metadata> {
  const resolvedParams = await params
  const rawSlug = resolvedParams?.slug
  const slug = typeof rawSlug === "string" ? decodeURIComponent(rawSlug) : undefined
  const entry = slug ? getArchiveEntry(slug) : undefined

  if (!entry || !slug) {
    return createPageMetadata({
      title: "Archive Entry — What Coffee Demands Archive",
      description: "An archive record from What Coffee Demands.",
      path: "/archive",
      type: "article",
    })
  }

  return createPageMetadata({
    title: `${entry.title} — What Coffee Demands Archive`,
    description: entry.hook,
    path: `/archive/${slug}`,
    type: "article",
  })
}

export default async function ArchiveEntryPage({ params }: { params: Promise<{ slug?: string }> }) {
  const resolvedParams = await params
  const rawSlug = resolvedParams?.slug
  const slug = typeof rawSlug === "string" ? decodeURIComponent(rawSlug) : undefined
  const entry = slug ? getArchiveEntry(slug) : undefined

  if (!entry) {
    return notFound()
  }

  const bodyParagraphs =
    entry.body[0] === entry.hook ? entry.body.slice(1) : entry.body
  const excerptLabel =
    slug === "vine-crown" ? "— an archive excerpt —" : "— an excerpt —"

  return (
    <main className="document-page archive-document-page">
      <nav>
        <Link href="/">Home</Link>
        <Link href="/begin">Begin</Link>
        <Link href="/archive">Archive</Link>
        <Link href="/about">About</Link>
      </nav>

      <section>
        <p className="meta">From the Archive of What Coffee Demands</p>
        <h1>{entry.title}</h1>
        <p className="archive-entry-subline">{excerptLabel}</p>
        <p>{entry.hook}</p>
        <p className="meta">{entry.context}</p>
        {bodyParagraphs.map((paragraph, index) => (
          <p key={`${index}-${paragraph}`}>{paragraph}</p>
        ))}
        <p className="meta">End of extracted field record</p>
      </section>
      {slug === "vine-crown" ? <ArchiveSignup /> : null}
    </main>
  )
}
