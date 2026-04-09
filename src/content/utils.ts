import type { ItemType } from './types'

export function inferTypeFromPath(path: string): ItemType | null {
  const p = path.replace(/\\/g, '/')
  if (p.includes('/src/content/research/papers/')) return 'paper'
  if (p.includes('/src/content/singer/albums/')) return 'album'
  if (p.includes('/src/content/singer/merch/')) return 'merch'
  if (p.includes('/src/content/singer/tours/')) return 'tour'
  return null
}

export function inferSlugFromPath(path: string): string {
  const p = path.replace(/\\/g, '/')
  const last = p.split('/').pop() ?? p
  return last.replace(/\.md$/i, '')
}

export function toStringArray(value: unknown): string[] {
  if (!value) return []
  if (Array.isArray(value)) return value.map(v => String(v)).filter(Boolean)
  if (typeof value === 'string') return value.split(',').map(s => s.trim()).filter(Boolean)
  return []
}

export function stripMarkdown(md: string): string {
  return md
    .replace(/```[\s\S]*?```/g, ' ')
    .replace(/`[^`]*`/g, ' ')
    .replace(/!\[[^\]]*\]\([^)]*\)/g, ' ')
    .replace(/\[[^\]]*\]\([^)]*\)/g, ' ')
    .replace(/[#>*_~-]+/g, ' ')
    .replace(/\s+/g, ' ')
    .trim()
}

export function safeNumber(value: unknown): number | undefined {
  if (typeof value === 'number' && Number.isFinite(value)) return value
  if (typeof value === 'string') {
    const n = Number(value)
    if (Number.isFinite(n)) return n
  }
  return undefined
}

export function safeString(value: unknown): string | undefined {
  if (typeof value === 'string') {
    const s = value.trim()
    return s ? s : undefined
  }
  return undefined
}

export function safeBoolean(value: unknown): boolean | undefined {
  if (typeof value === 'boolean') return value
  if (typeof value === 'string') {
    if (value === 'true') return true
    if (value === 'false') return false
  }
  return undefined
}

export function getSortTimestamp(item: { updatedAt?: string; publishedAt?: string }): number {
  const raw = item.updatedAt ?? item.publishedAt
  if (!raw) return 0
  const ms = Date.parse(raw)
  return Number.isFinite(ms) ? ms : 0
}
