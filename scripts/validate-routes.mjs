import { readFile } from "fs/promises";
import path from "path";
import { fileURLToPath } from "url";

const root = path.dirname(fileURLToPath(import.meta.url));
const archivePath = path.resolve(root, "../content/archive.ts");
const slugPagePath = path.resolve(root, "../app/archive/[slug]/page.tsx");
const archiveIndexPath = path.resolve(root, "../app/archive/page.tsx");

const source = await readFile(archivePath, "utf8");

const requiredExports = [
  /export const archiveEntries\b/,
  /export const archiveSlugs\b/,
  /export const archiveCardMeta\b/,
  /export function getArchiveEntry\b/,
];

for (const regex of requiredExports) {
  if (!regex.test(source)) {
    throw new Error(`content/archive.ts must export ${regex.source.replace(/export const |export function |\\b/g, "").trim()}.`);
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
if (!/export const dynamicParams = false/.test(slugPageSource)) {
  throw new Error("app/archive/[slug]/page.tsx must export dynamicParams = false.");
}
if (!/export function generateStaticParams\(/.test(slugPageSource)) {
  throw new Error("app/archive/[slug]/page.tsx must export generateStaticParams().");
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
if (!/import \{\s*getArchiveEntry\s*,\s*archiveSlugs\s*\} from ['"](?:\.\.\/){3}content\/archive['"]/.test(slugPageSource)) {
  throw new Error("app/archive/[slug]/page.tsx must import getArchiveEntry and archiveSlugs from ../../../content/archive.");
}

const archiveIndexSource = await readFile(archiveIndexPath, "utf8");
if (!/import \{\s*archiveCardMeta\s*\} from ['"](?:\.\.\/){2}content\/archive['"]/.test(archiveIndexSource)) {
  throw new Error("app/archive/page.tsx must import archiveCardMeta from ../../content/archive.");
}
if (!/archiveCardMeta\s*\.\s*(?:map|filter)\(/.test(archiveIndexSource)) {
  throw new Error("app/archive/page.tsx must derive archive links from archiveCardMeta only.");
}

console.log("✅ Archive route validation passed.");
console.log(`Detected archive slugs: ${archiveSlugs.join(", ")}`);
