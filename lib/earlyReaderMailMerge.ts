import "server-only"

import { appendFileSync, existsSync, mkdirSync, readFileSync, writeFileSync } from "fs"
import { randomBytes } from "crypto"
import path from "path"
import {
  createInviteExpiration,
  createReaderId,
  signInviteToken,
} from "@/lib/earlyReaderAccess"
import {
  getEnabledReaderChapters,
  getReaderChapter,
  getReaderChapterPack,
  readerChapterPacks,
} from "@/content/reader-room/manifest"

export type EarlyReaderRow = {
  readerId: string
  firstName: string
  lastName: string
  email: string
  notes: string
  status: string
}

export type MailMergeRow = {
  Email: string
  FirstName: string
  LastName: string
  ChapterTitle: string
  ChapterVersion: string
  InviteLink: string
}

export type SendLogStatus = "prepared" | "sent" | "cancelled" | "expired"

export type SendLogRow = {
  batchId: string
  readerId: string
  email: string
  chapterSlug: string
  chapterTitle: string
  chapterVersion: string
  packId: string
  packVersion: string
  preparedAt: string
  sentAt: string
  inviteExpiresAt: string
  status: SendLogStatus
  notes: string
}

export type ReaderHistorySummary = {
  reader: EarlyReaderRow
  sendCount: number
  lastTitle: string
  lastVersion: string
  lastSentDate: string
  records: SendLogRow[]
}

export const privateReaderCsvPath = path.join(process.cwd(), "private", "early-readers.csv")
export const privateSendLogCsvPath = path.join(
  process.cwd(),
  "private",
  "early-reader-send-log.csv"
)
export const privateMailMergeOutDir = path.join(process.cwd(), "private", "out")
export const privateMailMergeCsvPath = path.join(
  privateMailMergeOutDir,
  "early-reader-mail-merge.csv"
)

export function isEarlyReaderToolEnabled() {
  return (
    process.env.NODE_ENV === "development" &&
    process.env.EARLY_READER_TOOL_ENABLED === "true"
  )
}

function parseCsvLine(line: string) {
  const values: string[] = []
  let current = ""
  let quoted = false

  for (let index = 0; index < line.length; index += 1) {
    const character = line[index]
    const next = line[index + 1]

    if (character === '"' && quoted && next === '"') {
      current += '"'
      index += 1
      continue
    }

    if (character === '"') {
      quoted = !quoted
      continue
    }

    if (character === "," && !quoted) {
      values.push(current)
      current = ""
      continue
    }

    current += character
  }

  values.push(current)
  return values
}

function escapeCsvValue(value: string) {
  if (!/[",\n\r]/.test(value)) {
    return value
  }

  return `"${value.replaceAll('"', '""')}"`
}

function toCsv(rows: MailMergeRow[]) {
  const headers = [
    "Email",
    "FirstName",
    "LastName",
    "ChapterTitle",
    "ChapterVersion",
    "InviteLink",
  ] as const
  const lines = [
    headers.join(","),
    ...rows.map((row) => headers.map((header) => escapeCsvValue(row[header])).join(",")),
  ]

  return `${lines.join("\n")}\n`
}

function sendLogRowToCsv(row: SendLogRow) {
  const values = [
    row.batchId,
    row.readerId,
    row.email,
    row.chapterSlug,
    row.chapterTitle,
    row.chapterVersion,
    row.packId,
    row.packVersion,
    row.preparedAt,
    row.sentAt,
    row.inviteExpiresAt,
    row.status,
    row.notes,
  ]

  return values.map(escapeCsvValue).join(",")
}

function sendLogCsvHeader() {
  return [
    "BatchId",
    "ReaderId",
    "Email",
    "ChapterSlug",
    "ChapterTitle",
    "ChapterVersion",
    "PackId",
    "PackVersion",
    "PreparedAt",
    "SentAt",
    "InviteExpiresAt",
    "Status",
    "Notes",
  ].join(",")
}

function ensureSendLogFile() {
  if (!existsSync(privateSendLogCsvPath)) {
    writeFileSync(privateSendLogCsvPath, `${sendLogCsvHeader()}\n`, "utf8")
  }
}

export function readEarlyReaders() {
  if (!existsSync(privateReaderCsvPath)) {
    return {
      rows: [] as EarlyReaderRow[],
      missing: true,
    }
  }

  const [headerLine, ...lines] = readFileSync(privateReaderCsvPath, "utf8")
    .split(/\r?\n/)
    .filter(Boolean)

  if (!headerLine) {
    return {
      rows: [] as EarlyReaderRow[],
      missing: false,
    }
  }

  const headers = parseCsvLine(headerLine)
  const rows = lines.map((line) => {
    const values = parseCsvLine(line)
    const record = Object.fromEntries(headers.map((header, index) => [header, values[index] ?? ""]))

    return {
      readerId: record.ReaderId || createReaderId(),
      firstName: record.FirstName ?? "",
      lastName: record.LastName ?? "",
      email: record.Email ?? "",
      notes: record.Notes ?? "",
      status: (record.Status ?? "").toLowerCase(),
    }
  })

  return {
    rows,
    missing: false,
  }
}

export function getEligibleEarlyReaders() {
  return readEarlyReaders().rows.filter((reader) => reader.status === "active")
}

export function getReaderSelectionOptions() {
  return [
    ...getEnabledReaderChapters().map((chapter) => ({
      id: `chapter:${chapter.slug}`,
      label: `${chapter.title} (${chapter.version})`,
      title: chapter.title,
      version: chapter.version,
    })),
    ...readerChapterPacks.map((pack) => ({
      id: `pack:${pack.id}`,
      label: `${pack.title} pack (${pack.version})`,
      title: pack.title,
      version: pack.version,
    })),
  ]
}

function resolveSelection(selection: string) {
  const [kind, id] = selection.split(":")

  if (kind === "chapter") {
    const chapter = getReaderChapter(id)

    if (!chapter) {
      return undefined
    }

    return {
      title: chapter.title,
      version: chapter.version,
      chapters: [chapter.slug],
    }
  }

  if (kind === "pack") {
    const pack = getReaderChapterPack(id)

    if (!pack) {
      return undefined
    }

    return {
      title: pack.title,
      version: pack.version,
      pack: pack.id,
      packVersion: pack.version,
      chapters: pack.chapterSlugs,
    }
  }

  return undefined
}

function getBaseUrl() {
  const baseUrl = process.env.EARLY_READER_BASE_URL

  if (!baseUrl) {
    throw new Error("EARLY_READER_BASE_URL is required to generate reader invites.")
  }

  return baseUrl.replace(/\/$/, "")
}

export function readSendLog() {
  if (!existsSync(privateSendLogCsvPath)) {
    return [] as SendLogRow[]
  }

  const [headerLine, ...lines] = readFileSync(privateSendLogCsvPath, "utf8")
    .split(/\r?\n/)
    .filter(Boolean)

  if (!headerLine) {
    return []
  }

  const headers = parseCsvLine(headerLine)

  return lines.map((line) => {
    const values = parseCsvLine(line)
    const record = Object.fromEntries(headers.map((header, index) => [header, values[index] ?? ""]))

    return {
      batchId: record.BatchId ?? "",
      readerId: record.ReaderId ?? "",
      email: record.Email ?? "",
      chapterSlug: record.ChapterSlug ?? "",
      chapterTitle: record.ChapterTitle ?? "",
      chapterVersion: record.ChapterVersion ?? "",
      packId: record.PackId ?? "",
      packVersion: record.PackVersion ?? "",
      preparedAt: record.PreparedAt ?? "",
      sentAt: record.SentAt ?? "",
      inviteExpiresAt: record.InviteExpiresAt ?? "",
      status: (record.Status ?? "prepared") as SendLogStatus,
      notes: record.Notes ?? "",
    }
  })
}

export function getLatestPreparedBatch() {
  return readSendLog()
    .filter((row) => row.status === "prepared")
    .sort((first, second) => second.preparedAt.localeCompare(first.preparedAt))[0]
}

export function getReaderHistorySummaries() {
  const readers = readEarlyReaders().rows
  const history = readSendLog()

  return readers.map((reader) => {
    const records = history
      .filter((row) => row.readerId === reader.readerId || row.email === reader.email)
      .sort((first, second) => {
        const firstDate = first.sentAt || first.preparedAt
        const secondDate = second.sentAt || second.preparedAt
        return secondDate.localeCompare(firstDate)
      })
    const last = records[0]

    return {
      reader,
      sendCount: records.filter((row) => row.status === "sent").length,
      lastTitle: last?.chapterTitle || "—",
      lastVersion: last?.chapterVersion || last?.packVersion || "—",
      lastSentDate: last?.sentAt ? last.sentAt.slice(0, 10) : "—",
      records,
    } satisfies ReaderHistorySummary
  })
}

export function generateMailMergeCsv(selection: string) {
  const resolvedSelection = resolveSelection(selection)

  if (!resolvedSelection) {
    throw new Error("Selected reader-room chapter or pack is unavailable.")
  }

  const baseUrl = getBaseUrl()
  const exp = createInviteExpiration()
  const batchId = randomBytes(8).toString("hex")
  const preparedAt = new Date().toISOString()
  const expiresAt = new Date(exp)
  const inviteExpiresAt = expiresAt.toISOString()
  const sendLogRows: SendLogRow[] = []
  const rows = getEligibleEarlyReaders().map((reader) => {
    const token = signInviteToken({
      readerId: reader.readerId,
      chapters: resolvedSelection.chapters,
      pack: resolvedSelection.pack,
      exp,
    })

    const row = {
      Email: reader.email,
      FirstName: reader.firstName,
      LastName: reader.lastName,
      ChapterTitle: resolvedSelection.title,
      ChapterVersion: resolvedSelection.version,
      InviteLink: `${baseUrl}/reader-room/invite/${token}`,
    } satisfies MailMergeRow

    for (const chapterSlug of resolvedSelection.chapters) {
      const chapter = getReaderChapter(chapterSlug)

      sendLogRows.push({
        batchId,
        readerId: reader.readerId,
        email: reader.email,
        chapterSlug,
        chapterTitle: chapter?.title ?? resolvedSelection.title,
        chapterVersion: chapter?.version ?? resolvedSelection.version,
        packId: resolvedSelection.pack ?? "",
        packVersion: resolvedSelection.packVersion ?? "",
        preparedAt,
        sentAt: "",
        inviteExpiresAt,
        status: "prepared",
        notes: "",
      })
    }

    return row
  })

  mkdirSync(privateMailMergeOutDir, { recursive: true })
  writeFileSync(privateMailMergeCsvPath, toCsv(rows), "utf8")
  ensureSendLogFile()

  if (sendLogRows.length > 0) {
    appendFileSync(
      privateSendLogCsvPath,
      sendLogRows.map(sendLogRowToCsv).join("\n") + "\n",
      "utf8"
    )
  }

  return {
    batchId,
    rows,
    expiresAt,
    outputPath: privateMailMergeCsvPath,
  }
}

export function markBatchAsSent(batchId: string) {
  const rows = readSendLog()
  const sentAt = new Date().toISOString()
  let updated = false
  const nextRows = rows.map((row) => {
    if (row.batchId !== batchId || row.status !== "prepared") {
      return row
    }

    updated = true
    return {
      ...row,
      status: "sent" as const,
      sentAt,
    }
  })

  if (!updated) {
    return {
      updated: false,
      sentAt,
    }
  }

  writeFileSync(
    privateSendLogCsvPath,
    `${sendLogCsvHeader()}\n${nextRows.map(sendLogRowToCsv).join("\n")}\n`,
    "utf8"
  )

  return {
    updated,
    sentAt,
  }
}

export function hasGeneratedMailMergeCsv() {
  return existsSync(privateMailMergeCsvPath)
}
