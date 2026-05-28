import Link from "next/link"
import { archiveCardMeta } from "../../content/archive"

export default function ArchivePage() {
  return (
    <main>
      <nav>
        <Link href="/">Home</Link>
        <Link href="/begin">Begin</Link>
        <Link href="/archive">Archive</Link>
        <Link href="/about">About</Link>
      </nav>

      <section>
        <h1>Archive</h1>
        <div className="archive-grid">
          {archiveCardMeta.map((item) => (
            <article key={item.slug} className="entry-block">
              <h2>{item.title}</h2>
              <p className="story-description">{item.description}</p>
              <p className="story-excerpt">{item.excerpt}</p>
              <Link href={"/archive/" + item.slug} className="story-link">
                Read →
              </Link>
            </article>
          ))}
        </div>
      </section>
    </main>
  )
}
