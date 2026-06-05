import "server-only"

import { randomUUID } from "crypto"
import { cookies } from "next/headers"
import {
  getReaderRoomBookVersion,
  getReaderRoomSigningSecret,
  readerRoomCookieMaxAge,
  readerRoomCookieName,
} from "@/lib/readerRoomConfig"
import {
  createReaderRoomNonce,
  createReaderRoomReaderId,
  createReaderRoomToken,
  hashReaderRoomToken,
  signReaderRoomSession,
  verifyReaderRoomSessionCookie,
} from "@/lib/readerRoomCrypto"
import {
  getReaderRoomFeedback,
  getReaderRoomInvite,
  getReaderRoomManifest,
  getReaderRoomProgress,
  getReaderRoomReader,
  listReaderRoomFeedback,
  listReaderRoomInvites,
  listReaderRoomReaders,
  saveReaderRoomFeedback,
  saveReaderRoomInvite,
  saveReaderRoomProgress,
  saveReaderRoomReader,
} from "@/lib/readerRoomStorage"
import type {
  ReaderRoomFeedbackEntry,
  ReaderRoomFeedbackRecord,
  ReaderRoomInvite,
  ReaderRoomProgress,
  ReaderRoomReader,
} from "@/lib/readerRoomTypes"

export type ReaderRoomAuthResult =
  | { ok: true; reader: ReaderRoomReader }
  | { ok: false; reason: "missing" | "invalid" | "expired" | "revoked" | "configuration" }

function nowIso() {
  return new Date().toISOString()
}

function addDays(days: number) {
  return new Date(Date.now() + days * 24 * 60 * 60 * 1000).toISOString()
}

function requireSigningSecret() {
  const secret = getReaderRoomSigningSecret()

  if (!secret) {
    throw new Error("READER_ROOM_SIGNING_SECRET is required.")
  }

  return secret
}

function createEmptyProgress(reader: ReaderRoomReader): ReaderRoomProgress {
  return {
    readerId: reader.readerId,
    bookVersion: reader.bookVersion,
    openedSlugs: [],
    completedSlugs: [],
  }
}

export async function createReaderRoomInvite({
  displayName,
  email,
  expiresAt,
}: {
  displayName: string
  email: string
  expiresAt?: string
}) {
  const bookVersion = getReaderRoomBookVersion()
  const token = createReaderRoomToken()
  const tokenHash = hashReaderRoomToken(token)
  const readerId = createReaderRoomReaderId()
  const createdAt = nowIso()
  const expiration = expiresAt || addDays(30)
  const reader: ReaderRoomReader = {
    readerId,
    displayName,
    email,
    bookId: "hold-the-earth",
    bookVersion,
    createdAt,
    expiresAt: expiration,
    revoked: false,
    nonce: createReaderRoomNonce(),
  }
  const invite: ReaderRoomInvite = {
    tokenHash,
    readerId,
    displayName,
    email,
    bookId: reader.bookId,
    bookVersion,
    createdAt,
    expiresAt: expiration,
    revoked: false,
  }

  await saveReaderRoomReader(reader)
  await saveReaderRoomProgress(createEmptyProgress(reader))
  await saveReaderRoomFeedback(bookVersion, { readerId, entries: [] })
  await saveReaderRoomInvite(invite)

  return {
    reader,
    invite,
    token,
  }
}

export async function inspectReaderRoomInvite(token: string) {
  const bookVersion = getReaderRoomBookVersion()
  const invite = await getReaderRoomInvite(bookVersion, hashReaderRoomToken(token))

  if (!invite || invite.revoked || new Date(invite.expiresAt).getTime() <= Date.now()) {
    return undefined
  }

  return invite
}

export async function redeemReaderRoomInvite(token: string) {
  const bookVersion = getReaderRoomBookVersion()
  const tokenHash = hashReaderRoomToken(token)
  const invite = await getReaderRoomInvite(bookVersion, tokenHash)

  if (!invite || invite.revoked || new Date(invite.expiresAt).getTime() <= Date.now()) {
    return undefined
  }

  const reader = await getReaderRoomReader(bookVersion, invite.readerId)

  if (!reader || reader.revoked || new Date(reader.expiresAt).getTime() <= Date.now()) {
    return undefined
  }

  const redeemedAt = nowIso()
  const updatedReader = {
    ...reader,
    redeemedAt: reader.redeemedAt || redeemedAt,
    nonce: createReaderRoomNonce(),
    lastActivityAt: redeemedAt,
  }
  const updatedInvite = {
    ...invite,
    redeemedAt: invite.redeemedAt || redeemedAt,
  }

  await saveReaderRoomReader(updatedReader)
  await saveReaderRoomInvite(updatedInvite)

  return updatedReader
}

export function createReaderRoomSessionCookie(reader: ReaderRoomReader) {
  const issuedAt = Date.now()
  return signReaderRoomSession(
    {
      readerId: reader.readerId,
      bookVersion: reader.bookVersion,
      nonce: reader.nonce,
      iat: issuedAt,
      exp: issuedAt + readerRoomCookieMaxAge * 1000,
    },
    requireSigningSecret()
  )
}

export async function getReaderRoomSession(): Promise<ReaderRoomAuthResult> {
  const secret = getReaderRoomSigningSecret()

  if (!secret) {
    return { ok: false, reason: "configuration" }
  }

  const cookieStore = await cookies()
  const cookie = cookieStore.get(readerRoomCookieName)

  if (!cookie?.value) {
    return { ok: false, reason: "missing" }
  }

  const claims = verifyReaderRoomSessionCookie(cookie.value, secret)

  if (!claims) {
    return { ok: false, reason: "invalid" }
  }

  const reader = await getReaderRoomReader(claims.bookVersion, claims.readerId)

  if (!reader || reader.nonce !== claims.nonce) {
    return { ok: false, reason: "invalid" }
  }

  if (reader.revoked) {
    return { ok: false, reason: "revoked" }
  }

  if (new Date(reader.expiresAt).getTime() <= Date.now()) {
    return { ok: false, reason: "expired" }
  }

  return { ok: true, reader }
}

export async function recordReaderRoomOpen(reader: ReaderRoomReader, slug: string) {
  const progress = (await getReaderRoomProgress(reader.bookVersion, reader.readerId)) || createEmptyProgress(reader)
  const openedSlugs = Array.from(new Set([...progress.openedSlugs, slug]))
  const lastActivityAt = nowIso()

  await saveReaderRoomProgress({
    ...progress,
    openedSlugs,
    lastOpenedSlug: slug,
    lastActivityAt,
  })
  await saveReaderRoomReader({
    ...reader,
    lastOpenedSlug: slug,
    lastActivityAt,
  })
}

export async function markReaderRoomChapterComplete(reader: ReaderRoomReader, slug: string) {
  const progress = (await getReaderRoomProgress(reader.bookVersion, reader.readerId)) || createEmptyProgress(reader)
  const openedSlugs = Array.from(new Set([...progress.openedSlugs, slug]))
  const completedSlugs = Array.from(new Set([...progress.completedSlugs, slug]))
  const lastActivityAt = nowIso()

  await saveReaderRoomProgress({
    ...progress,
    openedSlugs,
    completedSlugs,
    lastOpenedSlug: slug,
    lastActivityAt,
  })
}

export async function saveReaderRoomNote(
  reader: ReaderRoomReader,
  entry: Omit<ReaderRoomFeedbackEntry, "id" | "readerId" | "bookVersion" | "createdAt">
) {
  const current =
    (await getReaderRoomFeedback(reader.bookVersion, reader.readerId)) ||
    ({ readerId: reader.readerId, entries: [] } satisfies ReaderRoomFeedbackRecord)

  current.entries.push({
    ...entry,
    id: randomUUID(),
    readerId: reader.readerId,
    bookVersion: reader.bookVersion,
    createdAt: nowIso(),
  })

  await saveReaderRoomFeedback(reader.bookVersion, current)
}

export async function getReaderRoomProgressSummary(reader: ReaderRoomReader) {
  const manifest = await getReaderRoomManifest(reader.bookVersion)
  const progress = (await getReaderRoomProgress(reader.bookVersion, reader.readerId)) || createEmptyProgress(reader)
  const total = manifest?.sections.length || 0
  const complete = progress.completedSlugs.length

  return {
    progress,
    percentComplete: total > 0 ? Math.round((complete / total) * 100) : 0,
  }
}

export async function revokeReaderRoomReader(readerId: string) {
  const bookVersion = getReaderRoomBookVersion()
  const reader = await getReaderRoomReader(bookVersion, readerId)

  if (!reader) {
    return false
  }

  await saveReaderRoomReader({
    ...reader,
    revoked: true,
    nonce: createReaderRoomNonce(),
  })

  const invites = await listReaderRoomInvites(bookVersion)
  await Promise.all(
    invites
      .filter((invite) => invite.readerId === readerId)
      .map((invite) => saveReaderRoomInvite({ ...invite, revoked: true }))
  )

  return true
}

export async function getReaderRoomAdminSummary() {
  const bookVersion = getReaderRoomBookVersion()
  const readers = await listReaderRoomReaders(bookVersion)
  const invites = await listReaderRoomInvites(bookVersion)
  const feedback = await listReaderRoomFeedback(bookVersion)

  return {
    readers: await Promise.all(
      readers.map(async (reader) => ({
        reader,
        progress: (await getReaderRoomProgress(bookVersion, reader.readerId)) || createEmptyProgress(reader),
        feedback:
          feedback.find((record) => record.readerId === reader.readerId) ||
          ({ readerId: reader.readerId, entries: [] } satisfies ReaderRoomFeedbackRecord),
      }))
    ),
    invites,
  }
}
