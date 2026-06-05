import "server-only"

export const readerRoomBookId = "hold-the-earth"
export const readerRoomBookTitle = "WHAT COFFEE DEMANDS"
export const readerRoomVolumeTitle = "Volume One: Hold the Earth"
export const readerRoomAuthor = "W.D. Blackwoods"
export const readerRoomCookieName = "wd_reader_room"
export const readerRoomCookieMaxAge = 60 * 60 * 24 * 30

export function getReaderRoomBookVersion() {
  return process.env.READER_ROOM_BOOK_VERSION || "draft-3"
}

export function getReaderRoomSigningSecret() {
  return process.env.READER_ROOM_SIGNING_SECRET
}

export function getReaderRoomBaseUrl() {
  return process.env.READER_ROOM_PUBLIC_BASE_URL || "https://readers.whatcoffeedemands.com"
}

export function getReaderRoomBlobToken() {
  return process.env.BLOB_READ_WRITE_TOKEN
}

export function isReaderRoomConfigured() {
  return Boolean(getReaderRoomSigningSecret() && getReaderRoomBlobToken())
}

export function readerRoomPrefix(version = getReaderRoomBookVersion()) {
  return `reader-room/books/${readerRoomBookId}/${version}`
}
