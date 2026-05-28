import Link from "next/link"
import { notFound } from "next/navigation"
import { getArchiveEntry, archiveSlugs } from "../../../content/archive"

export const dynamicParams = false

export function generateStaticParams() {
  return archiveSlugs.map((slug) => ({ slug }))
}

export default async function ArchiveEntryPage({ params }: { params: Promise<{ slug?: string }> }) {
  const resolvedParams = await params
  const rawSlug = resolvedParams?.slug
  const slug = typeof rawSlug === "string" ? decodeURIComponent(rawSlug) : undefined
  const entry = slug ? getArchiveEntry(slug) : undefined

  if (!entry) {
    return notFound()
  }

  return (
    <main>
      <nav>
        <Link href="/">Home</Link>
        <Link href="/begin">Begin</Link>
        <Link href="/archive">Archive</Link>
        <Link href="/about">About</Link>
      </nav>

      <section>
        <p className="meta">From the Archive of What Coffee Demands</p>
        <h1>{entry.title}</h1>
        <p className="meta">{entry.subline}</p>
        <p>{entry.hook}</p>
        <p className="meta">{entry.context}</p>
        {entry.body.map((paragraph) => (
          <p key={paragraph}>{paragraph}</p>
        ))}
        <p className="meta">End of extracted field record</p>
      </section>
    </main>
  )
}
