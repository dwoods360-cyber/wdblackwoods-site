import type { MetadataRoute } from "next"
import { getPublishedArchiveSlugs } from "@/content/archive"
import { getPublishedArchiveArtifactSlugs } from "@/content/archiveArtifacts"
import { siteUrl } from "@/lib/siteMetadata"

const staticRoutes = ["/", "/begin", "/archive", "/archive/artifacts", "/about"]

export const revalidate = 0

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date()
  const archiveRoutes = getPublishedArchiveSlugs(now).map((slug) => `/archive/${slug}`)
  const artifactRoutes = getPublishedArchiveArtifactSlugs(now).map(
    (slug) => `/archive/artifacts/${slug}`
  )

  return [...staticRoutes, ...archiveRoutes, ...artifactRoutes].map((route) => ({
    url: `${siteUrl}${route}`,
    lastModified: now,
  }))
}
