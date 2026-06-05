import {
  argValue,
  baseUrl,
  bookVersion,
  createNonce,
  createReaderId,
  createToken,
  prefix,
  putJson,
  tokenHash,
} from "./common.mjs"

const displayName = argValue("--name")
const email = argValue("--email")?.replace(/^mailto:/, "")
const expires = argValue("--expires")

if (!displayName || !email || !expires) {
  throw new Error('Usage: npm run reader-room:create-invite -- --name "Reader One" --email "reader@example.com" --expires "2026-08-31"')
}

const version = bookVersion()
const createdAt = new Date().toISOString()
const expiresAt = new Date(expires).toISOString()
const token = createToken()
const readerId = createReaderId()
const reader = {
  readerId,
  displayName,
  email,
  bookId: "hold-the-earth",
  bookVersion: version,
  createdAt,
  expiresAt,
  revoked: false,
  nonce: createNonce(),
}
const invite = {
  tokenHash: tokenHash(token),
  readerId,
  displayName,
  email,
  bookId: "hold-the-earth",
  bookVersion: version,
  createdAt,
  expiresAt,
  revoked: false,
}

await putJson(`${prefix(version)}/readers/${readerId}.json`, reader)
await putJson(`${prefix(version)}/progress/${readerId}.json`, {
  readerId,
  bookVersion: version,
  openedSlugs: [],
  completedSlugs: [],
})
await putJson(`${prefix(version)}/feedback/${readerId}.json`, { readerId, entries: [] })
await putJson(`${prefix(version)}/invites/${invite.tokenHash}.json`, invite)

console.log(`Reader: ${displayName}`)
console.log(`Expiration: ${expiresAt}`)
console.log(`Invitation URL: ${baseUrl()}/invite/${token}`)
console.log("This invitation URL is shown only once. The raw token was not stored.")
