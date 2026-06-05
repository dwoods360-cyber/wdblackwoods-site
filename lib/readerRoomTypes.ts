export type ReaderRoomBookManifest = {
  bookId: string
  title: string
  volume: string
  author: string
  version: string
  updatedAt: string
  sections: ReaderRoomSectionSummary[]
}

export type ReaderRoomSectionSummary = {
  slug: string
  title: string
  label: string
  order: number
  kind: "foreword" | "prologue" | "chapter"
  checkpoint?: "chapter-03" | "chapter-07" | "chapter-20"
}

export type ReaderRoomChapter = ReaderRoomSectionSummary & {
  html: string
}

export type ReaderRoomInvite = {
  tokenHash: string
  readerId: string
  displayName: string
  email: string
  bookId: string
  bookVersion: string
  createdAt: string
  expiresAt: string
  revoked: boolean
  redeemedAt?: string
}

export type ReaderRoomReader = {
  readerId: string
  displayName: string
  email: string
  bookId: string
  bookVersion: string
  createdAt: string
  expiresAt: string
  revoked: boolean
  redeemedAt?: string
  lastOpenedSlug?: string
  lastActivityAt?: string
  nonce: string
}

export type ReaderRoomProgress = {
  readerId: string
  bookVersion: string
  openedSlugs: string[]
  completedSlugs: string[]
  lastOpenedSlug?: string
  lastActivityAt?: string
}

export type ReaderRoomFeedbackEntry = {
  id: string
  readerId: string
  bookVersion: string
  slug?: string
  checkpoint?: "chapter-03" | "chapter-07" | "chapter-20"
  answers?: Record<string, string>
  note?: string
  createdAt: string
}

export type ReaderRoomFeedbackRecord = {
  readerId: string
  entries: ReaderRoomFeedbackEntry[]
}

export type ReaderRoomSessionClaims = {
  readerId: string
  bookVersion: string
  nonce: string
  iat: number
  exp: number
}

export type ReaderRoomAdminSummary = {
  readers: Array<{
    reader: ReaderRoomReader
    progress: ReaderRoomProgress
    feedback: ReaderRoomFeedbackRecord
  }>
  invites: ReaderRoomInvite[]
}
