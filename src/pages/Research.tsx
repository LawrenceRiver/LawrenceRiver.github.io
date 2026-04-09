import { useMemo } from 'react'
import type { PaperItem } from '@/content/types'
import { getItemsByType } from '@/content'
import { ExternalLink } from 'lucide-react'
import { Link } from 'react-router-dom'
import { useI18n } from '@/i18n'
import PosterHero from '@/components/PosterHero'
import VenuePill from '@/components/VenuePill'
import { loadResearchProfile, loadSiteSettings } from '@/content/site'

export default function Research() {
  const { t, lang } = useI18n()
  const items = useMemo(() => getItemsByType('paper') as PaperItem[], [])
  const profile = useMemo(() => loadResearchProfile(), [])
  const settings = useMemo(() => loadSiteSettings(), [])
  const latest = useMemo(() => items.slice(0, 12), [items])

  return (
    <div className="space-y-10">
      <PosterHero imageUrl={settings.researchHeroImage ?? '/hero/research-paper.svg'} className="-mt-10">
        <div className="flex items-end justify-between gap-4">
          <div className="text-sm font-semibold tracking-tight text-white">{t('research_title')}</div>
        </div>
      </PosterHero>

      <section className="grid grid-cols-1 gap-4 md:grid-cols-[280px_1fr]">
        <div className="overflow-hidden rounded-2xl border border-zinc-200/80 bg-white/70 shadow-sm shadow-black/[0.02] backdrop-blur dark:border-white/10 dark:bg-white/5 dark:shadow-black/0">
          <img src={profile.avatar ?? '/hero/avatar.svg'} alt={profile.name} className="h-[280px] w-full object-cover" />
        </div>
        <div className="rounded-2xl border border-zinc-200/80 bg-white/70 p-5 shadow-sm shadow-black/[0.02] backdrop-blur dark:border-white/10 dark:bg-white/5 dark:shadow-black/0">
          <div className="text-sm font-semibold tracking-tight">{lang === 'en' ? profile.nameEn ?? profile.name : profile.name}</div>
          <div className="mt-1 text-xs text-zinc-500 dark:text-zinc-400">{lang === 'en' ? profile.bioEn ?? profile.bio ?? '' : profile.bio ?? ''}</div>
          {(lang === 'en' ? profile.bulletsEn ?? profile.bullets : profile.bullets)?.length ? (
            <div className="mt-4 flex flex-wrap gap-2">
              {(lang === 'en' ? profile.bulletsEn ?? profile.bullets : profile.bullets)!.map((b) => (
                <span
                  key={b}
                  className="inline-flex items-center rounded-full border border-zinc-200 bg-white px-3 py-1 text-xs text-zinc-700 dark:border-white/10 dark:bg-white/5 dark:text-zinc-200"
                >
                  {b}
                </span>
              ))}
            </div>
          ) : null}
          {profile.links?.length ? (
            <div className="mt-4 flex flex-wrap gap-2">
              {profile.links.map((l) => (
                <a
                  key={l.label}
                  href={l.url}
                  target="_blank"
                  rel="noreferrer"
                  className="glow-hover inline-flex items-center gap-2 rounded-full border border-zinc-200 bg-white px-3 py-1.5 text-xs text-zinc-700 transition hover:bg-zinc-50 dark:border-white/10 dark:bg-white/5 dark:text-zinc-200 dark:hover:bg-white/10"
                >
                  {l.label} <ExternalLink className="h-3.5 w-3.5 opacity-60" />
                </a>
              ))}
            </div>
          ) : null}
        </div>
      </section>

      <section className="space-y-3">
        <div className="flex items-baseline justify-between gap-4">
          <div className="text-sm font-semibold tracking-tight">{t('home_latest')}</div>
          <div className="text-xs text-zinc-500 dark:text-zinc-400">{t('home_latest_hint')}</div>
        </div>

        {latest.length ? (
          <div className="space-y-4 rounded-2xl bg-[#0B0F14]/95 p-5 shadow-sm shadow-black/[0.12]">
            {latest.map((p) => {
              const tag = p.venueShort ?? (p.venue ? p.venue.split(' ').find((x) => x.toUpperCase() === x && x.length <= 6) : null) ?? 'PAPER'
              const venueLine = [p.venue ? `In ${p.venue}` : null, p.year ? String(p.year) : null].filter(Boolean).join(', ')
              return (
                <div key={p.id} className="grid grid-cols-1 gap-3 md:grid-cols-[92px_1fr_auto] md:items-center">
                  <div>
                    <VenuePill label={tag} />
                  </div>
                  <div className="min-w-0">
                    <Link to={`/item/paper/${p.slug}`} className="block text-sm font-semibold text-white hover:underline">
                      {lang === 'en' ? p.titleEn ?? p.title : p.title}
                    </Link>
                    <div className="mt-1 text-xs text-zinc-300">
                      {p.authors?.length ? p.authors.join(', ') : null}
                    </div>
                    {venueLine ? <div className="mt-1 text-xs italic text-zinc-400">{venueLine}</div> : null}
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {p.bibUrl ? (
                      <a
                        href={p.bibUrl}
                        target="_blank"
                        rel="noreferrer"
                        className="glow-hover rounded-md border border-white/30 bg-black/10 px-3 py-1.5 text-xs font-medium text-white hover:bg-white/10"
                      >
                        BIB
                      </a>
                    ) : null}
                    {p.pdfUrl ? (
                      <a
                        href={p.pdfUrl}
                        target="_blank"
                        rel="noreferrer"
                        className="glow-hover rounded-md border border-white/30 bg-black/10 px-3 py-1.5 text-xs font-medium text-white hover:bg-white/10"
                      >
                        PDF
                      </a>
                    ) : null}
                    {p.codeUrl ? (
                      <a
                        href={p.codeUrl}
                        target="_blank"
                        rel="noreferrer"
                        className="glow-hover rounded-md border border-white/30 bg-black/10 px-3 py-1.5 text-xs font-medium text-white hover:bg-white/10"
                      >
                        CODE
                      </a>
                    ) : null}
                  </div>
                </div>
              )
            })}
          </div>
        ) : (
          <section className="rounded-2xl border border-zinc-200 bg-white p-6 text-sm text-zinc-600 dark:border-white/10 dark:bg-white/5 dark:text-zinc-300">
            {t('research_empty')}
          </section>
        )}
      </section>
    </div>
  )
}
