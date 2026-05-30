import "server-only"

import { createHmac, randomBytes, timingSafeEqual } from "crypto"
import { cookies } from "next/headers"
import {
  getEnabledReaderChapters,
  getReaderChapter,
  getReaderChapterPack,
} from "@/content/reader-room/manifest"

export type EarlyReaderPayload = {
  readerId: string
  chapters?: string[]
  pack?: string
  exp: number
  scope?: "reader-room"
}

export type AuthorizedReader = {
  readerId: string
  chapters: string[]
  pack?: string
  exp: number
}

export const earlyReaderCookieName = "wd_early_reader"
export const defaultInviteDays = 30

function getSecret() {
  return process.env.EARLY_READER_INVITE_SECRET
}

function base64url(input: Buffer | string) {
  return Buffer.from(input).toString("base64url")
}

function sign(value: string, secret: string) {
  return createHmac("sha256", secret).update(value).digest("base64url")
}

function verifySignature(value: string, signature: string, secret: string) {
  const expected = sign(value, secret)
  const expectedBuffer = Buffer.from(expected)
  const signatureBuffer = Buffer.from(signature)

  if (expectedBuffer.length !== signatureBuffer.length) {
    return false
  }

  return timingSafeEqual(expectedBuffer, signatureBuffer)
}

function parseSignedValue(token: string) {
  const [payloadPart, signature] = token.split(".")

  if (!payloadPart || !signature) {
    return undefined
  }

  const secret = getSecret()
  if (!secret || !verifySignature(payloadPart, signature, secret)) {
    return undefined
  }

  try {
    return JSON.parse(Buffer.from(payloadPart, "base64url").toString("utf8")) as EarlyReaderPayload
  } catch {
    return undefined
  }
}

function normalizePayload(payload: EarlyReaderPayload | undefined) {
  if (!payload || typeof payload.readerId !== "string" || typeof payload.exp !== "number") {
    return undefined
  }

  if (payload.exp <= Date.now()) {
    return undefined
  }

  const chapters = Array.isArray(payload.chapters)
    ? payload.chapters.filter((slug) => typeof slug === "string" && getReaderChapter(slug))
    : []

  const pack = typeof payload.pack === "string" ? getReaderChapterPack(payload.pack) : undefined
  const packChapters = pack ? pack.chapterSlugs.filter((slug) => getReaderChapter(slug)) : []
  const authorizedChapters = Array.from(new Set([...chapters, ...packChapters]))

  if (authorizedChapters.length === 0) {
    return undefined
  }

  return {
    readerId: payload.readerId,
    chapters: authorizedChapters,
    pack: pack?.id,
    exp: payload.exp,
  } satisfies AuthorizedReader
}

export function createReaderId() {
  return randomBytes(12).toString("hex")
}

export function createInviteExpiration(days = defaultInviteDays) {
  return Date.now() + days * 24 * 60 * 60 * 1000
}

export function signInviteToken(payload: EarlyReaderPayload) {
  const secret = getSecret()
  if (!secret) {
    throw new Error("EARLY_READER_INVITE_SECRET is required to sign invites.")
  }

  const payloadPart = base64url(JSON.stringify(payload))
  return `${payloadPart}.${sign(payloadPart, secret)}`
}

export function verifyInviteToken(token: string) {
  return normalizePayload(parseSignedValue(token))
}

export function createAccessCookieValue(reader: AuthorizedReader) {
  return signInviteToken({
    readerId: reader.readerId,
    chapters: reader.chapters,
    pack: reader.pack,
    exp: reader.exp,
    scope: "reader-room",
  })
}

export async function getAuthorizedReader() {
  const cookieStore = await cookies()
  const cookie = cookieStore.get(earlyReaderCookieName)

  if (!cookie?.value) {
    return undefined
  }

  return normalizePayload(parseSignedValue(cookie.value))
}

export function isChapterAuthorized(reader: AuthorizedReader | undefined, slug: string) {
  return Boolean(reader?.chapters.includes(slug))
}

export function getAuthorizedChapters(reader: AuthorizedReader | undefined) {
  if (!reader) {
    return []
  }

  const authorized = new Set(reader.chapters)
  return getEnabledReaderChapters().filter((chapter) => authorized.has(chapter.slug))
}
