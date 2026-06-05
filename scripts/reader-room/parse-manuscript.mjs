const chapterWords = [
  "one",
  "two",
  "three",
  "four",
  "five",
  "six",
  "seven",
  "eight",
  "nine",
  "ten",
  "eleven",
  "twelve",
  "thirteen",
  "fourteen",
  "fifteen",
  "sixteen",
  "seventeen",
  "eighteen",
  "nineteen",
  "twenty",
]

const chapterPattern = new RegExp(
  `^chapter\\s+(${chapterWords.join("|")}|\\d{1,2})(?::\\s*(.+))?$`,
  "i"
)

function textFromHtml(html) {
  return html
    .replace(/<br\s*\/?>/gi, " ")
    .replace(/<[^>]+>/g, "")
    .replace(/&nbsp;/gi, " ")
    .replace(/&amp;/gi, "&")
    .replace(/&quot;/gi, '"')
    .replace(/&#39;/gi, "'")
    .replace(/\s+/g, " ")
    .trim()
}

function chapterNumberFromToken(token) {
  const lower = token.toLowerCase()
  const wordIndex = chapterWords.indexOf(lower)

  if (wordIndex >= 0) {
    return wordIndex + 1
  }

  const number = Number.parseInt(token, 10)
  return Number.isInteger(number) ? number : undefined
}

function slugForChapter(number) {
  return `chapter-${String(number).padStart(2, "0")}`
}

function blockTokens(html) {
  const withoutArtifacts = html.replaceAll(
    /<p>\s*(?:\d+|W\.D\. Blackwoods|What Coffee Demands)\s*<\/p>/gi,
    ""
  )
  const blocks = withoutArtifacts.match(/<(p|h[1-6])\b[^>]*>.*?<\/\1>/gis) || []

  return blocks.map((block) => ({
    html: block,
    text: textFromHtml(block),
  }))
}

function sectionMarker(text) {
  if (/^foreword$/i.test(text)) {
    return {
      kind: "foreword",
      slug: "foreword",
      title: text,
      label: "Foreword",
    }
  }

  if (/^prologue$/i.test(text)) {
    return {
      kind: "prologue",
      slug: "prologue",
      title: text,
      label: "Prologue",
    }
  }

  const chapterMatch = text.match(chapterPattern)

  if (!chapterMatch) {
    return undefined
  }

  const number = chapterNumberFromToken(chapterMatch[1])

  if (!number || number < 1 || number > 20) {
    return undefined
  }

  return {
    kind: "chapter",
    slug: slugForChapter(number),
    title: text,
    label: `Chapter ${number}`,
    number,
    titleAfterColon: chapterMatch[2] || "",
    checkpoint:
      number === 3 ? "chapter-03" : number === 7 ? "chapter-07" : number === 20 ? "chapter-20" : undefined,
  }
}

function validateSections(sections) {
  const forewordFound = sections.some((section) => section.kind === "foreword")
  const prologueFound = sections.some((section) => section.kind === "prologue")
  const chapters = sections.filter((section) => section.kind === "chapter")
  const chapterNumbers = chapters.map((chapter) => chapter.number)
  const errors = []

  if (!forewordFound) {
    errors.push("Foreword is missing.")
  }

  if (!prologueFound) {
    errors.push("Prologue is missing.")
  }

  if (chapters.length !== 20) {
    errors.push(`Expected 20 numbered chapters, found ${chapters.length}.`)
  }

  if (sections.length !== 22) {
    errors.push(`Expected 22 reading sections, found ${sections.length}.`)
  }

  for (let expected = 1; expected <= 20; expected += 1) {
    const count = chapterNumbers.filter((number) => number === expected).length

    if (count === 0) {
      errors.push(`Chapter ${expected} is missing.`)
    }

    if (count > 1) {
      errors.push(`Chapter ${expected} is duplicated.`)
    }
  }

  for (let index = 0; index < chapterNumbers.length; index += 1) {
    if (chapterNumbers[index] !== index + 1) {
      errors.push("Chapter order is incorrect.")
      break
    }
  }

  return {
    valid: errors.length === 0,
    errors,
    forewordFound,
    prologueFound,
    chapterCount: chapters.length,
    chapters,
    finalSectionCount: sections.length,
  }
}

export function parseManuscriptHtml(html) {
  const blocks = blockTokens(html)
  const sections = []
  let currentSection

  for (const block of blocks) {
    const marker = sectionMarker(block.text)

    if (marker) {
      if (currentSection) {
        sections.push(currentSection)
      }

      currentSection = {
        ...marker,
        order: sections.length + 1,
        html: "",
      }
      continue
    }

    if (currentSection) {
      currentSection.html += block.html
    }
  }

  if (currentSection) {
    sections.push(currentSection)
  }

  const diagnostics = validateSections(sections)

  return {
    sections,
    diagnostics,
  }
}

export function safeDiagnosticLines(diagnostics) {
  return [
    `Foreword found: ${diagnostics.forewordFound ? "yes" : "no"}`,
    `Prologue found: ${diagnostics.prologueFound ? "yes" : "no"}`,
    `Chapter count: ${diagnostics.chapterCount}`,
    ...diagnostics.chapters.map(
      (chapter) => `Chapter ${chapter.number}: ${chapter.title}`
    ),
    `Final section count: ${diagnostics.finalSectionCount}`,
  ]
}
