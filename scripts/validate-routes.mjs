import { readFile } from "fs/promises";
import path from "path";
import { fileURLToPath } from "url";

const root = path.dirname(fileURLToPath(import.meta.url));
const archivePath = path.resolve(root, "../content/archive.ts");
const slugPagePath = path.resolve(root, "../app/archive/[slug]/page.tsx");
const archiveIndexPath = path.resolve(root, "../app/archive/page.tsx");

const source = await readFile(archivePath, "utf8");

const entrySlugRegex = /^\s*"([^"]+)":\s*\{/gm;
const cardSlugRegex = /^\s*slug:\s*'([^']+)'/gm;

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

const archiveIndexSource = await readFile(archiveIndexPath, "utf8");
if (!/import \{ archiveCardMeta \} from "\.\.\/\.\.\/content\/archive"/.test(archiveIndexSource)) {
  throw new Error("app/archive/page.tsx must import archiveCardMeta from ../../content/archive.");
}

console.log("✅ Archive route validation passed.");
console.log(`Detected archive slugs: ${archiveSlugs.join(", ")}`);
