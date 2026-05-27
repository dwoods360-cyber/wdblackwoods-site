export default function Home() {
  return (
    <main className="min-h-screen bg-white text-black">
      <div className="max-w-2xl mx-auto px-6 py-24">

        {/* IDENTITY */}
        <header>
          <h1 className="text-4xl md:text-5xl font-semibold tracking-tight">
            W.D. Blackwoods
          </h1>

          <p className="mt-6 text-lg leading-relaxed text-neutral-700">
            Historical fiction, systems-driven storytelling, and cinematic narratives
            built around empire, labor, and the invisible structures beneath power.
          </p>
        </header>

        {/* CORE IDEA */}
        <section className="mt-14">
          <p className="text-base leading-relaxed text-neutral-800">
            These stories are not about individuals.
          </p>

          <p className="mt-4 text-base leading-relaxed text-neutral-800">
            They are about the systems that move before people do:
            trade routes, extraction economies, imperial logistics,
            and the quiet mathematics of survival.
          </p>

          <p className="mt-4 text-base leading-relaxed text-neutral-800">
            If you understand the system, the story becomes inevitable.
            If you do not, you will still feel it.
          </p>
        </section>

        {/* PRIMARY ACTION */}
        <section className="mt-16 border border-neutral-200 p-8">
          <h2 className="text-sm uppercase tracking-widest text-neutral-500">
            New Writing
          </h2>

          <p className="mt-4 text-lg font-medium">
            Receive new excerpts from What Coffee Demands
          </p>

          <p className="mt-3 text-neutral-600 leading-relaxed">
            Early chapters, systems essays, and unpublished scenes from the trilogy
            as it develops.
          </p>

          <a
            href="https://wdblackwoods.substack.com"
            className="inline-block mt-6 bg-black text-white px-6 py-3 hover:bg-neutral-800 transition"
          >
            Subscribe
          </a>
        </section>

        {/* SECONDARY CONTEXT (SUBDUED) */}
        <section className="mt-16">
          <h2 className="text-sm uppercase tracking-widest text-neutral-400">
            Featured Work
          </h2>

          <div className="mt-6 border border-neutral-200 p-6">
            <h3 className="text-xl font-medium">
              What Coffee Demands
            </h3>

            <p className="mt-3 text-neutral-700 leading-relaxed">
              A historical fiction trilogy set along imperial trade routes in late
              19th-century Abyssinia. Coffee becomes the visible surface of deeper systems:
              labor, movement, control, and consequence.
            </p>

            <p className="mt-4 text-neutral-500 text-sm">
              Book I — Hold the Earth<br />
              Book II — The Crown and the Bean<br />
              Book III — The Price
            </p>

            <a
              href="https://whatcoffeedemands.com"
              className="inline-block mt-5 text-sm underline text-neutral-700 hover:text-black"
            >
              Explore the trilogy →
            </a>
          </div>
        </section>

        {/* FOOTER */}
        <footer className="mt-20 border-t border-neutral-200 pt-8 text-sm text-neutral-500">
          <p>
            W.D. Blackwoods — systems, narrative, and the architecture of consequence.
          </p>
        </footer>

      </div>
    </main>
  );
}