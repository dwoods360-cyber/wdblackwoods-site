import Link from "next/link";

export default function SystemPage() {
  return (
    <main className="system-page">
      <section className="system-section">
        <p className="system-layer-label">Myth Layer</p>
        <h1>Substack / Volume 1</h1>
        <p>
          This layer holds the origin of the archive: the first volume’s canonical
          narrative records, published from Substack and brought here as the site’s
          central source text.
        </p>
        <Link href="/archive" className="system-link">
          View the Archive
        </Link>
      </section>

      <section className="system-section">
        <p className="system-layer-label">Entry Layer</p>
        <h1>Begin</h1>
        <p>
          The guided starting point for new readers. It frames the work, provides the
          narrative promise, and leads directly into the first story in the system.
        </p>
        <Link href="/begin" className="system-link">
          Begin the Archive
        </Link>
      </section>

      <section className="system-section">
        <p className="system-layer-label">Narrative Layer</p>
        <h1>Vine Crown, Caravanserai, Arithmetic</h1>
        <p>
          The core narrative sequence: a private domestic rupture, a caravanserai
          incident, and the structural arithmetic beneath the story. These passages
          trace the reader’s journey through the main narrative funnel.
        </p>
        <Link href="/archive/vine-crown" className="system-link">
          Enter the Narrative
        </Link>
      </section>

      <section className="system-section">
        <p className="system-layer-label">System Layer</p>
        <h1>Founding Entry</h1>
        <p>
          The system-level entry point for the archive. It names the world, the
          conditions that shape it, and the architecture behind the unfolding story.
        </p>
        <Link href="/archive/founding-entry-what-coffee-demands" className="system-link">
          Read the Founding Entry
        </Link>
      </section>

      <section className="system-cta">
        <Link href="/begin" className="primary-cta">
          Enter the System →
        </Link>
      </section>
    </main>
  );
}
