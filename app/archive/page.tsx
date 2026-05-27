import Link from "next/link";

const archiveItems = [
  {
    slug: "vine-crown",
    title: "The Vine Crown",
    description:
      "A private domestic fracture, where intimacy collides with a discovery that should not exist.",
  },
  {
    slug: "the-arithmetic-on-the-wall",
    title: "The Arithmetic on the Wall",
    description:
      "Structural abstraction arrives as economic calculus written on a surface of control.",
  },
  {
    slug: "caravanserai-incident-massawa",
    title: "Caravanserai Incident — Massawa",
    description:
      "A scene where systems and hierarchy are revealed through movement, duty, and unseen rules.",
  },
  {
    slug: "founding-entry-what-coffee-demands",
    title: "Founding Entry: What Coffee Demands",
    description:
      "A meta framing of the archive, setting the worldview and the forces that shape it.",
  },
];

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
          {archiveItems.map((item) => (
            <article key={item.slug} className="entry-block">
              <h2>{item.title}</h2>
              <p className="story-description">{item.description}</p>
              <Link href={`/archive/${item.slug}`} className="story-link">
                Read →
              </Link>
            </article>
          ))}
        </div>
      </section>
    </main>
  );
}
