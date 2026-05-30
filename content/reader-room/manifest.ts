export type ReaderChapter = {
  slug: string
  title: string
  volume: string
  order: number
  enabled: boolean
  version: string
  updatedAt?: string
}

export type ReaderChapterPack = {
  id: string
  title: string
  chapterSlugs: string[]
  version: string
  updatedAt?: string
}

export const readerChapters: ReaderChapter[] = [
  {
    slug: "opening-pages-placeholder",
    title: "Opening Pages — Placeholder",
    volume: "Hold the Earth",
    order: 1,
    enabled: true,
    version: "placeholder-v1",
    updatedAt: "2026-05-30",
  },
]

export const readerChapterPacks: ReaderChapterPack[] = [
  {
    id: "opening-pages",
    title: "Opening Pages",
    chapterSlugs: ["opening-pages-placeholder"],
    version: "placeholder-pack-v1",
    updatedAt: "2026-05-30",
  },
]

export function getEnabledReaderChapters() {
  return readerChapters
    .filter((chapter) => chapter.enabled)
    .sort((first, second) => first.order - second.order)
}

export function getReaderChapter(slug: string) {
  return readerChapters.find((chapter) => chapter.slug === slug && chapter.enabled)
}

export function getReaderChapterPack(packId: string) {
  return readerChapterPacks.find((pack) => pack.id === packId)
}
