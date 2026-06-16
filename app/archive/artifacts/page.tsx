import Link from "next/link";
import { createPageMetadata } from "@/lib/siteMetadata";
import { getPublishedArchiveArtifactPages } from "../../../content/archiveArtifacts";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export const metadata = createPageMetadata({
  title: "Archive Artifacts — W.D. Blackwoods",
  description:
    "Public literary-archive artifacts connected to scheduled excerpts from What Coffee Demands.",
  path: "/archive/artifacts",
});

export default function ArchiveArtifactsPage() {
  const artifactPages = getPublishedArchiveArtifactPages();

  return (
    <main className="public-archive-page archive-artifacts-page">
      <nav>
        <Link href="/">Home</Link>
        <Link href="/begin">Begin</Link>
        <Link href="/archive">Archive</Link>
        <Link href="/about">About</Link>
      </nav>

      <div className="prose-container">
        <section className="archive-entry-section">
          <div className="archive-entry-framing">
            <p className="meta">What Coffee Demands Archive</p>
            <h1>Archive Artifacts</h1>
            <p>
              Downloadable story-world objects tied to public excerpts. Each
              artifact page appears only after its related excerpt has entered
              the public archive.
            </p>
          </div>
        </section>

        <section className="archive-descent-section">
          {artifactPages.map((page) => (
            <article key={page.slug} className="secondary-entry">
              <h2>
                <Link
                  href={`/archive/artifacts/${page.slug}`}
                  className="archive-entry-title-link"
                >
                  {page.title} →
                </Link>
              </h2>
              <p className="story-description">{page.description}</p>
              <p className="story-excerpt">Related excerpt: {page.excerptTitle}</p>
            </article>
          ))}
        </section>
      </div>
    </main>
  );
}
