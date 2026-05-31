import { NextRequest, NextResponse } from "next/server"
import {
  createReaderIntelligenceCookie,
  readerIntelligenceCookieName,
  readerIntelligenceMaxAge,
  verifyReaderIntelligencePassphrase,
} from "@/lib/readerIntelligenceAccess"

export const dynamic = "force-dynamic"

const noStoreHeaders = {
  "Cache-Control": "no-store, private",
  Pragma: "no-cache",
  "X-Robots-Tag": "noindex, nofollow, noarchive",
}

export async function POST(request: NextRequest) {
  const formData = await request.formData()
  const passphrase = formData.get("passphrase")

  if (typeof passphrase !== "string" || !verifyReaderIntelligencePassphrase(passphrase)) {
    const redirectUrl = new URL("/system/reader-intelligence", request.url)
    redirectUrl.searchParams.set("access", "denied")
    return NextResponse.redirect(redirectUrl, {
      status: 303,
      headers: noStoreHeaders,
    })
  }

  const cookieValue = createReaderIntelligenceCookie()

  if (!cookieValue) {
    const redirectUrl = new URL("/system/reader-intelligence", request.url)
    redirectUrl.searchParams.set("access", "unconfigured")
    return NextResponse.redirect(redirectUrl, {
      status: 303,
      headers: noStoreHeaders,
    })
  }

  const response = NextResponse.redirect(new URL("/system/reader-intelligence", request.url), {
    status: 303,
    headers: noStoreHeaders,
  })

  response.cookies.set(readerIntelligenceCookieName, cookieValue, {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/system/reader-intelligence",
    maxAge: readerIntelligenceMaxAge,
  })

  return response
}
