import { NextRequest, NextResponse } from "next/server"
import { readerIntelligenceCookieName } from "@/lib/readerIntelligenceAccess"

export const dynamic = "force-dynamic"

export async function POST(request: NextRequest) {
  const response = NextResponse.redirect(new URL("/system/reader-intelligence", request.url), {
    status: 303,
    headers: {
      "Cache-Control": "no-store, private",
      Pragma: "no-cache",
      "X-Robots-Tag": "noindex, nofollow, noarchive",
    },
  })

  response.cookies.set(readerIntelligenceCookieName, "", {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/system/reader-intelligence",
    maxAge: 0,
  })

  return response
}
