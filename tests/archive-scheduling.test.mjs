import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";

const {
  archiveCardMeta,
  getPublishedArchiveCardMeta,
  getPublishedArchiveEntry,
  getPublishedArchiveSlugs,
} = await import("../content/archive.ts");

const scheduledExcerpts = [
  {
    slug: "the-compass",
    title: "The Compass",
    before: "2026-06-15T12:59:59Z",
    after: "2026-06-15T13:00:00Z",
  },
  {
    slug: "alice-and-the-spear",
    title: "Alice and the Spear",
    before: "2026-06-22T12:59:59Z",
    after: "2026-06-22T13:00:00Z",
  },
  {
    slug: "berihuns-terms",
    title: "Berihun’s Terms",
    before: "2026-06-29T12:59:59Z",
    after: "2026-06-29T13:00:00Z",
  },
  {
    slug: "the-hoe",
    title: "The Hoe",
    before: "2026-07-06T12:59:59Z",
    after: "2026-07-06T13:00:00Z",
  },
  {
    slug: "the-waterfall",
    title: "The Waterfall",
    before: "2026-07-13T12:59:59Z",
    after: "2026-07-13T13:00:00Z",
  },
];

for (const excerpt of scheduledExcerpts) {
  test(`${excerpt.title} is hidden before publishedAt and visible after`, () => {
    assert.equal(
      getPublishedArchiveEntry(excerpt.slug, new Date(excerpt.before)),
      undefined
    );
    assert.equal(
      getPublishedArchiveSlugs(new Date(excerpt.before)).includes(excerpt.slug),
      false
    );
    assert.equal(
      getPublishedArchiveCardMeta(new Date(excerpt.before)).some(
        (item) => item.slug === excerpt.slug
      ),
      false
    );

    const entry = getPublishedArchiveEntry(excerpt.slug, new Date(excerpt.after));
    assert.equal(entry?.title, excerpt.title);
    assert.equal(
      getPublishedArchiveSlugs(new Date(excerpt.after)).includes(excerpt.slug),
      true
    );
    assert.equal(
      getPublishedArchiveCardMeta(new Date(excerpt.after)).some(
        (item) => item.slug === excerpt.slug
      ),
      true
    );
  });
}

test("direct archive route access uses server-side publish checks before rendering", async () => {
  const pageSource = await readFile("app/archive/[slug]/page.tsx", "utf8");

  assert.match(pageSource, /export const dynamic = "force-dynamic"/);
  assert.match(pageSource, /export const revalidate = 0/);
  assert.match(pageSource, /getPublishedArchiveEntry/);
  assert.match(pageSource, /return notFound\(\)/);
  assert.doesNotMatch(pageSource, /getArchiveEntry\(/);
});

test("future scheduled excerpts are excluded from public archive and sitemap surfaces", async () => {
  const archiveIndexSource = await readFile("app/archive/page.tsx", "utf8");
  const sitemapSource = await readFile("app/sitemap.ts", "utf8");

  assert.match(archiveIndexSource, /export const dynamic = "force-dynamic"/);
  assert.match(archiveIndexSource, /getPublishedArchiveCardMeta/);
  assert.doesNotMatch(archiveIndexSource, /archiveCardMeta\.map/);

  assert.match(sitemapSource, /getPublishedArchiveSlugs/);
  assert.match(sitemapSource, /export const revalidate = 0/);
  assert.doesNotMatch(sitemapSource, /archiveSlugs/);
});

test("scheduled archive card metadata is present but not public before each publish date", () => {
  for (const excerpt of scheduledExcerpts) {
    assert.equal(
      archiveCardMeta.some((item) => item.slug === excerpt.slug),
      true
    );
    assert.equal(
      getPublishedArchiveCardMeta(new Date(excerpt.before)).some(
        (item) => item.slug === excerpt.slug
      ),
      false
    );
  }
});
