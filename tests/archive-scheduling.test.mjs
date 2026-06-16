import assert from "node:assert/strict";
import { existsSync } from "node:fs";
import { readFile } from "node:fs/promises";
import test from "node:test";

const {
  archiveCardMeta,
  getPublishedArchiveCardMeta,
  getPublishedArchiveEntry,
  getPublishedArchiveSlugs,
} = await import("../content/archive.ts");
const {
  archiveArtifactPages,
  getPublishedArchiveArtifactPage,
  getPublishedArchiveArtifactPages,
  getPublishedArchiveArtifactSlugs,
} = await import("../content/archiveArtifacts.ts");

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

const artifactExpectations = [
  {
    slug: "the-compass",
    title: "Objects from “The Compass”",
    visibleAt: "2026-06-16T12:00:00Z",
    before: "2026-06-15T12:59:59Z",
    after: "2026-06-15T13:00:00Z",
    filenames: [
      "03_brass_compass.png",
      "14_stirling_club_library.png",
      "15_leather_bound_portfolio.png",
    ],
  },
  {
    slug: "alice-and-the-spear",
    title: "Objects from “Alice and the Spear”",
    visibleAt: "2026-06-22T13:00:00Z",
    before: "2026-06-22T12:59:59Z",
    after: "2026-06-22T13:00:00Z",
    filenames: [
      "23_alice_hunting_spear.png",
      "24_alice_lance.png",
      "25_alice_riding_gear.png",
    ],
  },
  {
    slug: "berihuns-terms",
    title: "Objects from “Berihun’s Terms”",
    visibleAt: "2026-06-29T13:00:00Z",
    before: "2026-06-29T12:59:59Z",
    after: "2026-06-29T13:00:00Z",
    filenames: [
      "33_coffee_ceremony_cups.png",
      "16_thatch_hut.png",
      "21_route_ii_massawa_to_kaffa_highlands.png",
    ],
  },
  {
    slug: "the-hoe",
    title: "Objects from “The Hoe”",
    visibleAt: "2026-07-06T13:00:00Z",
    before: "2026-07-06T12:59:59Z",
    after: "2026-07-06T13:00:00Z",
    filenames: [
      "34_sharpened_hoe.png",
      "16_thatch_hut.png",
      "21_route_ii_massawa_to_kaffa_highlands.png",
    ],
  },
  {
    slug: "the-waterfall",
    title: "Objects from “The Waterfall”",
    visibleAt: "2026-07-13T13:00:00Z",
    before: "2026-07-13T12:59:59Z",
    after: "2026-07-13T13:00:00Z",
    filenames: [
      "30_sarah_hidden_box.png",
      "35_vine_crown.png",
      "06_wooden_elephant.png",
    ],
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

for (const artifactPage of artifactExpectations) {
  test(`${artifactPage.title} is hidden before publishedAt and visible after`, () => {
    assert.equal(
      getPublishedArchiveArtifactPage(artifactPage.slug, new Date(artifactPage.before)),
      undefined
    );

    const page = getPublishedArchiveArtifactPage(
      artifactPage.slug,
      new Date(artifactPage.after)
    );

    assert.equal(page?.title, artifactPage.title);
    assert.deepEqual(
      page?.artifacts.map((artifact) => artifact.filename),
      artifactPage.filenames
    );
  });
}

test("only The Compass artifact page is public on 2026-06-16", () => {
  const publicPages = getPublishedArchiveArtifactPages(
    new Date("2026-06-16T12:00:00Z")
  );

  assert.deepEqual(
    publicPages.map((page) => page.slug),
    ["the-compass"]
  );
  assert.equal(
    getPublishedArchiveArtifactSlugs(new Date("2026-06-16T12:00:00Z")).includes(
      "alice-and-the-spear"
    ),
    false
  );
});

test("artifact page mappings use precise corrected filenames and descriptions", () => {
  const compassPage = archiveArtifactPages.find((page) => page.slug === "the-compass");
  const alicePage = archiveArtifactPages.find((page) => page.slug === "alice-and-the-spear");
  const berihunPage = archiveArtifactPages.find((page) => page.slug === "berihuns-terms");
  const hoePage = archiveArtifactPages.find((page) => page.slug === "the-hoe");
  const waterfallPage = archiveArtifactPages.find((page) => page.slug === "the-waterfall");

  assert.ok(compassPage);
  assert.ok(alicePage);
  assert.ok(berihunPage);
  assert.ok(hoePage);
  assert.ok(waterfallPage);

  assert.match(compassPage.artifacts[0].description, /Sir Edmund Cartier/);
  assert.match(compassPage.artifacts[0].description, /Dollond pocket compass/);
  assert.match(
    compassPage.artifacts[2].description,
    /Abyssinian coffee scheme.*brass nameplate.*gold/
  );
  assert.equal(
    alicePage.artifacts.some((artifact) => artifact.filename === "02_hunting_spear.png"),
    false
  );
  assert.equal(berihunPage.artifacts[0].filename, "33_coffee_ceremony_cups.png");
  assert.equal(hoePage.artifacts[0].filename, "34_sharpened_hoe.png");
  assert.match(waterfallPage.artifacts[0].description, /dull dark-grey iron/);
  assert.match(waterfallPage.artifacts[0].description, /three distinct keyholes/);
});

test("all scheduled artifact image files exist before they can be linked publicly", () => {
  for (const page of archiveArtifactPages) {
    for (const artifact of page.artifacts) {
      assert.equal(
        existsSync(`public/downloads/artifacts/${artifact.filename}`),
        true,
        `Missing artifact image: ${artifact.filename}`
      );
    }
  }
});

test("artifact routes and related excerpt links use server-side publish checks", async () => {
  const artifactIndexSource = await readFile("app/archive/artifacts/page.tsx", "utf8");
  const artifactPageSource = await readFile(
    "app/archive/artifacts/[slug]/page.tsx",
    "utf8"
  );
  const excerptPageSource = await readFile("app/archive/[slug]/page.tsx", "utf8");
  const sitemapSource = await readFile("app/sitemap.ts", "utf8");

  assert.match(artifactIndexSource, /export const dynamic = "force-dynamic"/);
  assert.match(artifactIndexSource, /getPublishedArchiveArtifactPages/);
  assert.match(artifactPageSource, /getPublishedArchiveArtifactPage/);
  assert.match(artifactPageSource, /return notFound\(\)/);
  assert.match(excerptPageSource, /getPublishedArchiveArtifactPage/);
  assert.match(excerptPageSource, /\/archive\/artifacts\/\$\{slug\}/);
  assert.match(sitemapSource, /getPublishedArchiveArtifactSlugs/);
});
