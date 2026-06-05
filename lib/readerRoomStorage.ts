import "server-only"

import { del, get, list, put } from "@vercel/blob"
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
type StoredJson<T> = {
  value?: T
  etag?: string
}

const memoryStore = new Map<string, JsonValue>()
const memoryEtags = new Map<string, number>()

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

async function readJsonWithEtag<T>(pathname: string): Promise<StoredJson<T>> {
  if (shouldUseMemoryStore()) {
    const value = memoryStore.get(pathname) as T | undefined

    return {
      value,
      etag: value ? String(memoryEtags.get(pathname) || 0) : undefined,
    }
  }

  const token = requireBlobToken()
  const result = await get(pathname, {
    access: "private",
    token,
    useCache: false,
  })

  if (!result || result.statusCode !== 200) {
    return {}
  }

  const json = await new Response(result.stream).json()

  return {
    value: json as T,
    etag: result.blob.etag,
  }
}

async function readJson<T>(pathname: string) {
  const { value } = await readJsonWithEtag<T>(pathname)

  return value
}

async function writeJson<T extends JsonValue>(pathname: string, value: T, etag?: string) {
  if (shouldUseMemoryStore()) {
    const currentEtag = String(memoryEtags.get(pathname) || 0)

    if (etag && etag !== currentEtag) {
      throw new ReaderRoomStorageError("Reader Room record changed while saving.")
    }

    memoryStore.set(pathname, value)
    memoryEtags.set(pathname, Number(currentEtag) + 1)
    return
  }

  const token = requireBlobToken()
  const options = etag
    ? ({
        access: "private" as const,
        addRandomSuffix: false,
        allowOverwrite: true,
        contentType: "application/json",
        ifMatch: etag,
        token,
      } satisfies Parameters<typeof put>[2])
    : ({
        access: "private" as const,
        addRandomSuffix: false,
        allowOverwrite: false,
        contentType: "application/json",
        token,
      } satisfies Parameters<typeof put>[2])

  await put(pathname, JSON.stringify(value, null, 2), {
    ...options,
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

async function updateJsonRecord<T extends JsonValue>(
  pathname: string,
  createDefault: () => T,
  merge: (current: T) => T
) {
  let lastError: unknown

  for (let attempt = 0; attempt < 5; attempt += 1) {
    const current = await readJsonWithEtag<T>(pathname)
    const base = current.value || createDefault()
    const next = merge(base)

    try {
      await writeJson(pathname, next, current.etag)
      return next
    } catch (error) {
      lastError = error
    }
  }

  throw new ReaderRoomStorageError(
    lastError instanceof Error
      ? `Reader Room record could not be saved safely: ${lastError.message}`
      : "Reader Room record could not be saved safely."
  )
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

export async function updateReaderRoomReader(
  version: string,
  readerId: string,
  createDefault: () => ReaderRoomReader,
  merge: (reader: ReaderRoomReader) => ReaderRoomReader
) {
  return updateJsonRecord(readerRoomPaths(version).reader(readerId), createDefault, merge)
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

export async function updateReaderRoomInvite(
  version: string,
  tokenHash: string,
  createDefault: () => ReaderRoomInvite,
  merge: (invite: ReaderRoomInvite) => ReaderRoomInvite
) {
  return updateJsonRecord(readerRoomPaths(version).invite(tokenHash), createDefault, merge)
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

export async function updateReaderRoomProgress(
  version: string,
  readerId: string,
  createDefault: () => ReaderRoomProgress,
  merge: (progress: ReaderRoomProgress) => ReaderRoomProgress
) {
  return updateJsonRecord(readerRoomPaths(version).progress(readerId), createDefault, merge)
}

export async function getReaderRoomFeedback(version: string, readerId: string) {
  return readJson<ReaderRoomFeedbackRecord>(readerRoomPaths(version).feedback(readerId))
}

export async function saveReaderRoomFeedback(version: string, feedback: ReaderRoomFeedbackRecord) {
  await writeJson(readerRoomPaths(version).feedback(feedback.readerId), feedback)
}

export async function updateReaderRoomFeedback(
  version: string,
  readerId: string,
  createDefault: () => ReaderRoomFeedbackRecord,
  merge: (feedback: ReaderRoomFeedbackRecord) => ReaderRoomFeedbackRecord
) {
  return updateJsonRecord(readerRoomPaths(version).feedback(readerId), createDefault, merge)
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
  memoryEtags.clear()
}
