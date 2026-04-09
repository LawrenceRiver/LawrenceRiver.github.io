import type { Lang } from './dict'

export function pickByLang(lang: Lang, zh: string, en?: string) {
  return lang === 'en' ? en ?? zh : zh
}

