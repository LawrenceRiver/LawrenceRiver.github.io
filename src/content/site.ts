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
}

export type MusicVideo = {
  title: string
  titleEn?: string
  youtubeId: string
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

  return {
    homeResearchImage: pick('homeResearchImage'),
    homeSingerImage: pick('homeSingerImage'),
    singerPosterImage: pick('singerPosterImage'),
    singerEraImage: pick('singerEraImage'),
    singerBackgroundImage: pick('singerBackgroundImage'),
    researchHeroImage: pick('researchHeroImage'),
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
