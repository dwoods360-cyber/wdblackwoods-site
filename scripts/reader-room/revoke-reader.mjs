import { argValue, bookVersion, fetchJson, listJson, prefix, putJson } from "./common.mjs"

const readerId = argValue("--reader-id")

if (!readerId) {
  throw new Error('Usage: npm run reader-room:revoke-reader -- --reader-id "<reader-id>"')
}

const version = bookVersion()
const readerPath = `${prefix(version)}/readers/${readerId}.json`
const reader = await fetchJson(readerPath)

if (!reader) {
  throw new Error("Reader not found.")
}

await putJson(readerPath, { ...reader, revoked: true, nonce: "revoked" })

const invites = await listJson(`${prefix(version)}/invites/`)
for (const invite of invites.filter((record) => record.readerId === readerId)) {
  await putJson(`${prefix(version)}/invites/${invite.tokenHash}.json`, {
    ...invite,
    revoked: true,
  })
}

console.log(`Revoked reader: ${readerId}`)
