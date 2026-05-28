import type { Metadata } from "next"

export const siteUrl = "https://wdblackwoods-site.vercel.app"
export const siteName = "W.D. Blackwoods"
export const archiveName = "What Coffee Demands Archive"
export const ogImagePath = "/opengraph-image"

type PageMetadataInput = {
  title: string
  description: string
  path: string
  type?: "website" | "article"
}

export function createPageMetadata({
  title,
  description,
  path,
  type = "website",
}: PageMetadataInput): Metadata {
  const url = new URL(path, siteUrl).toString()
  const imageUrl = new URL(ogImagePath, siteUrl).toString()

  return {
    title,
    description,
    alternates: {
      canonical: url,
    },
    openGraph: {
      title,
      description,
      url,
      siteName,
      type,
      images: [
        {
          url: imageUrl,
          width: 1200,
          height: 630,
          alt: archiveName,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [imageUrl],
    },
  }
}
