import "server-only"

import { del, list, put } from "@vercel/blob"
import { getReaderRoomBlobToken, readerRoomPrefix } from "@/lib/readerRoomConfig"
import type {
  ReaderRoomBookManifest,
  ReaderRoomChapter,
  ReaderRoomFeedbackRecord,
  ReaderRoomInvite,
  ReaderRoomProgress,
  ReaderRoomReader,
} from "@/lib/readerRoomTypes"

type JsonValue = Record<string, unknown> | unknown[]

const memoryStore = new Map<string, JsonValue>()

export class ReaderRoomStorageError extends Error {
  constructor(message: string) {
    super(message)
    this.name = "ReaderRoomStorageError"
  }
}

function shouldUseMemoryStore() {
  return process.env.READER_ROOM_STORAGE_MODE === "memory"
}

function requireBlobToken() {
  const token = getReaderRoomBlobToken()

  if (!token) {
    throw new ReaderRoomStorageError("Reader Room storage is not configured.")
  }

  return token
}

async function getBlobDownloadUrl(pathname: string) {
  const token = requireBlobToken()
  const result = await list({ prefix: pathname, token, limit: 1000 })
  const match = result.blobs.find((blob) => blob.pathname === pathname)

  return match?.downloadUrl || match?.url
}

async function readJson<T>(pathname: string) {
  if (shouldUseMemoryStore()) {
    return memoryStore.get(pathname) as T | undefined
  }

  const token = requireBlobToken()
  const url = await getBlobDownloadUrl(pathname)

  if (!url) {
    return undefined
  }

  const response = await fetch(url, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
    cache: "no-store",
  })

  if (!response.ok) {
    return undefined
  }

  return response.json() as Promise<T>
}

async function writeJson<T extends JsonValue>(pathname: string, value: T) {
  if (shouldUseMemoryStore()) {
    memoryStore.set(pathname, value)
    return
  }

  const token = requireBlobToken()
  await put(pathname, JSON.stringify(value, null, 2), {
    access: "private",
    addRandomSuffix: false,
    allowOverwrite: true,
    contentType: "application/json",
    token,
  })
}

async function listJson<T>(prefix: string) {
  if (shouldUseMemoryStore()) {
    return Array.from(memoryStore.entries())
      .filter(([pathname]) => pathname.startsWith(prefix))
      .map(([, value]) => value as T)
  }

  const token = requireBlobToken()
  const result = await list({ prefix, token, limit: 1000 })
  const records: T[] = []

  for (const blob of result.blobs) {
    const url = blob.downloadUrl || blob.url

    if (!url) {
      continue
    }

    const response = await fetch(url, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
      cache: "no-store",
    })

    if (response.ok) {
      records.push((await response.json()) as T)
    }
  }

  return records
}

export function readerRoomPaths(version: string) {
  const prefix = readerRoomPrefix(version)

  return {
    manifest: `${prefix}/manifest.json`,
    chapter: (slug: string) => `${prefix}/${slug}.json`,
    reader: (readerId: string) => `${prefix}/readers/${readerId}.json`,
    readersPrefix: `${prefix}/readers/`,
    invite: (tokenHash: string) => `${prefix}/invites/${tokenHash}.json`,
    invitesPrefix: `${prefix}/invites/`,
    feedback: (readerId: string) => `${prefix}/feedback/${readerId}.json`,
    feedbackPrefix: `${prefix}/feedback/`,
    progress: (readerId: string) => `${prefix}/progress/${readerId}.json`,
    progressPrefix: `${prefix}/progress/`,
  }
}

export async function getReaderRoomManifest(version: string) {
  return readJson<ReaderRoomBookManifest>(readerRoomPaths(version).manifest)
}

export async function saveReaderRoomManifest(manifest: ReaderRoomBookManifest) {
  await writeJson(readerRoomPaths(manifest.version).manifest, manifest)
}

export async function getReaderRoomChapter(version: string, slug: string) {
  return readJson<ReaderRoomChapter>(readerRoomPaths(version).chapter(slug))
}

export async function saveReaderRoomChapter(version: string, chapter: ReaderRoomChapter) {
  await writeJson(readerRoomPaths(version).chapter(chapter.slug), chapter)
}

export async function getReaderRoomReader(version: string, readerId: string) {
  return readJson<ReaderRoomReader>(readerRoomPaths(version).reader(readerId))
}

export async function saveReaderRoomReader(reader: ReaderRoomReader) {
  await writeJson(readerRoomPaths(reader.bookVersion).reader(reader.readerId), reader)
}

export async function listReaderRoomReaders(version: string) {
  return listJson<ReaderRoomReader>(readerRoomPaths(version).readersPrefix)
}

export async function getReaderRoomInvite(version: string, tokenHash: string) {
  return readJson<ReaderRoomInvite>(readerRoomPaths(version).invite(tokenHash))
}

export async function saveReaderRoomInvite(invite: ReaderRoomInvite) {
  await writeJson(readerRoomPaths(invite.bookVersion).invite(invite.tokenHash), invite)
}

export async function listReaderRoomInvites(version: string) {
  return listJson<ReaderRoomInvite>(readerRoomPaths(version).invitesPrefix)
}

export async function getReaderRoomProgress(version: string, readerId: string) {
  return readJson<ReaderRoomProgress>(readerRoomPaths(version).progress(readerId))
}

export async function saveReaderRoomProgress(progress: ReaderRoomProgress) {
  await writeJson(readerRoomPaths(progress.bookVersion).progress(progress.readerId), progress)
}

export async function getReaderRoomFeedback(version: string, readerId: string) {
  return readJson<ReaderRoomFeedbackRecord>(readerRoomPaths(version).feedback(readerId))
}

export async function saveReaderRoomFeedback(version: string, feedback: ReaderRoomFeedbackRecord) {
  await writeJson(readerRoomPaths(version).feedback(feedback.readerId), feedback)
}

export async function listReaderRoomFeedback(version: string) {
  return listJson<ReaderRoomFeedbackRecord>(readerRoomPaths(version).feedbackPrefix)
}

export async function deleteReaderRoomRecord(pathname: string) {
  if (shouldUseMemoryStore()) {
    memoryStore.delete(pathname)
    return
  }

  await del(pathname, { token: requireBlobToken() })
}

export function clearReaderRoomMemoryStore() {
  memoryStore.clear()
}
