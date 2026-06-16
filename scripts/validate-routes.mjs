import { readFile } from "fs/promises";
import path from "path";
import { fileURLToPath } from "url";

const root = path.dirname(fileURLToPath(import.meta.url));
const archivePath = path.resolve(root, "../content/archive.ts");
const archiveArtifactsPath = path.resolve(root, "../content/archiveArtifacts.ts");
const slugPagePath = path.resolve(root, "../app/archive/[slug]/page.tsx");
const archiveIndexPath = path.resolve(root, "../app/archive/page.tsx");
const artifactIndexPath = path.resolve(root, "../app/archive/artifacts/page.tsx");
const artifactSlugPath = path.resolve(root, "../app/archive/artifacts/[slug]/page.tsx");

const source = await readFile(archivePath, "utf8");
const artifactSource = await readFile(archiveArtifactsPath, "utf8");

const requiredExports = [
  /export const archiveEntries\b/,
  /export const archiveSlugs\b/,
  /export const archiveCardMeta\b/,
  /export function getArchiveEntry\b/,
  /export function getPublishedArchiveEntry\b/,
  /export function getPublishedArchiveSlugs\b/,
  /export function getPublishedArchiveCardMeta\b/,
  /export function isArchiveEntryPublished\b/,
];

for (const regex of requiredExports) {
  if (!regex.test(source)) {
    throw new Error(`content/archive.ts must export ${regex.source.replace(/export const |export function |\\b/g, "").trim()}.`);
  }
}

const requiredArtifactExports = [
  /export const archiveArtifactPages\b/,
  /export function getPublishedArchiveArtifactPage\b/,
  /export function getPublishedArchiveArtifactPages\b/,
  /export function getPublishedArchiveArtifactSlugs\b/,
];

for (const regex of requiredArtifactExports) {
  if (!regex.test(artifactSource)) {
    throw new Error(`content/archiveArtifacts.ts must export ${regex.source.replace(/export const |export function |\\b/g, "").trim()}.`);
  }
}

const entrySlugRegex = /^\s*"([^"]+)":\s*\{/gm;
const cardSlugRegex = /^\s*slug:\s*['"]([^'"]+)['"]/gm;

const archiveSlugs = Array.from(source.matchAll(entrySlugRegex), (match) => match[1]);
const archiveCardSlugs = Array.from(source.matchAll(cardSlugRegex), (match) => match[1]);

if (archiveSlugs.length === 0) {
  throw new Error("No archive entries were found in content/archive.ts.");
}

if (archiveCardSlugs.length === 0) {
  throw new Error("No archive card metadata slugs were found in content/archive.ts.");
}

const slugSet = new Set(archiveSlugs);
const cardSet = new Set(archiveCardSlugs);

const missingCardSlugs = archiveSlugs.filter((slug) => !cardSet.has(slug));
const missingEntrySlugs = archiveCardSlugs.filter((slug) => !slugSet.has(slug));

if (missingCardSlugs.length > 0) {
  throw new Error(
    `Archive registry contains slugs with no matching card metadata: ${missingCardSlugs.join(", ")}`
  );
}

if (missingEntrySlugs.length > 0) {
  throw new Error(
    `Archive card metadata contains slugs with no matching archive entry: ${missingEntrySlugs.join(", ")}`
  );
}

const slugPageSource = await readFile(slugPagePath, "utf8");
if (!/export const dynamic = "force-dynamic"/.test(slugPageSource)) {
  throw new Error("app/archive/[slug]/page.tsx must force dynamic rendering for scheduled archive entries.");
}
if (!/export const revalidate = 0/.test(slugPageSource)) {
  throw new Error("app/archive/[slug]/page.tsx must disable route revalidation for scheduled archive entries.");
}
if (!/export const dynamicParams = true/.test(slugPageSource)) {
  throw new Error("app/archive/[slug]/page.tsx must allow dynamic params for scheduled archive entries.");
}
if (!/export default async function/.test(slugPageSource)) {
  throw new Error("app/archive/[slug]/page.tsx must export a default async function.");
}
if (!/await params/.test(slugPageSource)) {
  throw new Error("app/archive/[slug]/page.tsx must await params before using route parameters.");
}
if (!/import \{\s*notFound\s*\} from ['"]next\/navigation['"]/.test(slugPageSource)) {
  throw new Error("app/archive/[slug]/page.tsx must import notFound from next/navigation.");
}
if (!/import \{\s*getPublishedArchiveEntry\s*\} from ['"](?:\.\.\/){3}content\/archive['"]/.test(slugPageSource)) {
  throw new Error("app/archive/[slug]/page.tsx must import getPublishedArchiveEntry from ../../../content/archive.");
}
if (!/getPublishedArchiveEntry\(/.test(slugPageSource) || !/return notFound\(\)/.test(slugPageSource)) {
  throw new Error("app/archive/[slug]/page.tsx must block unpublished direct archive routes with notFound().");
}

const archiveIndexSource = await readFile(archiveIndexPath, "utf8");
if (!/export const dynamic = "force-dynamic"/.test(archiveIndexSource)) {
  throw new Error("app/archive/page.tsx must force dynamic rendering for scheduled archive entries.");
}
if (!/export const revalidate = 0/.test(archiveIndexSource)) {
  throw new Error("app/archive/page.tsx must disable route revalidation for scheduled archive entries.");
}
if (!/import \{\s*getPublishedArchiveCardMeta\s*\} from ['"](?:\.\.\/){2}content\/archive['"]/.test(archiveIndexSource)) {
  throw new Error("app/archive/page.tsx must import getPublishedArchiveCardMeta from ../../content/archive.");
}
if (!/getPublishedArchiveCardMeta\(\)/.test(archiveIndexSource)) {
  throw new Error("app/archive/page.tsx must derive archive links from published archive card metadata.");
}

const artifactIndexSource = await readFile(artifactIndexPath, "utf8");
if (!/export const dynamic = "force-dynamic"/.test(artifactIndexSource)) {
  throw new Error("app/archive/artifacts/page.tsx must force dynamic rendering for scheduled artifact pages.");
}
if (!/export const revalidate = 0/.test(artifactIndexSource)) {
  throw new Error("app/archive/artifacts/page.tsx must disable route revalidation for scheduled artifact pages.");
}
if (!/getPublishedArchiveArtifactPages\(\)/.test(artifactIndexSource)) {
  throw new Error("app/archive/artifacts/page.tsx must derive artifact links from published artifact pages.");
}

const artifactSlugSource = await readFile(artifactSlugPath, "utf8");
if (!/export const dynamic = "force-dynamic"/.test(artifactSlugSource)) {
  throw new Error("app/archive/artifacts/[slug]/page.tsx must force dynamic rendering for scheduled artifact pages.");
}
if (!/export const revalidate = 0/.test(artifactSlugSource)) {
  throw new Error("app/archive/artifacts/[slug]/page.tsx must disable route revalidation for scheduled artifact pages.");
}
if (!/getPublishedArchiveArtifactPage\(/.test(artifactSlugSource) || !/return notFound\(\)/.test(artifactSlugSource)) {
  throw new Error("app/archive/artifacts/[slug]/page.tsx must block unpublished artifact routes with notFound().");
}

console.log("✅ Archive route validation passed.");
console.log(`Detected archive slugs: ${archiveSlugs.join(", ")}`);
