import { NextResponse } from "next/server"
import { readerRoomCookieName } from "@/lib/readerRoomConfig"
import { readerRoomRedirectPathForHost } from "@/lib/readerRoomLinks"

export const dynamic = "force-dynamic"

export async function POST(request: Request) {
  const response = NextResponse.redirect(new URL(readerRoomRedirectPathForHost(request.headers.get("host"), "/reader-room"), request.url), {
    status: 303,
    headers: {
      "Cache-Control": "no-store, private",
      Pragma: "no-cache",
      "X-Robots-Tag": "noindex, nofollow, noarchive",
    },
  })
  response.cookies.set(readerRoomCookieName, "", {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: 0,
  })

  return response
}
