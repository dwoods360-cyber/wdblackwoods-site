import { NextRequest, NextResponse } from "next/server"
import {
  createAccessCookieValue,
  earlyReaderCookieName,
  verifyInviteToken,
} from "@/lib/earlyReaderAccess"

export const dynamic = "force-dynamic"

function accessExpiredResponse() {
  return new NextResponse(
    `<!doctype html>
<html lang="en">
  <head>
    <meta name="robots" content="noindex,nofollow" />
    <title>Reading link unavailable</title>
  </head>
  <body>
    <main>
      <p>This private reading link is no longer available.</p>
    </main>
  </body>
</html>`,
    {
      status: 403,
      headers: {
        "Content-Type": "text/html; charset=utf-8",
        "X-Robots-Tag": "noindex, nofollow",
      },
    }
  )
}

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ token?: string }> }
) {
  const resolvedParams = await params
  const token = resolvedParams.token

  if (!token) {
    return accessExpiredResponse()
  }

  const reader = verifyInviteToken(token)

  if (!reader) {
    return accessExpiredResponse()
  }

  const response = NextResponse.redirect(new URL("/reader-room", request.url))
  response.cookies.set(earlyReaderCookieName, createAccessCookieValue(reader), {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/reader-room",
    expires: new Date(reader.exp),
  })

  return response
}
