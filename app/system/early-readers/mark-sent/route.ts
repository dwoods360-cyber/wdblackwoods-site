import { NextRequest, NextResponse } from "next/server"
import { isEarlyReaderToolEnabled, markBatchAsSent } from "@/lib/earlyReaderMailMerge"

export const dynamic = "force-dynamic"

export async function POST(request: NextRequest) {
  if (!isEarlyReaderToolEnabled()) {
    return new NextResponse("Not found.", { status: 404 })
  }

  const formData = await request.formData()
  const batchId = formData.get("batchId")

  if (typeof batchId !== "string" || !batchId) {
    return new NextResponse("Missing batch.", { status: 400 })
  }

  const result = markBatchAsSent(batchId)
  const redirectUrl = new URL("/system/early-readers", request.url)
  redirectUrl.searchParams.set("sent", result.updated ? "1" : "0")
  redirectUrl.searchParams.set("batch", batchId)

  return NextResponse.redirect(redirectUrl, { status: 303 })
}
