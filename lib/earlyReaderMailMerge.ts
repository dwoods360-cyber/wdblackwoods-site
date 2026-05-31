import "server-only"

import {
  appendFileSync,
  copyFileSync,
  existsSync,
  mkdirSync,
  readFileSync,
  writeFileSync,
} from "fs"
import { randomBytes } from "crypto"
import path from "path"
import {
  createInviteExpiration,
  createReaderId,
  signInviteTokenWithSecret,
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
export type InviteMode = "legacy" | "local_test" | "live_test" | "live_batch"

export type SendLogRow = {
  batchId: string
  readerId: string
  email: string
  chapterSlug: string
  chapterTitle: string
  chapterVersion: string
  packId: string
  packVersion: string
  inviteMode: InviteMode
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

export type GenerateMailMergeInput = {
  selection: string
  inviteMode: InviteMode
  liveAccessConfirmed?: boolean
  reviewedRecipientsConfirmed?: boolean
  testRecipientFirstName?: string
  testRecipientEmail?: string
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
export const privateLiveTestCsvPath = path.join(privateMailMergeOutDir, "early-reader-live-test.csv")
export const privateSendLogBackupPath = path.join(
  privateMailMergeOutDir,
  "early-reader-send-log.pre-invite-mode-backup.csv"
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
    row.inviteMode,
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
    "InviteMode",
    "PreparedAt",
    "SentAt",
    "InviteExpiresAt",
    "Status",
    "Notes",
  ].join(",")
}

function normalizeSendLogRows(headers: string[], lines: string[]) {
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
      inviteMode: (record.InviteMode || "legacy") as InviteMode,
      preparedAt: record.PreparedAt ?? "",
      sentAt: record.SentAt ?? "",
      inviteExpiresAt: record.InviteExpiresAt ?? "",
      status: (record.Status ?? "prepared") as SendLogStatus,
      notes: record.Notes ?? "",
    } satisfies SendLogRow
  })
}

export function migrateSendLogIfNeeded() {
  if (!existsSync(privateSendLogCsvPath)) {
    writeFileSync(privateSendLogCsvPath, `${sendLogCsvHeader()}\n`, "utf8")
    return {
      migrated: false,
      created: true,
    }
  }

  const contents = readFileSync(privateSendLogCsvPath, "utf8")
  const [headerLine, ...lines] = contents.split(/\r?\n/).filter(Boolean)

  if (!headerLine) {
    writeFileSync(privateSendLogCsvPath, `${sendLogCsvHeader()}\n`, "utf8")
    return {
      migrated: false,
      created: true,
    }
  }

  const headers = parseCsvLine(headerLine)

  if (headers.includes("InviteMode")) {
    return {
      migrated: false,
      created: false,
    }
  }

  mkdirSync(privateMailMergeOutDir, { recursive: true })
  copyFileSync(privateSendLogCsvPath, privateSendLogBackupPath)

  const rows = normalizeSendLogRows(headers, lines)
  writeFileSync(
    privateSendLogCsvPath,
    `${sendLogCsvHeader()}\n${rows.map(sendLogRowToCsv).join("\n")}${rows.length ? "\n" : ""}`,
    "utf8"
  )

  return {
    migrated: true,
    created: false,
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

function getSigningConfig(inviteMode: InviteMode) {
  if (inviteMode === "live_test" || inviteMode === "live_batch") {
    const secret = process.env.EARLY_READER_PRODUCTION_INVITE_SECRET
    const baseUrl = process.env.EARLY_READER_PRODUCTION_BASE_URL

    if (!secret || !baseUrl) {
      throw new Error("Live invitation generation is not configured on this Mac.")
    }

    return {
      secret,
      baseUrl: baseUrl.replace(/\/$/, ""),
    }
  }

  const secret = process.env.EARLY_READER_INVITE_SECRET
  const baseUrl = process.env.EARLY_READER_BASE_URL

  if (!secret || !baseUrl) {
    throw new Error("Local invitation generation is not configured on this Mac.")
  }

  return {
    secret,
    baseUrl: baseUrl.replace(/\/$/, ""),
  }
}

function normalizeInviteMode(mode: FormDataEntryValue | string | null) {
  if (mode === "live_test" || mode === "live_batch") {
    return mode
  }

  return "local_test"
}

export function getInviteModeLabel(inviteMode: InviteMode) {
  if (inviteMode === "live_test") {
    return "LIVE TEST — send one production-valid invitation to yourself"
  }

  if (inviteMode === "live_batch") {
    return "LIVE BATCH — prepare invitations for early readers"
  }

  if (inviteMode === "legacy") {
    return "Legacy"
  }

  return "LOCAL TEST — localhost only"
}

export function readSendLog() {
  migrateSendLogIfNeeded()

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
  return normalizeSendLogRows(headers, lines)
}

export function getLatestPreparedBatch() {
  return readSendLog()
    .filter((row) => row.status === "prepared" && row.inviteMode !== "live_test")
    .sort((first, second) => second.preparedAt.localeCompare(first.preparedAt))[0]
}

export function getReaderHistorySummaries() {
  const readers = readEarlyReaders().rows
  const history = readSendLog()

  return readers.map((reader) => {
    const records = history
      .filter(
        (row) =>
          row.inviteMode !== "live_test" &&
          (row.readerId === reader.readerId || row.email === reader.email)
      )
      .sort((first, second) => {
        const firstDate = first.sentAt || first.preparedAt
        const secondDate = second.sentAt || second.preparedAt
        return secondDate.localeCompare(firstDate)
      })
    const last = records[0]

    return {
      reader,
      sendCount: records.filter((row) => row.status === "sent" && row.inviteMode !== "live_test")
        .length,
      lastTitle: last?.chapterTitle || "—",
      lastVersion: last?.chapterVersion || last?.packVersion || "—",
      lastSentDate: last?.sentAt ? last.sentAt.slice(0, 10) : "—",
      records,
    } satisfies ReaderHistorySummary
  })
}

export function getTestHistory() {
  return readSendLog()
    .filter((row) => row.inviteMode === "live_test")
    .sort((first, second) => {
      const firstDate = first.sentAt || first.preparedAt
      const secondDate = second.sentAt || second.preparedAt
      return secondDate.localeCompare(firstDate)
    })
}

export function generateMailMergeCsv(input: GenerateMailMergeInput) {
  const inviteMode = normalizeInviteMode(input.inviteMode)
  const resolvedSelection = resolveSelection(input.selection)

  if (!resolvedSelection) {
    throw new Error("Selected reader-room chapter or pack is unavailable.")
  }

  if ((inviteMode === "live_test" || inviteMode === "live_batch") && !input.liveAccessConfirmed) {
    throw new Error("Live invitation generation requires confirmation.")
  }

  if (inviteMode === "live_batch" && !input.reviewedRecipientsConfirmed) {
    throw new Error("Live batch generation requires reader and version review.")
  }

  if (inviteMode === "live_test" && (!input.testRecipientFirstName || !input.testRecipientEmail)) {
    throw new Error("Live test generation requires a test recipient.")
  }

  const { baseUrl, secret } = getSigningConfig(inviteMode)
  const exp = createInviteExpiration()
  const batchId = randomBytes(8).toString("hex")
  const preparedAt = new Date().toISOString()
  const expiresAt = new Date(exp)
  const inviteExpiresAt = expiresAt.toISOString()
  const sendLogRows: SendLogRow[] = []
  const recipients =
    inviteMode === "live_test"
      ? [
          {
            readerId: "test-recipient",
            firstName: input.testRecipientFirstName ?? "",
            lastName: "",
            email: input.testRecipientEmail ?? "",
            notes: "Live test invitation",
            status: "active",
          },
        ]
      : getEligibleEarlyReaders()

  const rows = recipients.map((reader) => {
    const token = signInviteTokenWithSecret(
      {
      readerId: reader.readerId,
      chapters: resolvedSelection.chapters,
      pack: resolvedSelection.pack,
      exp,
      },
      secret
    )

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
        inviteMode,
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
  const outputPath = inviteMode === "live_test" ? privateLiveTestCsvPath : privateMailMergeCsvPath
  writeFileSync(outputPath, toCsv(rows), "utf8")
  migrateSendLogIfNeeded()

  if (sendLogRows.length > 0) {
    appendFileSync(
      privateSendLogCsvPath,
      sendLogRows.map(sendLogRowToCsv).join("\n") + "\n",
      "utf8"
    )
  }

  return {
    batchId,
    inviteMode,
    rows,
    expiresAt,
    outputPath,
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

export function hasGeneratedLiveTestCsv() {
  return existsSync(privateLiveTestCsvPath)
}
