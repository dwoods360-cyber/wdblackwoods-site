import { NextResponse } from "next/server"
import { hasReaderIntelligenceAccess } from "@/lib/readerIntelligenceAccess"
import { createReaderRoomInvite } from "@/lib/readerRoomAccess"
import { getReaderRoomBaseUrl } from "@/lib/readerRoomConfig"

export const dynamic = "force-dynamic"

function escapeHtml(value: string) {
  return value
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
}

export async function POST(request: Request) {
  if (!(await hasReaderIntelligenceAccess())) {
    return new NextResponse("Not found.", { status: 404 })
  }

  const formData = await request.formData()
  const displayName = formData.get("displayName")
  const email = formData.get("email")
  const expiresAt = formData.get("expiresAt")

  if (typeof displayName !== "string" || typeof email !== "string") {
    return new NextResponse("Missing reader details.", { status: 400 })
  }

  const { token, reader } = await createReaderRoomInvite({
    displayName: displayName.trim(),
    email: email.trim(),
    expiresAt: typeof expiresAt === "string" && expiresAt ? new Date(expiresAt).toISOString() : undefined,
  })
  const inviteUrl = `${getReaderRoomBaseUrl().replace(/\/$/, "")}/invite/${token}`

  return new NextResponse(
    `<!doctype html><html lang="en"><head><meta name="robots" content="noindex,nofollow"><title>Reader invitation created</title></head><body><main><p>Invitation created for ${escapeHtml(reader.displayName)}.</p><p>This URL is shown only once.</p><textarea id="invite-url" rows="4" cols="80" readonly>${escapeHtml(inviteUrl)}</textarea><p><button type="button" onclick="navigator.clipboard.writeText(document.getElementById('invite-url').value)">Copy invitation URL</button></p><p><a href="/system/reader-intelligence">Return to Reader Intelligence</a></p></main></body></html>`,
    {
      headers: {
        "Cache-Control": "no-store, private",
        "Content-Type": "text/html; charset=utf-8",
        "X-Robots-Tag": "noindex, nofollow, noarchive",
      },
    }
  )
}
