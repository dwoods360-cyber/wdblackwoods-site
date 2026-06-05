import mammoth from "mammoth"
import {
  argValue,
  bookVersion,
  loadHtmlForTest,
  loadDocxBuffer,
  prefix,
  putJson,
} from "./common.mjs"
import { parseManuscriptHtml, safeDiagnosticLines } from "./parse-manuscript.mjs"

const input = argValue("--input")
const inputHtml = argValue("--input-html")
const version = bookVersion()
const dryRun = process.argv.includes("--dry-run") || process.argv.includes("--diagnose")
const html = inputHtml
  ? await loadHtmlForTest(inputHtml)
  : (await mammoth.convertToHtml({ buffer: await loadDocxBuffer(input) })).value
const { sections, diagnostics } = parseManuscriptHtml(html)
const numberedChapters = diagnostics.chapters

if (dryRun) {
  for (const line of safeDiagnosticLines(diagnostics)) {
    console.log(line)
  }

  if (diagnostics.valid) {
    process.exit(0)
  }
}

if (!diagnostics.valid) {
  throw new Error(`Refusing upload: ${diagnostics.errors.join(" ")}`)
}

if (numberedChapters.length !== 20) {
  throw new Error(`Refusing upload: expected 20 numbered chapters, found ${numberedChapters.length}.`)
}

const manifest = {
  bookId: "hold-the-earth",
  title: "WHAT COFFEE DEMANDS",
  volume: "Volume One: Hold the Earth",
  author: "W.D. Blackwoods",
  version,
  updatedAt: new Date().toISOString(),
  sections: sections.map((section) => {
    const summary = { ...section }
    delete summary.html
    return summary
  }),
}

await putJson(`${prefix(version)}/manifest.json`, manifest)

for (const section of sections) {
  await putJson(`${prefix(version)}/${section.slug}.json`, section)
}

console.log(`Uploaded ${sections.length} private reader-room sections for ${version}.`)
console.log(`Numbered chapters validated: ${numberedChapters.length}.`)
