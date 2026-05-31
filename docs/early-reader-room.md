# Early Reader Room

The Early Reader Room is a private, passwordless reading surface for selected pages shared by invitation. It does not create accounts, store passwords, send email, or add readers to the public Substack list.

## Environment

Create a long random signing secret for local development and production:

```bash
openssl rand -base64 48
```

Set the values locally in `.env.local`:

```env
EARLY_READER_INVITE_SECRET=
EARLY_READER_TOOL_ENABLED=true
EARLY_READER_BASE_URL=http://localhost:3000
EARLY_READER_PRODUCTION_INVITE_SECRET=
EARLY_READER_PRODUCTION_BASE_URL=https://www.wdblackwoods.com
```

Set these later in Vercel:

```env
EARLY_READER_INVITE_SECRET=
EARLY_READER_TOOL_ENABLED=false
EARLY_READER_BASE_URL=https://www.wdblackwoods.com
```

Never commit real secrets.

The `EARLY_READER_PRODUCTION_*` values are local-generator values only. Do not
add them to Vercel. The local production-generation secret must be entered
manually into `.env.local`, and it must match the deployed
`EARLY_READER_INVITE_SECRET` value stored in Vercel. After that one-time setup,
you do not need to swap `.env.local` values when moving between local and live
invitation generation.

## Reader Data

Copy the committed template:

```bash
cp private/early-readers.example.csv private/early-readers.csv
```

Keep real names and email addresses in `private/early-readers.csv` only. That file is ignored by git. Back it up privately.

Use these `Status` values:

- `active`
- `paused`
- `do_not_contact`

Only `active` rows are eligible for invitation CSV generation.

Reader-specific context belongs in the `Notes` column, such as where permission
was given, what the reader asked to see, or how they prefer to be followed up
with. Do not put real names, email addresses, or private notes in committed
example files.

## Chapter Versions

Each reader-room chapter in `content/reader-room/manifest.ts` has a `version`.
Use simple readable values such as:

```text
v1
v2
v3
2026-06-01-v1
```

Increment the version whenever the text changes enough that feedback should be
understood against a distinct draft. Small typo fixes may stay on the same
version; structural rewrites, new scenes, removed passages, or meaningful line
edits should get a new version.

Chapter packs also have explicit versions. Increment the pack version when the
set of chapters changes or when any included chapter version changes.

## Generating Gmail Merge CSVs

Run the site locally with:

```bash
npm run dev
```

Open `/system/early-readers`. The route is available only when both conditions are true:

```ts
process.env.NODE_ENV === "development"
process.env.EARLY_READER_TOOL_ENABLED === "true"
```

The tool has three invitation destinations:

- `LOCAL TEST` is the default. It creates localhost links that open only on this Mac.
- `LIVE TEST` creates one production-valid invitation for your own test email address.
- `LIVE BATCH` creates reviewed production invitations for active early readers.

Choose a chapter or chapter pack, then generate the Gmail mail-merge CSV. LOCAL
TEST and LIVE BATCH write:

```text
private/out/early-reader-mail-merge.csv
```

LIVE TEST writes:

```text
private/out/early-reader-live-test.csv
```

The generated file is ignored by git. Review every row before using Gmail mail merge.

The generated CSV contains:

```csv
Email,FirstName,LastName,ChapterTitle,ChapterVersion,InviteLink
```

Generating a CSV records each row in the local send log as `prepared`. This
means an invitation file was prepared, not that any email was sent.

After manually sending through Gmail, return to `/system/early-readers` and click
`Mark batch as sent`. The tool updates that batch's prepared rows to `sent` and
records `SentAt`.

LIVE TEST requires explicit confirmation because it grants access through the
deployed website. LIVE BATCH requires both live-access confirmation and a reader
and version review confirmation.

## Safe Sending Workflow

1. Use LOCAL TEST while developing.
2. Use LIVE TEST with your own email address before every real reader batch.
3. Manually send the one-recipient test email through Gmail.
4. Click the invitation link from an incognito browser.
5. Confirm the live reader room opens correctly and the token leaves the browser URL.
6. Generate the LIVE BATCH only after the test succeeds.
7. Review the batch CSV.
8. Send through Gmail manually.
9. Mark the batch as sent.

## Send History

The local send log lives at:

```text
private/early-reader-send-log.csv
```

It is ignored by git. Keep it local and backed up privately.

Use these statuses:

- `prepared`
- `sent`
- `cancelled`
- `expired`

The send log is append-only by default. Do not delete old rows when a revised
chapter is sent. A later send should create a new batch with the new chapter or
pack version.

The local tool shows each reader's latest send, latest version, sent date, send
count, notes, and expandable prior send-history records. Use this history to tie
future feedback to the exact draft a reader received.

LIVE TEST rows use `InviteMode=live_test` and appear in a separate Test history
section. They do not count toward normal early-reader send totals.

## Invite Redirect

Generated links use:

```text
/reader-room/invite/[token]
```

The invite route validates the signed token server-side, sets an HTTP-only cookie, and immediately redirects to:

```text
/reader-room
```

The raw invitation token is never rendered in a client page.

Invitation responses are not cached. Token-bearing invite paths may still appear
in platform-level request logs; this is accepted temporarily for the small
trusted early-reader group.

## Token And Cookie Expiration

Invite tokens use:

```text
base64url(payload).base64url(signature)
```

The signature is HMAC SHA-256. Payloads include a non-sensitive `readerId`, authorized chapter slugs or a pack identifier, and an expiration timestamp. They do not include names, email addresses, secrets, or manuscript text.

The cookie is named:

```text
wd_early_reader
```

It is HTTP-only, scoped to `/reader-room`, and expires with the invitation.

## Adding Chapters Later

Add chapter metadata to `content/reader-room/manifest.ts`. Keep unpublished manuscript prose out of the sitemap and public navigation. Chapter pages remain `noindex` and require the signed reader-room cookie.

## Testing Locally

Use placeholder data in `private/early-readers.csv`, enable the local tool, and generate a CSV. Open one generated invite link and confirm it redirects to `/reader-room`, sets the cookie, and reveals only the authorized placeholder chapter.

## Testing Production

Use a secondary email address and a deliberately small test CSV. Confirm the production invite redirects to a clean `/reader-room` URL and that unauthorized chapter slugs return 404. Delayed readers can receive a newly generated invitation if an earlier live link expires.

## Rotating The Secret

Change `EARLY_READER_INVITE_SECRET` if links must be invalidated. All existing invite links and reader-room cookies signed with the old secret will stop working.

For live links, rotate both the Vercel `EARLY_READER_INVITE_SECRET` and the local
`.env.local` `EARLY_READER_PRODUCTION_INVITE_SECRET` to the same new value.
Existing live links signed with the old secret will stop working.
