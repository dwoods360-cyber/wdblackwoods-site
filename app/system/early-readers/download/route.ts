import { existsSync, readFileSync } from "fs"
import {
  isEarlyReaderToolEnabled,
  privateLiveTestCsvPath,
  privateMailMergeCsvPath,
} from "@/lib/earlyReaderMailMerge"

export const dynamic = "force-dynamic"

export async function GET(request: Request) {
  if (!isEarlyReaderToolEnabled()) {
    return new Response("Not found.", { status: 404 })
  }

  const url = new URL(request.url)
  const path = url.searchParams.get("file") === "live-test" ? privateLiveTestCsvPath : privateMailMergeCsvPath
  const filename =
    url.searchParams.get("file") === "live-test"
      ? "early-reader-live-test.csv"
      : "early-reader-mail-merge.csv"

  if (!existsSync(path)) {
    return new Response("No generated CSV is available.", { status: 404 })
  }

  return new Response(readFileSync(path, "utf8"), {
    headers: {
      "Content-Disposition": `attachment; filename="${filename}"`,
      "Content-Type": "text/csv; charset=utf-8",
      "X-Robots-Tag": "noindex, nofollow",
    },
  })
}
