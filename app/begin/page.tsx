import Link from "next/link";

export default function BeginPage() {
  return (
    <main>
      <nav>
        <Link href="/">Home</Link>
        <Link href="/begin">Begin</Link>
        <Link href="/archive">Archive</Link>
        <Link href="/about">About</Link>
      </nav>

      <section>
            <h1>Begin Here — The Archive of What Coffee Demands</h1>
            <p className="meta">This is a guided entry sequence. It is not a catalog.</p>
            <div className="start-here">
              <p>
                This is not a blog. It is a record of how a world gets built—slowly,
                in fragments, the way a woman sews gold coins into the lining of a cloak,
                one seam at a time, so the weight does not betray itself to a casual hand.
              </p>
              <p>
                What Coffee Demands is a historical fiction trilogy set in the Abyssinian
                highlands in the final decades of the nineteenth century. It follows a
                bankrupt English family, the four women who serve them, and the people
                whose land they have come to cultivate—into a country that does not forgive
                ignorance and never has.
              </p>
              <p>
                The publication appears in fragments: excerpts, character studies,
                historical roots, narrative records, and maps of a world still being assembled.
              </p>
              <p className="meta">If you are new here, a suggested start: The Vine Crown → The Arithmetic on the Wall → Caravanserai Incident → Founding Entry.</p>
            </div>
      </section>

      <section className="entry-block primary-entry">
        <h2>The Vine Crown</h2>
        <p className="story-description">
          A private domestic fracture, where intimacy collides with a discovery that should not exist.
        </p>
        <Link href="/archive/the-arithmetic-on-the-wall" className="story-link">
          Continue →
        </Link>
      </section>

      <section className="entry-block">
        <h2>The Arithmetic on the Wall</h2>
        <p className="story-description">
          Structural abstraction arrives as economic calculus written on a surface of control.
        </p>
        <Link href="/archive/caravanserai-incident-massawa" className="story-link">
          Continue →
        </Link>
      </section>

      <section className="entry-block">
        <h2>Caravanserai Incident — Massawa</h2>
        <p className="story-description">
          A scene where systems and hierarchy are revealed through movement, duty, and unseen rules.
        </p>
        <Link href="/archive/founding-entry-what-coffee-demands" className="story-link">
          Continue →
        </Link>
      </section>

      <section className="entry-block">
        <h2>Founding Entry: What Coffee Demands</h2>
        <p className="story-description">
          A meta framing of the archive, setting the worldview and the forces that shape it.
        </p>
        <Link href="/archive" className="story-link">
          Continue →
        </Link>
      </section>

      <section>
        <p>
          <em>Each entry reveals a different layer of the same system.</em>
        </p>
      </section>
    </main>
  );
}
