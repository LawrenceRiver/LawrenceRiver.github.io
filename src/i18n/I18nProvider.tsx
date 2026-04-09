import { createContext, useContext, useEffect, useMemo, useState } from 'react'
import type { I18nKey, Lang } from './dict'
import { dict } from './dict'

type I18nValue = {
  lang: Lang
  setLang: (l: Lang) => void
  t: (key: I18nKey, vars?: Record<string, string | number>) => string
}

const I18nContext = createContext<I18nValue | null>(null)

function interpolate(template: string, vars?: Record<string, string | number>) {
  if (!vars) return template
  return template.replace(/\{\{(\w+)\}\}/g, (_, k) => String(vars[k] ?? ''))
}

function readLangFromUrl(): Lang | null {
  const tryParse = (raw: string | null): Lang | null => (raw === 'zh' || raw === 'en' ? raw : null)

  const direct = tryParse(new URLSearchParams(window.location.search).get('lang'))
  if (direct) return direct

  const hash = window.location.hash
  const idx = hash.indexOf('?')
  if (idx >= 0) {
    const qs = hash.slice(idx + 1)
    const fromHash = tryParse(new URLSearchParams(qs).get('lang'))
    if (fromHash) return fromHash
  }
  return null
}

export function I18nProvider({ children }: { children: React.ReactNode }) {
  const [lang, setLangState] = useState<Lang>('zh')

  useEffect(() => {
    const fromUrl = readLangFromUrl()
    const fromStorage = (localStorage.getItem('site_lang') as Lang | null) ?? null
    const next = fromUrl ?? (fromStorage === 'zh' || fromStorage === 'en' ? fromStorage : null) ?? 'zh'
    setLangState(next)
    localStorage.setItem('site_lang', next)
  }, [])

  const setLang = (l: Lang) => {
    setLangState(l)
    localStorage.setItem('site_lang', l)
  }

  const t = useMemo(() => {
    return (key: I18nKey, vars?: Record<string, string | number>) => interpolate(dict[lang][key], vars)
  }, [lang])

  const value = useMemo<I18nValue>(() => ({ lang, setLang, t }), [lang, t])

  return <I18nContext.Provider value={value}>{children}</I18nContext.Provider>
}

export function useI18n() {
  const ctx = useContext(I18nContext)
  if (!ctx) throw new Error('useI18n must be used within I18nProvider')
  return ctx
}

