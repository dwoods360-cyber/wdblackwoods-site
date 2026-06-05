import "server-only"

import { headers } from "next/headers"
import { cleanReaderRoomPath, isReaderRoomHost } from "@/lib/readerRoomHost"

export async function readerRoomHref(internalPath: string) {
  const headerStore = await headers()

  return isReaderRoomHost(headerStore.get("host"))
    ? cleanReaderRoomPath(internalPath)
    : internalPath
}

export function readerRoomRedirectPathForHost(host: string | null, internalPath: string) {
  return isReaderRoomHost(host) ? cleanReaderRoomPath(internalPath) : internalPath
}
