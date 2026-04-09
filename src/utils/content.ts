import type { ContentItem } from '@/content/types'

export function uniqStrings(values: string[]): string[] {
  const set = new Set<string>()
  for (const v of values) {
    const s = (v ?? '').trim()
    if (s) set.add(s)
  }
  return Array.from(set)
}

export function formatDate(raw?: string): string {
  if (!raw) return ''
  const ms = Date.parse(raw)
  if (!Number.isFinite(ms)) return raw
  const d = new Date(ms)
  const yyyy = d.getFullYear()
  const mm = String(d.getMonth() + 1).padStart(2, '0')
  const dd = String(d.getDate()).padStart(2, '0')
  return `${yyyy}-${mm}-${dd}`
}

export function buildYearOptions(items: ContentItem[], allLabel: string) {
  const years = uniqStrings(items.map((i) => (i.updatedAt ?? i.publishedAt ?? '').slice(0, 4)).filter(Boolean)).sort((a, b) => Number(b) - Number(a))
  return [{ label: allLabel, value: 'all' }, ...years.map((y) => ({ label: y, value: y }))]
}

export function buildTagOptions(items: ContentItem[], allLabel: string) {
  const tags = uniqStrings(items.flatMap((i) => i.tags)).sort((a, b) => a.localeCompare(b))
  return [{ label: allLabel, value: 'all' }, ...tags.map((t) => ({ label: t, value: t }))]
}
