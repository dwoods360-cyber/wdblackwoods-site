# Archive Architecture

## Content flow

- All archive story data lives only in `content/archive.ts`.
- The file exports:
  - `archiveEntries`
  - `archiveSlugs`
  - `archiveCardMeta`
  - `getArchiveEntry(slug)`
- The archive registry is the single source of truth for both list metadata and canonical content.

## Route generation

- `app/archive/page.tsx` renders the archive index.
- The index page imports `archiveCardMeta` from `content/archive.ts` and derives links from it.
- `app/archive/[slug]/page.tsx` renders individual archive entries.
- The detail page imports `archiveSlugs` and `getArchiveEntry(slug)` from `content/archive.ts`.
- The page uses `export const dynamicParams = false` and `generateStaticParams()` so all archive slugs are pre-generated.
- The page is async and resolves `params` via `await params` before rendering.
- If `getArchiveEntry(slug)` returns nothing, the page returns `notFound()`.

## Validation flow

- `scripts/validate-routes.mjs` is the build-time guard.
- It verifies:
  - `content/archive.ts` exports `archiveEntries`, `archiveSlugs`, `archiveCardMeta`, and `getArchiveEntry`.
  - every slug in `archiveEntries` has matching `archiveCardMeta`.
  - every `archiveCardMeta` slug has a matching entry in `archiveEntries`.
  - `app/archive/[slug]/page.tsx` exports `dynamicParams = false`.
  - `app/archive/[slug]/page.tsx` exports `generateStaticParams()`.
  - `app/archive/[slug]/page.tsx` is an async function and awaits `params`.
  - `app/archive/[slug]/page.tsx` imports `getArchiveEntry` and `archiveSlugs` from the registry.
  - `app/archive/page.tsx` imports `archiveCardMeta` from the registry and derives links from it.

## Production validation

- `scripts/verify-production-routes.mjs` verifies live deployment behavior.
- It checks:
  - `/archive` returns `200`.
  - `/archive` includes links for every slug in `content/archive.ts`.
  - each `/archive/<slug>` route returns `200`.
  - each archive page includes a rendered title element.
  - `/archive/does-not-exist` returns `404`.

## CI deployment gate behavior

- `.github/workflows/validate-and-build.yml` runs on pushes and pull requests to `main`.
- The pipeline steps are:
  1. `npm ci`
  2. `npm run validate:routes`
  3. `npm run build`
  4. `npm run verify:production -- https://wdblackwoods-site.vercel.app`
- If any step fails, the workflow fails and deployment cannot proceed.

## Failure recovery

If archive routes fail locally or in production:

1. Check `content/archive.ts` for missing or mismatched slugs.
2. Confirm `archiveCardMeta` entries match the `archiveEntries` keys.
3. Verify `app/archive/[slug]/page.tsx` still imports from `content/archive.ts` and has `dynamicParams = false`.
4. Run `npm run validate:routes` locally to surface a clear failure.
5. Verify the live URL with `npm run verify:production -- https://wdblackwoods-site.vercel.app`.

## Adding a new archive entry safely

1. Add a new entry object in `content/archive.ts` under `archiveEntries`.
2. Add matching metadata in `archiveCardMeta` with the same `slug`, a `title`, `description`, and `excerpt`.
3. Do not duplicate story content anywhere else.
4. Run `npm run validate:routes`.
5. Run `npm run build`.
6. Deploy and run `npm run verify:production -- <production-url>`.
