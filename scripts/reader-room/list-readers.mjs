import { bookVersion, listJson, prefix } from "./common.mjs"

const version = bookVersion()
const readers = await listJson(`${prefix(version)}/readers/`)

if (readers.length === 0) {
  console.log("No reader records found.")
} else {
  for (const reader of readers) {
    console.log(
      `${reader.readerId}\t${reader.displayName}\t${reader.email}\t${reader.revoked ? "revoked" : "active"}\t${reader.lastOpenedSlug || "not-opened"}`
    )
  }
}
