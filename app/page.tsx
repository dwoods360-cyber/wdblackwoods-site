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
        <h1>W.D. Blackwoods</h1>
        <p className="meta">From the archive of What Coffee Demands.</p>
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
