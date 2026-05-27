import Link from "next/link";

export default function Home() {
  return (
    <main className="home">
      <section>
        <h1>W.D. Blackwoods</h1>
        <p className="meta">Cinematic historical fiction from the What Coffee Demands universe</p>
      </section>

      <section className="threshold">
        <p>
          This is not a blog.
          <br />
          It is a structured record of a world under construction.
        </p>
        <Link href="/begin" className="primary-cta">
          Enter the Archive →
        </Link>
      </section>

      <section>
        <div className="secondary-links">
          <Link href="/archive">Archive</Link>
          <Link href="/about">About</Link>
        </div>
      </section>
    </main>
  );
}
