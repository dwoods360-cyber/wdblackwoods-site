import type { MetadataRoute } from "next"
import { getPublishedArchiveSlugs } from "@/content/archive"
import { siteUrl } from "@/lib/siteMetadata"

const staticRoutes = ["/", "/begin", "/archive", "/about"]

export const revalidate = 0

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date()
  const archiveRoutes = getPublishedArchiveSlugs(now).map((slug) => `/archive/${slug}`)

  return [...staticRoutes, ...archiveRoutes].map((route) => ({
    url: `${siteUrl}${route}`,
    lastModified: now,
  }))
}
