export const readerRoomHost = "readers.whatcoffeedemands.com"

export function isReaderRoomHost(host: string | null | undefined) {
  return (host || "").split(":")[0].toLowerCase() === readerRoomHost
}

export function internalReaderRoomPath(pathname: string) {
  if (pathname === "/") {
    return "/reader-room"
  }

  if (
    pathname.startsWith("/invite/") ||
    pathname.startsWith("/read/") ||
    pathname.startsWith("/checkpoint/") ||
    pathname === "/logout"
  ) {
    return `/reader-room${pathname}`
  }

  return pathname
}

export function cleanReaderRoomPath(pathname: string) {
  if (pathname === "/reader-room") {
    return "/"
  }

  if (pathname.startsWith("/reader-room/invite/")) {
    return pathname.replace("/reader-room/invite", "/invite")
  }

  if (pathname.startsWith("/reader-room/read/")) {
    return pathname.replace("/reader-room/read", "/read")
  }

  if (pathname.startsWith("/reader-room/checkpoint/")) {
    return pathname.replace("/reader-room/checkpoint", "/checkpoint")
  }

  if (pathname === "/reader-room/logout") {
    return "/logout"
  }

  return pathname
}
