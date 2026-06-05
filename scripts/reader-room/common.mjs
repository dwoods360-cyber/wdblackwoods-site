import { createHash, randomBytes, createHmac } from "node:crypto"
import { readFile } from "node:fs/promises"
import { list, put } from "@vercel/blob"

export const bookId = "hold-the-earth"

export function argValue(name) {
  const index = process.argv.indexOf(name)
  return index >= 0 ? process.argv[index + 1] : undefined
}

export function requireEnv(name) {
  const value = process.env[name]
  if (!value) {
    throw new Error(`${name} is required.`)
  }
  return value
}

export function bookVersion() {
  return process.env.READER_ROOM_BOOK_VERSION || argValue("--version") || "draft-3"
}

export function prefix(version = bookVersion()) {
  return `reader-room/books/${bookId}/${version}`
}

export function tokenHash(token) {
  return createHash("sha256").update(token).digest("hex")
}

export function createToken() {
  return randomBytes(32).toString("base64url")
}

export function createReaderId() {
  return `reader-${randomBytes(10).toString("hex")}`
}

export function createNonce() {
  return randomBytes(16).toString("base64url")
}

export function baseUrl() {
  return (process.env.READER_ROOM_PUBLIC_BASE_URL || "https://readers.whatcoffeedemands.com").replace(/\/$/, "")
}

export async function putJson(pathname, value) {
  await put(pathname, JSON.stringify(value, null, 2), {
    access: "private",
    addRandomSuffix: false,
    allowOverwrite: true,
    contentType: "application/json",
    token: requireEnv("BLOB_READ_WRITE_TOKEN"),
  })
}

export async function fetchJson(pathname) {
  const token = requireEnv("BLOB_READ_WRITE_TOKEN")
  const result = await list({ prefix: pathname, limit: 1000, token })
  const match = result.blobs.find((blob) => blob.pathname === pathname)
  const url = match?.downloadUrl || match?.url

  if (!url) {
    return undefined
  }

  const response = await fetch(url, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  })

  return response.ok ? response.json() : undefined
}

export async function listJson(prefixPath) {
  const token = requireEnv("BLOB_READ_WRITE_TOKEN")
  const result = await list({ prefix: prefixPath, limit: 1000, token })
  const records = []

  for (const blob of result.blobs) {
    const url = blob.downloadUrl || blob.url
    const response = await fetch(url, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })

    if (response.ok) {
      records.push(await response.json())
    }
  }

  return records
}

export async function loadDocxBuffer(input) {
  if (!input || !input.startsWith("/")) {
    throw new Error("Use an absolute --input path outside the repository.")
  }

  return readFile(input)
}

export async function loadHtmlForTest(input) {
  if (!input || !input.startsWith("/")) {
    throw new Error("Use an absolute --input-html path.")
  }

  return readFile(input, "utf8")
}

export function signSessionForTest(payload, secret) {
  const encoded = Buffer.from(JSON.stringify(payload)).toString("base64url")
  const signature = createHmac("sha256", secret)
    .update(`wdblackwoods:reader-room-session:v1:${encoded}`)
    .digest("base64url")

  return `${encoded}.${signature}`
}
