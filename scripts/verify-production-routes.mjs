import { readFile } from "fs/promises";
import path from "path";
import { fileURLToPath } from "url";

const root = path.dirname(fileURLToPath(import.meta.url));
const archivePath = path.resolve(root, "../content/archive.ts");

const source = await readFile(archivePath, "utf8");
const slugRegex = /^\s*"([^\"]+)":\s*\{/gm;
const archiveSlugs = Array.from(source.matchAll(slugRegex), (match) => match[1]);

if (archiveSlugs.length === 0) {
  throw new Error("No archive entries were found in content/archive.ts.");
}

const productionUrlString = process.env.PRODUCTION_URL || process.argv[2] || "https://wdblackwoods-site.vercel.app";
let productionUrl;
try {
  productionUrl = new URL(productionUrlString);
} catch {
  throw new Error(
    `Production verification requires a valid URL. Set PRODUCTION_URL or pass one as the first argument. Received: ${productionUrlString}`
  );
}

function getProductionUrl(pathname) {
  return new URL(pathname, productionUrl).toString();
}

async function fetchText(url) {
  const response = await fetch(url, { cache: "no-store" });
  const text = await response.text();
  return { response, text };
}

async function assertRoute(pathname, expectedStatus) {
  const url = getProductionUrl(pathname);
  const { response, text } = await fetchText(url);

  if (response.status !== expectedStatus) {
    throw new Error(
      `Route ${pathname} returned status ${response.status}, expected ${expectedStatus}. URL: ${url}`
    );
  }

  console.log(`✅ ${pathname} -> ${response.status} (${url})`);
  console.log(`   x-nextjs-prerender: ${response.headers.get("x-nextjs-prerender") ?? "-"}`);
  console.log(`   x-vercel-cache: ${response.headers.get("x-vercel-cache") ?? "-"}`);

  return { response, text };
}

function assertIncludes(text, substring, context) {
  if (!text.includes(substring)) {
    throw new Error(`Production HTML for ${context} did not include expected string: ${substring}`);
  }
}

console.log(`Verifying production deployment at ${productionUrl.href}`);
console.log(`Detected archive slugs: ${archiveSlugs.join(", ")}`);

const archiveIndex = await assertRoute("/archive", 200);
for (const slug of archiveSlugs) {
  assertIncludes(archiveIndex.text, `href=\"/archive/${slug}\"`, `/archive index page`);
}

for (const slug of archiveSlugs) {
  const route = `/archive/${slug}`;
  const { text } = await assertRoute(route, 200);
  assertIncludes(text, "<h1>", route);
}

await assertRoute("/archive/does-not-exist", 404);

console.log("✅ Production archive route verification passed.");
