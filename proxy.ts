import { NextRequest, NextResponse } from "next/server"
import { internalReaderRoomPath, isReaderRoomHost } from "@/lib/readerRoomHost"

export function proxy(request: NextRequest) {
  if (!isReaderRoomHost(request.headers.get("host"))) {
    return NextResponse.next()
  }

  const url = request.nextUrl.clone()
  const rewrittenPath = internalReaderRoomPath(url.pathname)

  if (rewrittenPath === url.pathname) {
    return NextResponse.next()
  }

  url.pathname = rewrittenPath
  return NextResponse.rewrite(url)
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico|opengraph-image|robots.txt|sitemap.xml).*)"],
}
