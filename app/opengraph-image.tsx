import { ImageResponse } from "next/og"
import { archiveName, siteName } from "@/lib/siteMetadata"

export const alt = archiveName
export const size = {
  width: 1200,
  height: 630,
}
export const contentType = "image/png"

export default function OpenGraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          background: "#f6f3ee",
          color: "#111111",
          padding: "72px 84px",
          fontFamily: "Georgia, serif",
        }}
      >
        <div
          style={{
            fontSize: 68,
            lineHeight: 1.05,
            letterSpacing: "-0.02em",
            fontWeight: 500,
          }}
        >
          {siteName}
        </div>
        <div
          style={{
            marginTop: 28,
            width: 260,
            borderTop: "1px solid #ddd6cc",
          }}
        />
        <div
          style={{
            marginTop: 30,
            color: "#555555",
            fontSize: 32,
            lineHeight: 1.35,
          }}
        >
          {archiveName}
        </div>
      </div>
    ),
    size
  )
}
