import { Link, useSearchParams } from 'react-router-dom'
import ContentCard from '@/components/ContentCard'
import { allItems, getPinnedItems } from '@/content'
import { useMemo } from 'react'
import { searchItems } from '@/utils/search'
import { pickByLang, useI18n } from '@/i18n'
import TornHero from '@/components/TornHero'
import { loadSiteSettings } from '@/content/site'

export default function Home() {
  const { lang, t } = useI18n()
  const [params] = useSearchParams()
  const q = (params.get('q') ?? '').trim()

  const settings = useMemo(() => loadSiteSettings(), [])

  const pinned = useMemo(() => getPinnedItems().slice(0, 6), [])
  const latest = useMemo(() => allItems.slice(0, 12), [])
  const searchResults = useMemo(() => (q ? searchItems(allItems, q).slice(0, 24) : []), [q])

  return (
    <div className="space-y-12">
      <TornHero
        left={{
          title: t('home_hero_research'),
          href: '/research',
          imageUrl: settings.homeResearchImage ?? '/hero/home-research.svg',
          cta: t('home_hero_cta'),
        }}
        right={{
          title: t('home_hero_singer'),
          href: '/singer',
          imageUrl: settings.homeSingerImage ?? '/hero/home-singer.svg',
          cta: t('home_hero_cta'),
        }}
      />

      {q ? (
        <section className="space-y-4">
          <div className="flex items-baseline justify-between gap-4">
            <h2 className="text-sm font-semibold tracking-tight">{t('home_search_results')}</h2>
            <Link to="/" className="text-xs text-[#6D5EF7] hover:underline">
              {t('common_clear')}
            </Link>
          </div>
          {searchResults.length ? (
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              {searchResults.map((it) => (
                <ContentCard key={it.id} item={it} compact />
              ))}
            </div>
          ) : (
            <div className="rounded-2xl border border-zinc-200 bg-white p-6 text-sm text-zinc-600 dark:border-white/10 dark:bg-white/5 dark:text-zinc-300">
              {t('home_no_results')}
            </div>
          )}
        </section>
      ) : null}

      <section className="space-y-4">
        <div className="flex items-baseline justify-between gap-4">
          <h2 className="text-sm font-semibold tracking-tight">{t('home_pinned')}</h2>
        </div>
        {pinned.length ? (
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            {pinned.map((it) => (
              <ContentCard key={it.id} item={it} />
            ))}
          </div>
        ) : (
          <div className="rounded-2xl border border-zinc-200 bg-white p-6 text-sm text-zinc-600 dark:border-white/10 dark:bg-white/5 dark:text-zinc-300">
            {t('home_no_pinned')}
          </div>
        )}
      </section>

      <section className="space-y-4">
        <div className="flex items-baseline justify-between gap-4">
          <h2 className="text-sm font-semibold tracking-tight">{t('home_latest')}</h2>
          <div className="text-xs text-zinc-500 dark:text-zinc-400">{t('home_latest_hint')}</div>
        </div>
        <div className="space-y-3">
          {latest.map((it) => (
            <Link
              key={it.id}
              to={`/item/${it.type}/${it.slug}`}
              className="flex items-center justify-between gap-3 rounded-2xl border border-zinc-200 bg-white px-5 py-4 transition hover:border-zinc-300 hover:bg-zinc-50 dark:border-white/10 dark:bg-white/5 dark:hover:border-white/20 dark:hover:bg-white/10"
            >
              <div className="min-w-0">
                <div className="flex flex-wrap items-center gap-2">
                  <span className="rounded-md bg-zinc-100 px-2 py-1 text-xs text-zinc-600 dark:bg-white/10 dark:text-zinc-300">
                    {it.type === 'paper' ? t('type_paper') : it.type === 'album' ? t('type_album') : it.type === 'merch' ? t('type_merch') : t('type_tour')}
                  </span>
                  <span className="truncate text-sm font-medium">{pickByLang(lang, it.title, it.titleEn)}</span>
                </div>
                {pickByLang(lang, it.summary, it.summaryEn) ? (
                  <div className="mt-1 line-clamp-1 text-xs text-zinc-500 dark:text-zinc-400">{pickByLang(lang, it.summary, it.summaryEn)}</div>
                ) : null}
              </div>
              <div className="text-xs text-zinc-500 dark:text-zinc-400">{it.updatedAt ?? it.publishedAt ?? ''}</div>
            </Link>
          ))}
        </div>
      </section>
    </div>
  )
}
