import Link from "next/link"
import { createPageMetadata } from "@/lib/siteMetadata"
import { archiveCardMeta } from "../../content/archive"

export const metadata = createPageMetadata({
  title: "Archive — What Coffee Demands",
  description:
    "A curated archive of excerpts, structural records, and narrative passages from What Coffee Demands.",
  path: "/archive",
})

export default function ArchivePage() {
  const featuredEntry = archiveCardMeta.find((item) => item.slug === "vine-crown")
  const secondaryEntries = archiveCardMeta.filter((item) => item.slug !== "vine-crown")

  if (!featuredEntry) {
    return null
  }

  return (
    <main className="public-archive-page archive-coffee-plant">
      <nav>
        <Link href="/">Home</Link>
        <Link href="/begin">Begin</Link>
        <Link href="/archive">Archive</Link>
        <Link href="/about">About</Link>
      </nav>

      <div className="prose-container">
        <section className="archive-entry-section">
          <div className="archive-entry-framing">
            <p>
              Reading Gravity States begins at a threshold. The archive holds one primary entry into the work, and the rest unfold as extension and consequence.
            </p>
          </div>

          <article className="archive-featured-entry">
            <h1>{featuredEntry.title}</h1>
            <p className="story-description">{featuredEntry.description}</p>
            <p className="story-excerpt">{featuredEntry.excerpt}</p>
            <Link href={`/archive/${featuredEntry.slug}`} className="primary-entry-link">
              Enter the archive →
            </Link>
          </article>
        </section>

        <section className="archive-descent-section">
          <p className="archive-descent-lead">
            What follows is not a roster of options. It is a descent through related textures and frames that grow quieter after the threshold is crossed.
          </p>

          {secondaryEntries.map((item) => (
            <article key={item.slug} className="secondary-entry">
              <h2>
                <Link href={`/archive/${item.slug}`} className="archive-entry-title-link">
                  {item.title} →
                </Link>
              </h2>
              <p className="story-description">{item.description}</p>
              <p className="story-excerpt">{item.excerpt}</p>
            </article>
          ))}
        </section>

        <section className="archive-resolution-section">
          <p>
            The page closes not with another choice, but with a sense of completion. The archive is shaped here as a single current, not a menu of equal passages.
          </p>
        </section>
      </div>
    </main>
  )
}
