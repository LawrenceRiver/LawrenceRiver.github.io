import matter from 'gray-matter'
import type { BaseItem, ContentItem, ExternalLink, ItemType, PaperItem, AlbumItem, MerchItem, PluginItem, TourItem } from './types'
import { inferSlugFromPath, inferTypeFromPath, safeBoolean, safeNumber, safeString, stripMarkdown, toStringArray } from './utils'

function toExternalLinks(value: unknown): ExternalLink[] | undefined {
  if (!value) return undefined
  if (!Array.isArray(value)) return undefined

  const out: ExternalLink[] = []
  for (const v of value) {
    if (!v || typeof v !== 'object') continue
    const anyV = v as Record<string, unknown>
    const label = safeString(anyV.label)
    const url = safeString(anyV.url)
    if (label && url) out.push({ label, url })
  }
  return out.length ? out : undefined
}

function buildItem(filePath: string, raw: string): ContentItem | null {
  const inferredType = inferTypeFromPath(filePath)
  if (!inferredType) return null

  const slug = inferSlugFromPath(filePath)
  const { data, content } = matter(raw)
  const d = data as Record<string, unknown>

  const title = safeString(d.title) ?? slug
  const titleEn = safeString(d.title_en) ?? safeString(d.titleEn)
  const summary = safeString(d.summary) ?? ''
  const summaryEn = safeString(d.summary_en) ?? safeString(d.summaryEn)
  const tags = toStringArray(d.tags)

  const base: Omit<BaseItem, 'searchText'> = {
    id: safeString(d.id) ?? `${inferredType}:${slug}`,
    type: inferredType,
    slug,
    title,
    titleEn,
    summary,
    summaryEn,
    tags,
    coverImage: safeString(d.coverImage),
    publishedAt: safeString(d.publishedAt),
    updatedAt: safeString(d.updatedAt),
    pinned: safeBoolean(d.pinned),
    externalLinks: toExternalLinks(d.externalLinks),
    body: content.trim(),
  }

  const bodyText = stripMarkdown(base.body)
  const searchText = [base.title, base.titleEn, base.summary, base.summaryEn, base.tags.join(' '), bodyText].filter(Boolean).join(' | ')

  if (inferredType === 'paper') {
    const item: PaperItem = {
      ...base,
      type: 'paper',
      authors: toStringArray(d.authors),
      venue: safeString(d.venue),
      venueShort: safeString(d.venueShort) ?? safeString(d.venue_short),
      year: safeNumber(d.year),
      pdfUrl: safeString(d.pdfUrl),
      bibUrl: safeString(d.bibUrl) ?? safeString(d.bib_url),
      codeUrl: safeString(d.codeUrl),
      searchText,
    }
    return item
  }

  if (inferredType === 'album') {
    const item: AlbumItem = {
      ...base,
      type: 'album',
      artist: safeString(d.artist),
      releaseDate: safeString(d.releaseDate),
      platformLinks: toExternalLinks(d.platformLinks),
      searchText,
    }
    return item
  }

  if (inferredType === 'merch') {
    const rawStatus = safeString(d.availabilityStatus)
    const availabilityStatus =
      rawStatus === 'available' || rawStatus === 'sold_out' || rawStatus === 'coming_soon' ? rawStatus : undefined

    const item: MerchItem = {
      ...base,
      type: 'merch',
      price: safeString(d.price),
      availabilityStatus,
      buyLinks: toExternalLinks(d.buyLinks),
      searchText,
    }
    return item
  }

  if (inferredType === 'plugin') {
    const rawStatus = safeString(d.availabilityStatus)
    const availabilityStatus =
      rawStatus === 'available' || rawStatus === 'sold_out' || rawStatus === 'coming_soon' ? rawStatus : undefined

    const item: PluginItem = {
      ...base,
      type: 'plugin',
      price: safeString(d.price),
      availabilityStatus,
      buyLinks: toExternalLinks(d.buyLinks),
      searchText,
    }
    return item
  }

  const item: TourItem = {
    ...base,
    type: 'tour',
    eventDate: safeString(d.eventDate),
    city: safeString(d.city),
    venueName: safeString(d.venueName),
    ticketLinks: toExternalLinks(d.ticketLinks),
    searchText,
  }
  return item
}

function loadAll(): ContentItem[] {
  const modules = import.meta.glob('/src/content/**/*.md', {
    eager: true,
    query: '?raw',
    import: 'default',
  }) as Record<string, string>

  const items: ContentItem[] = []
  for (const [filePath, raw] of Object.entries(modules)) {
    const item = buildItem(filePath, raw)
    if (item) items.push(item)
  }

  return items
}

export const allItems: ContentItem[] = loadAll()
  .slice()
  .sort((a, b) => (Date.parse(b.updatedAt ?? b.publishedAt ?? '') || 0) - (Date.parse(a.updatedAt ?? a.publishedAt ?? '') || 0))

export function getItemsByType(type: ItemType): ContentItem[] {
  return allItems.filter(i => i.type === type)
}

export function getPinnedItems(): ContentItem[] {
  return allItems.filter(i => i.pinned)
}

export function getItemByTypeAndSlug(type: ItemType, slug: string): ContentItem | undefined {
  return allItems.find(i => i.type === type && i.slug === slug)
}
