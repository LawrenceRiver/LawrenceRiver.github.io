import Fuse from 'fuse.js'
import type { ContentItem } from '@/content/types'

export function searchItems(items: ContentItem[], query: string): ContentItem[] {
  const q = query.trim()
  if (!q) return []

  const fuse = new Fuse(items, {
    includeScore: true,
    threshold: 0.35,
    keys: [
      { name: 'title', weight: 0.45 },
      { name: 'titleEn', weight: 0.35 },
      { name: 'summary', weight: 0.25 },
      { name: 'summaryEn', weight: 0.2 },
      { name: 'tags', weight: 0.15 },
      { name: 'searchText', weight: 0.15 },
    ],
  })

  return fuse.search(q).map((r) => r.item)
}
