import { readdir, readFile } from "node:fs/promises"
import { join } from "node:path"

const requiredFiles = [
  "app/reader-room/page.tsx",
  "app/reader-room/invite/[token]/page.tsx",
  "app/reader-room/read/[slug]/page.tsx",
  "app/reader-room/checkpoint/[checkpoint]/page.tsx",
  "app/reader-room/logout/page.tsx",
  "app/api/reader-room/redeem/route.ts",
  "app/api/reader-room/logout/route.ts",
  "app/api/reader-room/chapter/[slug]/route.ts",
  "app/api/reader-room/progress/route.ts",
  "app/api/reader-room/feedback/route.ts",
  "lib/readerRoomAccess.ts",
  "lib/readerRoomStorage.ts",
  "scripts/reader-room/upload.mjs",
  "proxy.ts",
  "lib/readerRoomHost.ts",
  "scripts/reader-room/parse-manuscript.mjs",
]

for (const file of requiredFiles) {
  await readFile(file, "utf8")
}

const envExample = await readFile(".env.example", "utf8")
for (const key of ["BLOB_READ_WRITE_TOKEN=", "READER_ROOM_SIGNING_SECRET=", "READER_ROOM_BOOK_VERSION=", "READER_ROOM_PUBLIC_BASE_URL="]) {
  if (!envExample.includes(key)) {
    throw new Error(`Missing ${key} in .env.example`)
  }
}

async function collectFiles(dir) {
  const entries = await readdir(dir, { withFileTypes: true }).catch(() => [])
  const files = []

  for (const entry of entries) {
    const path = join(dir, entry.name)
    if (entry.isDirectory()) {
      files.push(...(await collectFiles(path)))
    } else {
      files.push(path)
    }
  }

  return files
}

const publicFiles = await collectFiles("public")
if (publicFiles.some((file) => /manuscript|hold[-_]the[-_]earth|coffee[-_]demands/i.test(file))) {
  throw new Error("Possible manuscript file found under public/.")
}

const sourceFiles = await collectFiles("app")
for (const file of sourceFiles) {
  const text = await readFile(file, "utf8")
  if (/https:\/\/[^"']*blob\.vercel-storage\.com/.test(text)) {
    throw new Error(`Direct Blob URL found in ${file}`)
  }
}

console.log("Reader-room validation passed.")
