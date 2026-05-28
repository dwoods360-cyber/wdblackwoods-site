import type { MetadataRoute } from "next"
import { archiveSlugs } from "@/content/archive"
import { siteUrl } from "@/lib/siteMetadata"

const staticRoutes = ["/", "/begin", "/archive", "/about", "/system"]

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date()
  const archiveRoutes = archiveSlugs.map((slug) => `/archive/${slug}`)

  return [...staticRoutes, ...archiveRoutes].map((route) => ({
    url: `${siteUrl}${route}`,
    lastModified: now,
  }))
}
