export default function Home() {
  return (
    <main className="min-h-screen bg-white text-black">
      <div className="max-w-3xl mx-auto px-6 py-20">

        {/* HEADER / IDENTITY */}
        <header className="mb-20">
          <h1 className="text-4xl md:text-5xl font-semibold tracking-tight">
            W.D. Blackwoods
          </h1>

          <p className="mt-6 text-lg leading-relaxed text-neutral-700">
            Historical fiction, systems-driven storytelling, and cinematic narratives
            built around empire, labor, and the invisible structures beneath power.
          </p>
        </header>

        {/* PRINCIPLE STATEMENT */}
        <section className="mb-16">
          <p className="text-base leading-relaxed text-neutral-800">
            These stories do not treat history as backdrop.
            They treat it as infrastructure.
          </p>

          <p className="mt-4 text-base leading-relaxed text-neutral-800">
            Trade routes, labor economies, imperial logistics, and private decisions
            form the architecture beneath every human consequence.
          </p>
        </section>

        {/* FEATURED WORK */}
        <section className="mb-16">
          <h2 className="text-sm uppercase tracking-widest text-neutral-500 mb-6">
            Featured Work
          </h2>

          <div className="border border-neutral-200 p-6">
            <h3 className="text-2xl font-medium">
              What Coffee Demands
            </h3>

            <p className="mt-3 text-neutral-700 leading-relaxed">
              A historical fiction trilogy set across imperial trade routes in late 19th-century Abyssinia.
              It follows the movement of coffee, capital, and violence through systems that reshape lives
              long before individuals understand their role within them.
            </p>

            <p className="mt-4 text-neutral-600">
              Book I: Hold the Earth<br />
              Book II: The Crown and the Bean<br />
              Book III: The Price
            </p>
          </div>
        </section>

        {/* ACTIONS */}
        <section className="mb-20">
          <h2 className="text-sm uppercase tracking-widest text-neutral-500 mb-6">
            Enter the Work
          </h2>

          <div className="space-y-4">
            <a
              href="https://read.wdblackwoods.com"
              className="block border border-black px-5 py-4 hover:bg-black hover:text-white transition"
            >
              Read selected chapters
            </a>

            <a
              href="https://whatcoffeedemands.com"
              className="block border border-neutral-300 px-5 py-4 hover:border-black transition"
            >
              Explore What Coffee Demands
            </a>

            <a
              href="https://wdblackwoods.substack.com"
              className="block border border-neutral-300 px-5 py-4 hover:border-black transition"
            >
              Subscribe for new writing
            </a>
          </div>
        </section>

        {/* FOOTER NOTE */}
        <footer className="border-t border-neutral-200 pt-10 text-sm text-neutral-500">
          <p>
            W.D. Blackwoods — systems, narrative, and the architecture of consequence.
          </p>
        </footer>

      </div>
    </main>
  );
}