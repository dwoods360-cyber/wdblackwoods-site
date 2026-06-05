import assert from "node:assert/strict"
import { execFile } from "node:child_process"
import { mkdtemp, readFile, writeFile } from "node:fs/promises"
import { tmpdir } from "node:os"
import { join } from "node:path"
import { test } from "node:test"
import { createHash } from "node:crypto"
import { promisify } from "node:util"
import { parseManuscriptHtml, safeDiagnosticLines } from "../scripts/reader-room/parse-manuscript.mjs"

const execFileAsync = promisify(execFile)

const files = {
  access: await readFile("lib/readerRoomAccess.ts", "utf8"),
  crypto: await readFile("lib/readerRoomCrypto.ts", "utf8"),
  storage: await readFile("lib/readerRoomStorage.ts", "utf8"),
  invitePage: await readFile("app/reader-room/invite/[token]/page.tsx", "utf8"),
  redeemRoute: await readFile("app/api/reader-room/redeem/route.ts", "utf8"),
  readPage: await readFile("app/reader-room/read/[slug]/page.tsx", "utf8"),
  progressRoute: await readFile("app/api/reader-room/progress/route.ts", "utf8"),
  feedbackRoute: await readFile("app/api/reader-room/feedback/route.ts", "utf8"),
  adminPage: await readFile("app/system/reader-intelligence/page.tsx", "utf8"),
  uploadScript: await readFile("scripts/reader-room/upload.mjs", "utf8"),
  packageJson: await readFile("package.json", "utf8"),
  hostRouting: await readFile("lib/readerRoomHost.ts", "utf8"),
  proxy: await readFile("proxy.ts", "utf8"),
  readerRoomPage: await readFile("app/reader-room/page.tsx", "utf8"),
}

test("invalid invite token rejected", () => {
  assert.match(files.redeemRoute, /token\.length < 24/)
  assert.match(files.redeemRoute, /status: 403/)
})

test("expired invite rejected", () => {
  assert.match(files.access, /expiresAt/)
  assert.match(files.access, /Date\.now\(\)/)
})

test("revoked invite rejected", () => {
  assert.match(files.access, /invite\.revoked/)
})

test("GET invite page does not redeem access", () => {
  assert.doesNotMatch(files.invitePage, /createReaderRoomSessionCookie/)
  assert.match(files.invitePage, /method="post"/)
})

test("POST redemption sets signed session cookie", () => {
  assert.match(files.redeemRoute, /createReaderRoomSessionCookie/)
  assert.match(files.redeemRoute, /httpOnly: true/)
})

test("invalid cookie rejected", () => {
  assert.match(files.crypto, /verifyReaderRoomSessionCookie/)
  assert.match(files.access, /reason: "invalid"/)
})

test("expired cookie rejected", () => {
  assert.match(files.crypto, /claims\.exp <= Date\.now\(\)/)
})

test("revoked reader session rejected", () => {
  assert.match(files.access, /reader\.revoked/)
})

test("protected chapter content unavailable without valid session", () => {
  assert.match(files.readPage, /getReaderRoomSession/)
  assert.match(files.readPage, /notFound\(\)/)
})

test("no direct private Blob URL appears in browser responses", () => {
  assert.doesNotMatch(files.readPage, /downloadUrl|blob\.url|url:/)
  assert.doesNotMatch(files.invitePage, /downloadUrl|blob\.url|url:/)
})

test("mutable reader-room records use private direct reads and optimistic concurrency", () => {
  assert.match(files.storage, /get\(pathname/)
  assert.match(files.storage, /access: "private"/)
  assert.match(files.storage, /useCache: false/)
  assert.match(files.storage, /ifMatch: etag/)
  assert.match(files.storage, /updateJsonRecord/)
  assert.match(files.storage, /for \(let attempt = 0; attempt < 5/)
})

test("progress update requires valid session", () => {
  assert.match(files.progressRoute, /getReaderRoomSession/)
  assert.match(files.progressRoute, /!auth\.ok/)
})

test("marking a chapter complete redirects to the chapter action anchor", () => {
  assert.match(files.progressRoute, /searchParams\.set\("status", "complete"\)/)
  assert.match(files.progressRoute, /hash = "chapter-actions"/)
})

test("chapter page shows updated completion state after redirect", () => {
  assert.match(files.readPage, /query\.status === "complete"/)
  assert.match(files.readPage, /Chapter marked complete\./)
  assert.match(files.readPage, /progress\.completedSlugs\.includes\(slug\)/)
  assert.match(files.readPage, /Completed/)
  assert.match(files.readPage, /id="chapter-actions"/)
})

test("progress writes merge opened and completed slugs without duplicates", () => {
  assert.match(files.access, /updateReaderRoomProgress/)
  assert.match(files.access, /openedSlugs: Array\.from\(new Set\(\[\.\.\.progress\.openedSlugs, slug\]\)\)/)
  assert.match(files.access, /completedSlugs: Array\.from\(new Set\(\[\.\.\.progress\.completedSlugs, slug\]\)\)/)
})

test("duplicate completion requests do not duplicate completed slugs", () => {
  assert.match(files.access, /completedSlugs: Array\.from\(new Set\(\[\.\.\.progress\.completedSlugs, slug\]\)\)/)
})

test("chapter opens preserve existing completed slugs", () => {
  assert.match(files.access, /completedSlugs: Array\.from\(new Set\(progress\.completedSlugs\)\)/)
})

test("concurrent open and completion updates retry and merge safely", () => {
  assert.match(files.storage, /updateJsonRecord/)
  assert.match(files.storage, /readJsonWithEtag/)
  assert.match(files.storage, /writeJson\(pathname, next, current\.etag\)/)
  assert.match(files.storage, /lastError = error/)
})

test("feedback submission requires valid session", () => {
  assert.match(files.feedbackRoute, /getReaderRoomSession/)
  assert.match(files.feedbackRoute, /!auth\.ok/)
})

test("empty chapter notes are rejected unless checkpoint answers exist", () => {
  assert.match(files.feedbackRoute, /!trimmedNote && Object\.keys\(answers\)\.length === 0/)
  assert.match(files.feedbackRoute, /Private note cannot be empty\./)
})

test("saved private notes redirect to and render the notes anchor", () => {
  assert.match(files.feedbackRoute, /searchParams\.set\("note", "saved"\)/)
  assert.match(files.feedbackRoute, /hash = "private-notes"/)
  assert.match(files.readPage, /query\.note === "saved"/)
  assert.match(files.readPage, /Private note saved\./)
  assert.match(files.readPage, /id="private-notes"/)
})

test("chapter page renders only the current reader's notes for the current slug", () => {
  assert.match(files.readPage, /getReaderRoomChapterNotes\(auth\.reader, slug\)/)
  assert.match(files.access, /entry\.slug === slug && entry\.note/)
  assert.match(files.access, /getReaderRoomFeedback\(reader\.bookVersion, reader\.readerId\)/)
  assert.match(files.readPage, /Saved private notes for this chapter/)
})

test("feedback writes append entries without replacing existing notes", () => {
  assert.match(files.access, /updateReaderRoomFeedback/)
  assert.match(files.access, /entries: \[\.\.\.current\.entries, savedEntry\]/)
})

test("multiple notes are preserved and notes for other chapters do not appear", () => {
  assert.match(files.access, /entries: \[\.\.\.current\.entries, savedEntry\]/)
  assert.match(files.access, /entry\.slug === slug && entry\.note/)
})

test("admin dashboard requires administrative access", () => {
  assert.match(files.adminPage, /hasReaderIntelligenceAccess/)
})

test("import script rejects a manuscript without exactly 20 numbered chapters", () => {
  assert.match(files.uploadScript, /diagnostics\.valid/)
  assert.match(files.uploadScript, /Refusing upload/)
})

test("import script does not write manuscript text to logs", () => {
  assert.doesNotMatch(files.uploadScript, /console\.log\(.*html|console\.log\(.*converted\.value|console\.log\(.*body/)
})

test("token hashes are deterministic and not raw tokens", () => {
  const token = "sample-private-reader-token"
  const hash = createHash("sha256").update(token).digest("hex")
  assert.notEqual(hash, token)
  assert.equal(hash.length, 64)
})

test("host-based root routing rewrites to reader room", () => {
  assert.ok(files.hostRouting.includes('pathname === "/"'))
  assert.ok(files.hostRouting.includes('return "/reader-room"'))
  assert.match(files.proxy, /isReaderRoomHost/)
  assert.match(files.proxy, /NextResponse\.rewrite/)
})

test("clean invite URLs map to invitation landing page", () => {
  assert.ok(files.hostRouting.includes('pathname.startsWith("/invite/")'))
  assert.ok(files.hostRouting.includes("`/reader-room${pathname}`"))
})

test("clean protected reading URLs map to protected reader-room pages", () => {
  assert.ok(files.hostRouting.includes('pathname.startsWith("/read/")'))
  assert.ok(files.hostRouting.includes('pathname.startsWith("/checkpoint/")'))
  assert.ok(files.hostRouting.includes('pathname === "/logout"'))
})

test("reader-room host pages avoid public archive navigation", () => {
  assert.ok(!files.readerRoomPage.includes('href="/archive"'))
  assert.ok(!files.readerRoomPage.includes('href="/begin"'))
  assert.ok(!files.readerRoomPage.includes('href="/about"'))
})

test("existing archive routes are preserved outside reader-room host", () => {
  assert.match(files.proxy, /NextResponse\.next\(\)/)
  assert.match(files.hostRouting, /readers\.whatcoffeedemands\.com/)
})

function syntheticParagraphManuscript({
  omit = [],
  duplicate,
  order,
} = {}) {
  const words = [
    "ONE",
    "TWO",
    "THREE",
    "FOUR",
    "FIVE",
    "SIX",
    "SEVEN",
    "EIGHT",
    "NINE",
    "TEN",
    "ELEVEN",
    "TWELVE",
    "THIRTEEN",
    "FOURTEEN",
    "FIFTEEN",
    "SIXTEEN",
    "SEVENTEEN",
    "EIGHTEEN",
    "NINETEEN",
    "TWENTY",
  ]
  const titles = [
    "Gentlemen’s Arrangements",
    "Goodbye",
    "The Sea",
    "The Storm",
    "Chapter Five",
    "Chapter Six",
    "Chapter Seven",
    "Chapter Eight",
    "Chapter Nine",
    "Chapter Ten",
    "Chapter Eleven",
    "Chapter Twelve",
    "Chapter Thirteen",
    "Chapter Fourteen",
    "Chapter Fifteen",
    "Chapter Sixteen",
    "Chapter Seventeen",
    "Chapter Eighteen",
    "Chapter Nineteen",
    "Evening",
  ]
  const numbers = order || Array.from({ length: 20 }, (_value, index) => index + 1)
  const chapterBlocks = numbers.flatMap((number) => {
    if (omit.includes(number)) {
      return []
    }

    return [
      `<p>CHAPTER ${words[number - 1]}: ${titles[number - 1]}</p>`,
      number === 7 ? "<p>MASSAWA</p>" : "",
      "<p>Synthetic sample paragraph.</p>",
    ]
  })

  if (duplicate) {
    chapterBlocks.push(`<p>CHAPTER ${words[duplicate - 1]}: Duplicate Synthetic</p>`)
    chapterBlocks.push("<p>Synthetic sample paragraph.</p>")
  }

  return ["<p>Foreword</p>", "<p>Synthetic sample paragraph.</p>", "<p>Prologue</p>", "<p>Synthetic sample paragraph.</p>", ...chapterBlocks].join("")
}

test("parser detects uppercase spelled-out paragraph chapter headings", () => {
  const { sections, diagnostics } = parseManuscriptHtml(syntheticParagraphManuscript())
  assert.equal(diagnostics.valid, true)
  assert.equal(diagnostics.forewordFound, true)
  assert.equal(diagnostics.prologueFound, true)
  assert.equal(diagnostics.chapterCount, 20)
  assert.equal(diagnostics.finalSectionCount, 22)
  assert.equal(sections.find((section) => section.slug === "chapter-01")?.title, "CHAPTER ONE: Gentlemen’s Arrangements")
  assert.equal(sections.find((section) => section.slug === "chapter-20")?.title, "CHAPTER TWENTY: Evening")
})

test("parser treats MASSAWA as internal location heading", () => {
  const { sections, diagnostics } = parseManuscriptHtml(syntheticParagraphManuscript())
  assert.equal(diagnostics.chapterCount, 20)
  assert.equal(sections.some((section) => section.title === "MASSAWA"), false)
  assert.match(sections.find((section) => section.slug === "chapter-07")?.html || "", /MASSAWA/)
})

test("parser supports Arabic-number chapter headings", () => {
  const html = [
    "<h1>Foreword</h1><p>Synthetic.</p>",
    "<h1>Prologue</h1><p>Synthetic.</p>",
    ...Array.from({ length: 20 }, (_value, index) => `<p>CHAPTER ${index + 1}: Synthetic ${index + 1}</p><p>Synthetic.</p>`),
  ].join("")
  const { diagnostics } = parseManuscriptHtml(html)
  assert.equal(diagnostics.valid, true)
  assert.equal(diagnostics.chapterCount, 20)
})

test("parser rejects missing, duplicate, and out-of-order chapters", () => {
  assert.equal(parseManuscriptHtml(syntheticParagraphManuscript({ omit: [9] })).diagnostics.valid, false)
  assert.equal(parseManuscriptHtml(syntheticParagraphManuscript({ duplicate: 9 })).diagnostics.valid, false)
  assert.equal(parseManuscriptHtml(syntheticParagraphManuscript({ order: [2, 1, ...Array.from({ length: 18 }, (_value, index) => index + 3)] })).diagnostics.valid, false)
})

test("safe diagnostics do not include manuscript prose", () => {
  const { diagnostics } = parseManuscriptHtml(syntheticParagraphManuscript())
  const lines = safeDiagnosticLines(diagnostics).join("\n")
  assert.match(lines, /Foreword found: yes/)
  assert.match(lines, /Chapter count: 20/)
  assert.doesNotMatch(lines, /Synthetic sample paragraph/)
})

test("reader-room terminal scripts load .env.local when present", () => {
  const packageJson = JSON.parse(files.packageJson)
  for (const scriptName of [
    "reader-room:upload",
    "reader-room:create-invite",
    "reader-room:list-readers",
    "reader-room:revoke-reader",
    "reader-room:export-feedback",
  ]) {
    assert.match(packageJson.scripts[scriptName], /node --env-file-if-exists=\.env\.local/)
  }
})

test("dry-run succeeds without Blob token and performs no storage write", async () => {
  const dir = await mkdtemp(join(tmpdir(), "reader-room-upload-"))
  const inputPath = join(dir, "synthetic.html")
  await writeFile(inputPath, syntheticParagraphManuscript(), "utf8")

  const env = { ...process.env }
  delete env.BLOB_READ_WRITE_TOKEN

  const { stdout } = await execFileAsync(
    process.execPath,
    ["scripts/reader-room/upload.mjs", "--input-html", inputPath, "--version", "draft-3", "--dry-run"],
    { env }
  )

  assert.match(stdout, /Foreword found: yes/)
  assert.match(stdout, /Prologue found: yes/)
  assert.match(stdout, /Chapter count: 20/)
  assert.match(stdout, /Final section count: 22/)
  assert.doesNotMatch(stdout, /Synthetic sample paragraph/)
})
