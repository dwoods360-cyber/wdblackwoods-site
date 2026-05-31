import "server-only"

import { createHmac, timingSafeEqual } from "crypto"
import { cookies } from "next/headers"

export const readerIntelligenceCookieName = "wd_reader_intelligence"
export const readerIntelligenceMaxAge = 60 * 60 * 8

const domainSeparator = "wdblackwoods:reader-intelligence-access:v1"

function getAccessSecret() {
  return process.env.READER_INTELLIGENCE_ACCESS_SECRET
}

function sign(value: string, secret: string) {
  return createHmac("sha256", secret)
    .update(`${domainSeparator}:${value}`)
    .digest("base64url")
}

function timingSafeStringEqual(first: string, second: string) {
  const firstBuffer = Buffer.from(first)
  const secondBuffer = Buffer.from(second)

  if (firstBuffer.length !== secondBuffer.length) {
    return false
  }

  return timingSafeEqual(firstBuffer, secondBuffer)
}

function createCookieValue(secret: string) {
  const issuedAt = Date.now().toString()
  return `${issuedAt}.${sign(issuedAt, secret)}`
}

function verifyCookieValue(value: string, secret: string) {
  const [issuedAt, signature] = value.split(".")

  if (!issuedAt || !signature) {
    return false
  }

  const issuedAtNumber = Number(issuedAt)

  if (!Number.isFinite(issuedAtNumber)) {
    return false
  }

  if (Date.now() - issuedAtNumber > readerIntelligenceMaxAge * 1000) {
    return false
  }

  return timingSafeStringEqual(signature, sign(issuedAt, secret))
}

export function isReaderIntelligenceConfigured() {
  return Boolean(getAccessSecret())
}

export function verifyReaderIntelligencePassphrase(value: string) {
  const secret = getAccessSecret()

  if (!secret) {
    return false
  }

  return timingSafeStringEqual(value, secret)
}

export async function hasReaderIntelligenceAccess() {
  const secret = getAccessSecret()

  if (!secret) {
    return false
  }

  const cookieStore = await cookies()
  const cookie = cookieStore.get(readerIntelligenceCookieName)

  if (!cookie?.value) {
    return false
  }

  return verifyCookieValue(cookie.value, secret)
}

export function createReaderIntelligenceCookie() {
  const secret = getAccessSecret()

  if (!secret) {
    return undefined
  }

  return createCookieValue(secret)
}
