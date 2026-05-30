import { existsSync, readFileSync } from "fs"
import {
  isEarlyReaderToolEnabled,
  privateMailMergeCsvPath,
} from "@/lib/earlyReaderMailMerge"

export const dynamic = "force-dynamic"

export async function GET() {
  if (!isEarlyReaderToolEnabled()) {
    return new Response("Not found.", { status: 404 })
  }

  if (!existsSync(privateMailMergeCsvPath)) {
    return new Response("No generated CSV is available.", { status: 404 })
  }

  return new Response(readFileSync(privateMailMergeCsvPath, "utf8"), {
    headers: {
      "Content-Disposition": 'attachment; filename="early-reader-mail-merge.csv"',
      "Content-Type": "text/csv; charset=utf-8",
      "X-Robots-Tag": "noindex, nofollow",
    },
  })
}
