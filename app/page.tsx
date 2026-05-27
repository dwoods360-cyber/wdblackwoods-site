export default function Home() {
  return (
    <div className="min-h-screen bg-neutral-950 text-neutral-100 flex flex-col">

      {/* HERO */}
      <header className="max-w-5xl mx-auto px-6 pt-24 pb-16">
        <h1 className="text-4xl md:text-6xl font-light tracking-wide">
          W.D. Blackwoods
        </h1>

        <p className="mt-6 text-lg md:text-xl text-neutral-300 leading-relaxed max-w-2xl">
          Historical fiction, systems-driven storytelling, and cinematic narratives built around
          empire, labor, and the invisible structures beneath power.
        </p>

        <div className="mt-10 flex gap-4 flex-wrap">
          <a
            href="https://whatcoffeedemands.com"
            className="px-5 py-3 bg-neutral-100 text-neutral-900 rounded-md text-sm tracking-wide"
          >
            Explore What Coffee Demands
          </a>

          <a
            href="#latest"
            className="px-5 py-3 border border-neutral-700 rounded-md text-sm tracking-wide"
          >
            Read Latest Work
          </a>
        </div>
      </header>

      <div className="border-t border-neutral-800" />

      {/* ABOUT */}
      <section className="max-w-5xl mx-auto px-6 py-20">
        <h2 className="text-xl tracking-widest uppercase text-neutral-400">
          The Work
        </h2>

        <p className="mt-6 text-neutral-300 leading-relaxed max-w-3xl">
          These stories operate as systems under pressure: trade routes, labor economies,
          imperial logistics, and the mathematics of survival.
        </p>

        <p className="mt-4 text-neutral-300 leading-relaxed max-w-3xl">
          Characters are not isolated individuals. They are shaped by distance, extraction,
          and the invisible accounting systems of empire.
        </p>
      </section>

      <div className="border-t border-neutral-800" />

      {/* PROJECT */}
      <section className="max-w-5xl mx-auto px-6 py-20">
        <h2 className="text-xl tracking-widest uppercase text-neutral-400">
          Current Project
        </h2>

        <h3 className="mt-6 text-2xl md:text-3xl font-light">
          What Coffee Demands
        </h3>

        <p className="mt-4 text-neutral-300 max-w-3xl leading-relaxed">
          A historical adventure trilogy set in a composite 19th-century Abyssinia,
          tracing coffee, capital, and violence through trade routes and collapsing empires.
        </p>

        <a
          href="https://whatcoffeedemands.com"
          className="inline-block mt-6 underline underline-offset-4"
        >
          Enter the system →
        </a>
      </section>

      <div className="border-t border-neutral-800" />

      {/* LATEST */}
      <section id="latest" className="max-w-5xl mx-auto px-6 py-20">
        <h2 className="text-xl tracking-widest uppercase text-neutral-400">
          Latest Field Notes
        </h2>

        <div className="mt-8 space-y-8">

          <article className="border-l border-neutral-700 pl-4">
            <h3 className="text-lg">The Arithmetic on the Wall</h3>
            <p className="mt-2 text-neutral-400">
              Routes are not geography. They are control. Prices are not economics.
              They are distance made visible.
            </p>
          </article>

          <article className="border-l border-neutral-700 pl-4">
            <h3 className="text-lg">Caravanserai Incident — Massawa</h3>
            <p className="mt-2 text-neutral-400">
              A merchant loses his sense of orientation inside a controlled trade space
              where power reveals itself in increments.
            </p>
          </article>

        </div>
      </section>

      <div className="border-t border-neutral-800" />

      {/* SUBSCRIBE */}
      <section className="max-w-5xl mx-auto px-6 py-20">
        <h2 className="text-xl tracking-widest uppercase text-neutral-400">
          Stay Connected
        </h2>

        <p className="mt-4 text-neutral-300 max-w-2xl">
          Occasional dispatches: essays, system maps, and early excerpts.
        </p>

        <form className="mt-6 flex flex-col sm:flex-row gap-3 max-w-lg">
          <input
            type="email"
            placeholder="Email address"
            className="flex-1 px-4 py-3 bg-neutral-900 border border-neutral-700 rounded-md"
          />
          <button className="px-5 py-3 bg-neutral-100 text-neutral-900 rounded-md">
            Subscribe
          </button>
        </form>
      </section>

      <footer className="border-t border-neutral-800 py-10 px-6 text-center text-neutral-500 text-sm">
        © {new Date().getFullYear()} W.D. Blackwoods
      </footer>

    </div>
  );
}