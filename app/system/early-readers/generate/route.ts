import { NextRequest, NextResponse } from "next/server"
import {
  generateMailMergeCsv,
  isEarlyReaderToolEnabled,
} from "@/lib/earlyReaderMailMerge"

export const dynamic = "force-dynamic"

export async function POST(request: NextRequest) {
  if (!isEarlyReaderToolEnabled()) {
    return new NextResponse("Not found.", { status: 404 })
  }

  const formData = await request.formData()
  const selection = formData.get("selection")

  if (typeof selection !== "string") {
    return new NextResponse("Missing selection.", { status: 400 })
  }

  try {
    const generated = generateMailMergeCsv(selection)
    const redirectUrl = new URL("/system/early-readers", request.url)
    redirectUrl.searchParams.set("generated", "1")
    redirectUrl.searchParams.set("selection", selection)
    redirectUrl.searchParams.set("batch", generated.batchId)
    redirectUrl.searchParams.set("expires", generated.expiresAt.toISOString().slice(0, 10))

    return NextResponse.redirect(redirectUrl, { status: 303 })
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unable to generate CSV."
    return new NextResponse(message, { status: 400 })
  }
}
