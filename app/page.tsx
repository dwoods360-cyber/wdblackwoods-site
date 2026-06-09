import Link from "next/link";
import { createPageMetadata } from "@/lib/siteMetadata";

export const metadata = createPageMetadata({
  title: "W.D. Blackwoods",
  description:
    "A restrained archive for What Coffee Demands: narrative records, fragments, and structural notes from an unfolding literary world.",
  path: "/",
});

export default function Home() {
  return (
    <main className="home">
      <section>
        <h1>W.D. BLACKWOODS</h1>
        <p className="meta">From the archive of What Coffee Demands.</p>
      </section>

      <section className="threshold">
        <p>
          Not a blog.
          <br />
          A structured record of a world under construction.
        </p>
        <Link href="/archive/vine-crown" className="primary-cta">
          Read “The Vine Crown” →
        </Link>
      </section>

      <section>
        <div className="secondary-links">
          <Link href="/begin">Enter the Archive →</Link>
          <Link href="/about">About</Link>
        </div>
      </section>
    </main>
  );
}
