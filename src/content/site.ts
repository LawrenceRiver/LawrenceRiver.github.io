import matter from 'gray-matter'

export type SiteLink = { label: string; url: string }

export type ResearchProfile = {
  name: string
  nameEn?: string
  avatar?: string
  bio?: string
  bioEn?: string
  bullets?: string[]
  bulletsEn?: string[]
  links?: SiteLink[]
}

export type SiteSettings = {
  homeResearchImage?: string
  homeSingerImage?: string
  singerPosterImage?: string
  singerEraImage?: string
  singerBackgroundImage?: string
  researchHeroImage?: string
  socialLinks?: { id: string; url: string }[]
}

export type MusicVideo = {
  title: string
  titleEn?: string
  youtubeId: string
}

export type SingerSection = {
  id: 'albums' | 'merch' | 'plugins' | 'tours'
  title: string
  titleEn?: string
  body?: string
  bodyEn?: string
}

function toStringArray(value: unknown): string[] | undefined {
  if (!value) return undefined
  if (!Array.isArray(value)) return undefined
  const out: string[] = []
  for (const v of value) {
    if (typeof v === 'string' && v.trim()) out.push(v.trim())
  }
  return out.length ? out : undefined
}

function toLinks(value: unknown): SiteLink[] | undefined {
  if (!value) return undefined
  if (!Array.isArray(value)) return undefined
  const out: SiteLink[] = []
  for (const v of value) {
    if (!v || typeof v !== 'object') continue
    const anyV = v as Record<string, unknown>
    const label = typeof anyV.label === 'string' ? anyV.label.trim() : ''
    const url = typeof anyV.url === 'string' ? anyV.url.trim() : ''
    if (label && url) out.push({ label, url })
  }
  return out.length ? out : undefined
}

export function loadResearchProfile(): ResearchProfile {
  const modules = import.meta.glob('/src/content/site/*.md', {
    eager: true,
    query: '?raw',
    import: 'default',
  }) as Record<string, string>

  const key = Object.keys(modules).find((p) => p.endsWith('/research-profile.md'))
  const raw = key ? modules[key] : ''
  const { data } = matter(raw)
  const d = data as Record<string, unknown>

  return {
    name: typeof d.name === 'string' ? d.name : 'LIAO Honglin',
    nameEn: typeof d.name_en === 'string' ? d.name_en : typeof d.nameEn === 'string' ? d.nameEn : undefined,
    avatar: typeof d.avatar === 'string' ? d.avatar : undefined,
    bio: typeof d.bio === 'string' ? d.bio : undefined,
    bioEn: typeof d.bio_en === 'string' ? d.bio_en : typeof d.bioEn === 'string' ? d.bioEn : undefined,
    bullets: toStringArray(d.bullets),
    bulletsEn: toStringArray(d.bullets_en) ?? toStringArray(d.bulletsEn),
    links: toLinks(d.links),
  }
}

export function loadSiteSettings(): SiteSettings {
  const modules = import.meta.glob('/src/content/site/*.md', {
    eager: true,
    query: '?raw',
    import: 'default',
  }) as Record<string, string>

  const key = Object.keys(modules).find((p) => p.endsWith('/settings.md'))
  const raw = key ? modules[key] : ''
  const { data } = matter(raw)
  const d = data as Record<string, unknown>

  const pick = (k: string) => (typeof d[k] === 'string' ? (d[k] as string) : undefined)

  const socialLinks = Array.isArray(d.socialLinks)
    ? (d.socialLinks as unknown[])
        .map((v) => {
          if (!v || typeof v !== 'object') return null
          const anyV = v as Record<string, unknown>
          const id = typeof anyV.id === 'string' ? anyV.id.trim() : ''
          const url = typeof anyV.url === 'string' ? anyV.url.trim() : ''
          return id && url ? { id, url } : null
        })
        .filter(Boolean)
    : undefined

  return {
    homeResearchImage: pick('homeResearchImage'),
    homeSingerImage: pick('homeSingerImage'),
    singerPosterImage: pick('singerPosterImage'),
    singerEraImage: pick('singerEraImage'),
    singerBackgroundImage: pick('singerBackgroundImage'),
    researchHeroImage: pick('researchHeroImage'),
    socialLinks: socialLinks as { id: string; url: string }[] | undefined,
  }
}

export function loadMusicVideos(): MusicVideo[] {
  const modules = import.meta.glob('/src/content/site/*.md', {
    eager: true,
    query: '?raw',
    import: 'default',
  }) as Record<string, string>

  const key = Object.keys(modules).find((p) => p.endsWith('/music-videos.md'))
  const raw = key ? modules[key] : ''
  const { data } = matter(raw)
  const d = data as Record<string, unknown>
  const list = d.videos
  if (!Array.isArray(list)) return []

  const out: MusicVideo[] = []
  for (const v of list) {
    if (!v || typeof v !== 'object') continue
    const anyV = v as Record<string, unknown>
    const title = typeof anyV.title === 'string' ? anyV.title.trim() : ''
    const titleEn = typeof anyV.title_en === 'string' ? anyV.title_en.trim() : typeof anyV.titleEn === 'string' ? anyV.titleEn.trim() : undefined
    const youtubeId = typeof anyV.youtubeId === 'string' ? anyV.youtubeId.trim() : ''
    if (!title || !youtubeId) continue
    out.push({ title, titleEn, youtubeId })
  }
  return out
}

export function loadSingerSections(): SingerSection[] {
  const modules = import.meta.glob('/src/content/site/*.md', {
    eager: true,
    query: '?raw',
    import: 'default',
  }) as Record<string, string>

  const key = Object.keys(modules).find((p) => p.endsWith('/singer-sections.md'))
  const raw = key ? modules[key] : ''
  const { data } = matter(raw)
  const d = data as Record<string, unknown>
  const list = d.sections
  if (!Array.isArray(list)) return []

  const okIds = new Set(['albums', 'merch', 'plugins', 'tours'])
  const out: SingerSection[] = []
  for (const v of list) {
    if (!v || typeof v !== 'object') continue
    const anyV = v as Record<string, unknown>
    const id = typeof anyV.id === 'string' ? anyV.id.trim() : ''
    if (!okIds.has(id)) continue
    const title = typeof anyV.title === 'string' ? anyV.title.trim() : ''
    if (!title) continue
    const titleEn = typeof anyV.title_en === 'string' ? anyV.title_en.trim() : typeof anyV.titleEn === 'string' ? anyV.titleEn.trim() : undefined
    const body = typeof anyV.body === 'string' ? anyV.body.trim() : undefined
    const bodyEn = typeof anyV.body_en === 'string' ? anyV.body_en.trim() : typeof anyV.bodyEn === 'string' ? anyV.bodyEn.trim() : undefined
    out.push({ id: id as SingerSection['id'], title, titleEn, body, bodyEn })
  }
  return out
}
