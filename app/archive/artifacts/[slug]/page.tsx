import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { createPageMetadata } from "@/lib/siteMetadata";
import {
  getArtifactAssetPath,
  getPublishedArchiveArtifactPage,
} from "../../../../content/archiveArtifacts";

export const dynamic = "force-dynamic";
export const dynamicParams = true;
export const revalidate = 0;

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug?: string }>;
}): Promise<Metadata> {
  const resolvedParams = await params;
  const rawSlug = resolvedParams?.slug;
  const slug = typeof rawSlug === "string" ? decodeURIComponent(rawSlug) : undefined;
  const page = slug ? getPublishedArchiveArtifactPage(slug) : undefined;

  if (!page || !slug) {
    return createPageMetadata({
      title: "Archive Artifacts — W.D. Blackwoods",
      description: "Public literary-archive artifacts from What Coffee Demands.",
      path: "/archive/artifacts",
      type: "article",
    });
  }

  return createPageMetadata({
    title: `${page.title} — W.D. Blackwoods`,
    description: page.description,
    path: `/archive/artifacts/${slug}`,
    type: "article",
  });
}

export default async function ArchiveArtifactPage({
  params,
}: {
  params: Promise<{ slug?: string }>;
}) {
  const resolvedParams = await params;
  const rawSlug = resolvedParams?.slug;
  const slug = typeof rawSlug === "string" ? decodeURIComponent(rawSlug) : undefined;
  const page = slug ? getPublishedArchiveArtifactPage(slug) : undefined;

  if (!page || !slug) {
    return notFound();
  }

  return (
    <main className="public-archive-page archive-artifact-detail-page">
      <nav>
        <Link href="/">Home</Link>
        <Link href="/begin">Begin</Link>
        <Link href="/archive">Archive</Link>
        <Link href="/archive/artifacts">Artifacts</Link>
        <Link href="/about">About</Link>
      </nav>

      <div className="prose-container">
        <section className="archive-entry-section">
          <div className="archive-entry-framing">
            <p className="meta">What Coffee Demands Archive</p>
            <h1>{page.title}</h1>
            <p>{page.description}</p>
            <p className="story-excerpt">Related excerpt: {page.excerptTitle}</p>
            <Link href={`/archive/${page.slug}`} className="primary-entry-link">
              Read the excerpt →
            </Link>
          </div>
        </section>

        <section className="archive-artifact-grid" aria-label="Archive artifacts">
          {page.artifacts.map((artifact) => (
            <article key={artifact.filename} className="archive-artifact-card">
              <a
                href={getArtifactAssetPath(artifact.filename)}
                className="archive-artifact-image-link"
                download
              >
                <Image
                  src={getArtifactAssetPath(artifact.filename)}
                  alt={artifact.title}
                  width={1200}
                  height={900}
                  className="archive-artifact-image"
                />
              </a>
              <div className="archive-artifact-card-copy">
                <h2>{artifact.title}</h2>
                <p>{artifact.description}</p>
                <p className="story-description">{artifact.storyEmphasis}</p>
                <a
                  href={getArtifactAssetPath(artifact.filename)}
                  className="archive-signup-link"
                  download
                >
                  Download artifact →
                </a>
              </div>
            </article>
          ))}
        </section>
      </div>
    </main>
  );
}
