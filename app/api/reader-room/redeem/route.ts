import { NextRequest, NextResponse } from "next/server"
import {
  createReaderRoomSessionCookie,
  redeemReaderRoomInvite,
} from "@/lib/readerRoomAccess"
import { readerRoomCookieMaxAge, readerRoomCookieName } from "@/lib/readerRoomConfig"
import { readerRoomRedirectPathForHost } from "@/lib/readerRoomLinks"

export const dynamic = "force-dynamic"

const privateHeaders = {
  "Cache-Control": "no-store, private",
  Pragma: "no-cache",
  "X-Robots-Tag": "noindex, nofollow, noarchive",
}

function unavailable() {
  return new NextResponse("This private reading invitation is unavailable.", {
    status: 403,
    headers: privateHeaders,
  })
}

export async function POST(request: NextRequest) {
  const formData = await request.formData()
  const token = formData.get("token")

  if (typeof token !== "string" || token.length < 24) {
    return unavailable()
  }

  const reader = await redeemReaderRoomInvite(token)

  if (!reader) {
    return unavailable()
  }

  const response = NextResponse.redirect(new URL(readerRoomRedirectPathForHost(request.headers.get("host"), "/reader-room"), request.url), {
    status: 303,
    headers: privateHeaders,
  })
  response.cookies.set(readerRoomCookieName, createReaderRoomSessionCookie(reader), {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: readerRoomCookieMaxAge,
  })

  return response
}
