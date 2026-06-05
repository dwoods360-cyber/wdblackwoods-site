import { NextResponse } from "next/server"
import { hasReaderIntelligenceAccess } from "@/lib/readerIntelligenceAccess"
import { revokeReaderRoomReader } from "@/lib/readerRoomAccess"

export const dynamic = "force-dynamic"

export async function POST(request: Request) {
  if (!(await hasReaderIntelligenceAccess())) {
    return new NextResponse("Not found.", { status: 404 })
  }

  const formData = await request.formData()
  const readerId = formData.get("readerId")

  if (typeof readerId === "string") {
    await revokeReaderRoomReader(readerId)
  }

  return NextResponse.redirect(new URL("/system/reader-intelligence", request.url), {
    status: 303,
    headers: { "Cache-Control": "no-store, private" },
  })
}
