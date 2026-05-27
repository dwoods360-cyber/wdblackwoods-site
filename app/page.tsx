import Link from "next/link";

export default function Home() {
  return (
    <main>
      <nav>
        <Link href="/">Home</Link>
        <Link href="/begin">Begin</Link>
        <Link href="/archive">Archive</Link>
        <Link href="/about">About</Link>
      </nav>

      <section>
        <h1>W.D. Blackwoods</h1>

        <p>
          Historical fiction, systems-driven storytelling, and cinematic
          narratives built around empire, labor, and the invisible structures
          beneath power.
        </p>

        <p>
          <em>
            Empires rise on ledgers, roads, and harvests — and the silent
            assumption that some lives are worth less than others.
          </em>
        </p>
      </section>

      <section>
        <p className="meta">Philosophy</p>

        <p>
          These stories operate as systems under pressure: trade routes, labor
          economies, imperial logistics, and the mathematics of survival.
        </p>

        <p>
          Characters are not isolated individuals. They are shaped by distance,
          extraction, and the invisible accounting systems of empire.
        </p>
      </section>

      <section>
        <p className="meta">Current Project</p>

        <h2>What Coffee Demands</h2>

        <p>
          A historical adventure trilogy set in a composite 19th-century
          Abyssinia, tracing coffee, capital, violence, and survival through
          trade routes and collapsing empires.
        </p>

        <div>
          <Link href="/begin" className="read-more">
            Enter the system →
          </Link>
        </div>
      </section>

      <section>
        <p className="meta">Field Notes</p>

        <article>
          <h3>The Arithmetic on the Wall</h3>
          <p>
            Routes are not geography. They are control. Prices are not economics.
            They are distance made visible.
          </p>
        </article>

        <article>
          <h3>Caravanserai Incident — Massawa</h3>
          <p>
            Inside the caravanserai, hierarchy reveals itself before language does.
          </p>
        </article>
      </section>

      <section>
        <p className="meta">Stay Connected</p>

        <p>Occasional dispatches: essays, system maps, and early excerpts.</p>

        <div className="form-row">
          <input type="email" placeholder="Email address" />
          <button type="button" className="button">
            Subscribe
          </button>
        </div>
      </section>

      <footer>© 2026 W.D. Blackwoods</footer>
    </main>
  );
}
