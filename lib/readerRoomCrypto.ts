import "server-only"

import { createHash, createHmac, randomBytes, timingSafeEqual } from "crypto"
import type { ReaderRoomSessionClaims } from "@/lib/readerRoomTypes"

const sessionDomain = "wdblackwoods:reader-room-session:v1"

function base64url(input: Buffer | string) {
  return Buffer.from(input).toString("base64url")
}

function safeEqual(first: string, second: string) {
  const firstBuffer = Buffer.from(first)
  const secondBuffer = Buffer.from(second)

  if (firstBuffer.length !== secondBuffer.length) {
    return false
  }

  return timingSafeEqual(firstBuffer, secondBuffer)
}

export function createReaderRoomToken() {
  return randomBytes(32).toString("base64url")
}

export function createReaderRoomNonce() {
  return randomBytes(16).toString("base64url")
}

export function hashReaderRoomToken(token: string) {
  return createHash("sha256").update(token).digest("hex")
}

export function createReaderRoomReaderId() {
  return `reader-${randomBytes(10).toString("hex")}`
}

export function signReaderRoomSession(claims: ReaderRoomSessionClaims, secret: string) {
  const payload = base64url(JSON.stringify(claims))
  const signature = createHmac("sha256", secret)
    .update(`${sessionDomain}:${payload}`)
    .digest("base64url")

  return `${payload}.${signature}`
}

export function verifyReaderRoomSessionCookie(value: string, secret: string) {
  const [payload, signature] = value.split(".")

  if (!payload || !signature) {
    return undefined
  }

  const expected = createHmac("sha256", secret)
    .update(`${sessionDomain}:${payload}`)
    .digest("base64url")

  if (!safeEqual(signature, expected)) {
    return undefined
  }

  try {
    const claims = JSON.parse(Buffer.from(payload, "base64url").toString("utf8")) as ReaderRoomSessionClaims

    if (
      typeof claims.readerId !== "string" ||
      typeof claims.bookVersion !== "string" ||
      typeof claims.nonce !== "string" ||
      typeof claims.iat !== "number" ||
      typeof claims.exp !== "number" ||
      claims.exp <= Date.now()
    ) {
      return undefined
    }

    return claims
  } catch {
    return undefined
  }
}
