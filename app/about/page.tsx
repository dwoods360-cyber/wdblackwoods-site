import Link from "next/link";

export default function AboutPage() {
  return (
    <main className="document-page">
      <nav>
        <Link href="/">Home</Link>
        <Link href="/begin">Begin</Link>
        <Link href="/archive">Archive</Link>
        <Link href="/about">About</Link>
      </nav>

      <section>
            <h1>About</h1>
            <article>
              <h2>Founding Entry: What Coffee Demands</h2>
              <p>
                This publication begins as an archive, not an announcement. What Coffee Demands
                is a developing historical fiction trilogy set within a wider literary
                universe of empire, survival, and memory.
              </p>
              <p>
                It follows individuals moving through collapsing political landscapes shaped
                by trade, war, and the systems built around coffee—its cultivation, its
                movement, and the power structures that grow from it.
              </p>
              <p>
                This is not a finished world. It is a record of one being built in real time.
              </p>
              <p className="meta">
                The archive collects excerpts, character perspectives, historical inspirations,
                worldbuilding records, and narrative passages from a larger unfolding structure.
              </p>
            </article>
      </section>
    </main>
  );
}
