export type ItemType = 'paper' | 'album' | 'merch' | 'tour'

export type ExternalLink = {
  label: string
  url: string
}

export type BaseItem = {
  id: string
  type: ItemType
  slug: string
  title: string
  titleEn?: string
  summary: string
  summaryEn?: string
  tags: string[]
  coverImage?: string
  publishedAt?: string
  updatedAt?: string
  pinned?: boolean
  externalLinks?: ExternalLink[]
  body: string
  searchText: string
}

export type PaperItem = BaseItem & {
  type: 'paper'
  authors?: string[]
  venue?: string
  venueShort?: string
  year?: number
  pdfUrl?: string
  bibUrl?: string
  codeUrl?: string
}

export type AlbumItem = BaseItem & {
  type: 'album'
  artist?: string
  releaseDate?: string
  platformLinks?: ExternalLink[]
}

export type MerchItem = BaseItem & {
  type: 'merch'
  price?: string
  availabilityStatus?: 'available' | 'sold_out' | 'coming_soon'
  buyLinks?: ExternalLink[]
}

export type TourItem = BaseItem & {
  type: 'tour'
  eventDate?: string
  city?: string
  venueName?: string
  ticketLinks?: ExternalLink[]
}

export type ContentItem = PaperItem | AlbumItem | MerchItem | TourItem
