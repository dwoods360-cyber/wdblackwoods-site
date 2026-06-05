# Private Beta Reader Room Setup

This repository contains the browser-based private Reader Room for:

**WHAT COFFEE DEMANDS**  
Volume One: Hold the Earth  
by W.D. Blackwoods

The unpublished manuscript is not stored in Git and must never be placed in `public/`.

## New Files

- `app/reader-room/*` private reader pages
- `app/api/reader-room/*` protected reader APIs
- `lib/readerRoom*.ts` server-only access, crypto, storage, and type modules
- `scripts/reader-room/*.mjs` local upload and administration scripts
- `tests/reader-room.test.mjs`
- `scripts/validate-reader-room.mjs`

## Dependencies

- `@vercel/blob`
- `mammoth`

## Environment Variables

Server-only:

```env
BLOB_READ_WRITE_TOKEN=
READER_ROOM_SIGNING_SECRET=
READER_ROOM_BOOK_VERSION=draft-3
READER_ROOM_PUBLIC_BASE_URL=https://readers.whatcoffeedemands.com
READER_INTELLIGENCE_ACCESS_SECRET=
```

Do not prefix these with `NEXT_PUBLIC_`.

Generate a signing secret locally:

```bash
openssl rand -base64 32
```

## Private Vercel Blob Store

Manual Vercel dashboard action:

1. Open the `wdblackwoods-site` Vercel project.
2. Create or connect a Vercel Blob store.
3. Keep it private.
4. Add `BLOB_READ_WRITE_TOKEN` to Production and Preview environment variables.
5. Add `READER_ROOM_SIGNING_SECRET`.
6. Add `READER_ROOM_BOOK_VERSION=draft-3`.
7. Add `READER_ROOM_PUBLIC_BASE_URL=https://readers.whatcoffeedemands.com`.
8. Add the custom domain `readers.whatcoffeedemands.com` to the project and configure DNS as Vercel instructs.
9. Redeploy after changing environment variables.

The Blob structure is:

```text
reader-room/books/hold-the-earth/draft-3/manifest.json
reader-room/books/hold-the-earth/draft-3/foreword.json
reader-room/books/hold-the-earth/draft-3/prologue.json
reader-room/books/hold-the-earth/draft-3/chapter-01.json
...
reader-room/books/hold-the-earth/draft-3/chapter-20.json
reader-room/books/hold-the-earth/draft-3/readers/<reader-id>.json
reader-room/books/hold-the-earth/draft-3/invites/<sha256-token-hash>.json
reader-room/books/hold-the-earth/draft-3/progress/<reader-id>.json
reader-room/books/hold-the-earth/draft-3/feedback/<reader-id>.json
```

## Pull Local Vercel Environment

Use the Vercel CLI after the project is linked:

```bash
vercel env pull .env.local
```

Keep `.env.local` ignored.

## Upload Manuscript

Use an absolute path outside the repository:

```bash
npm run reader-room:upload -- --input "/absolute/path/to/WCD_V1_Hold_the_Earth_Draft_3_Master_Final.docx" --version draft-3
```

The upload script converts the DOCX with `mammoth`, validates exactly 20 numbered chapters, writes each chapter as a private Blob record, and does not print manuscript text.

## Create Invitations

```bash
npm run reader-room:create-invite -- --name "Reader One" --email "reader@example.com" --expires "2026-08-31"
```

The invitation URL is printed once. The raw token is not stored; only its SHA-256 hash is saved.

Reader-facing URLs are clean on the custom subdomain:

```text
https://readers.whatcoffeedemands.com/
https://readers.whatcoffeedemands.com/invite/<token>
https://readers.whatcoffeedemands.com/read/<slug>
https://readers.whatcoffeedemands.com/checkpoint/<checkpoint>
https://readers.whatcoffeedemands.com/logout
```

The internal `/reader-room/...` routes remain available for maintainability.

## Revoke Access

```bash
npm run reader-room:revoke-reader -- --reader-id "<reader-id>"
```

Revocation rotates the reader nonce and revokes matching invitations, invalidating active sessions on the next protected request.

## Export Feedback

```bash
npm run reader-room:export-feedback
```

The output is CSV on stdout. Redirect it to a local ignored location if needed.

## Test Locally

```bash
npm run lint
npm run reader-room:validate
npm run validate:routes
npm run build
```

## Safe Preview Sequence

1. Upload the manuscript to a private Blob store for `draft-3`.
2. Create a preview deployment from `feature/private-beta-reader-room`.
3. Confirm preview env vars are set.
4. Create one invitation for your own test email.
5. Open the invite in an incognito browser.
6. Confirm GET invite does not redeem until the button is pressed.
7. Confirm the token disappears after redemption.
8. Confirm no private Blob URL appears in page source.
9. Confirm progress and feedback save.
10. Confirm revoke invalidates access.

## Merge And Redeploy

After review, merge the feature branch and redeploy Production. If any environment variable changes after deployment, redeploy again.

## Remove Manuscript After Beta

Delete the private Blob records under:

```text
reader-room/books/hold-the-earth/draft-3/
```

Do not delete feedback until it has been exported and archived privately.

## Security Limitations

The site prevents public routing, direct Blob URL exposure, downloads, and unauthenticated access. It cannot fully prevent screenshots, manual copying, browser extensions, or photography of a screen.
