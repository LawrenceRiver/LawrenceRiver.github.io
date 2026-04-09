import { useMemo, useState } from 'react'
import ContentCard from '@/components/ContentCard'
import PosterHero from '@/components/PosterHero'
import { getItemsByType } from '@/content'
import type { AlbumItem, ContentItem, ItemType } from '@/content/types'
import { cn } from '@/lib/utils'
import { uniqStrings } from '@/utils/content'
import { useI18n } from '@/i18n'
import { X } from 'lucide-react'
import { Link } from 'react-router-dom'
import { loadMusicVideos, loadSingerSections, loadSiteSettings } from '@/content/site'
import SocialLinks from '@/components/SocialLinks'

type SingerTab = 'album' | 'merch' | 'plugin' | 'tour'

function Tabs({ value, onChange }: { value: SingerTab; onChange: (t: SingerTab) => void }) {
  const { t } = useI18n()
  const tabs: { key: SingerTab; label: string }[] = [
    { key: 'album', label: t('singer_tab_album') },
    { key: 'merch', label: t('singer_tab_merch') },
    { key: 'plugin', label: t('singer_tab_plugin') },
    { key: 'tour', label: t('singer_tab_tour') },
  ]

  return (
    <div className="flex flex-wrap gap-2">
      {tabs.map((t) => (
        <button
          key={t.key}
          type="button"
          onClick={() => onChange(t.key)}
          className={cn(
            'glow-hover rounded-full border px-4 py-2 text-sm transition',
            value === t.key
              ? 'border-[#6D5EF7]/40 bg-[#6D5EF7]/10 text-[#6D5EF7]'
              : 'border-zinc-200 bg-white text-zinc-700 hover:bg-zinc-50 dark:border-white/10 dark:bg-white/5 dark:text-zinc-200 dark:hover:bg-white/10',
          )}
        >
          {t.label}
        </button>
      ))}
    </div>
  )
}

function applySingerFilters(items: ContentItem[], year: string, tag: string, extra: Record<string, string>): ContentItem[] {
  let out = items
  if (year !== 'all') {
    out = out.filter((i) => (i.updatedAt ?? i.publishedAt ?? '').startsWith(year))
  }
  if (tag !== 'all') {
    out = out.filter((i) => i.tags.includes(tag))
  }
  if (extra.availability !== 'all') {
    out = out.filter((i) =>
      i.type === 'merch' || i.type === 'plugin' ? (i.availabilityStatus ?? 'available') === extra.availability : true,
    )
  }
  if (extra.city !== 'all') {
    out = out.filter((i) => (i.type === 'tour' ? (i.city ?? '') === extra.city : true))
  }
  return out
}

function platformOrder(label: string) {
  const key = label.toLowerCase()
  if (key.includes('soundcloud')) return 10
  if (key.includes('spotify')) return 20
  if (key.includes('apple')) return 30
  if (label.includes('QQ')) return 40
  if (label.includes('网易')) return 50
  return 100
}

function AlbumGrid({ items, onListen }: { items: AlbumItem[]; onListen: (album: AlbumItem) => void }) {
  const { lang, t } = useI18n()

  return (
    <section className="relative overflow-hidden rounded-3xl bg-[#0B0F14]/85 p-6 shadow-sm shadow-black/[0.16] md:p-8">
      <div aria-hidden className="pointer-events-none absolute inset-0 opacity-80">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_30%,rgba(255,255,255,0.12),rgba(255,255,255,0)_45%),radial-gradient(circle_at_75%_60%,rgba(109,94,247,0.22),rgba(109,94,247,0)_55%)]" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_0%,rgba(255,255,255,0.10),rgba(255,255,255,0)_60%)]" />
      </div>

      <div className="relative grid grid-cols-1 gap-10 md:grid-cols-2 lg:grid-cols-3">
        {items.map((a) => (
          <div key={a.id} className="text-center">
            <button type="button" onClick={() => onListen(a)} className="mx-auto block w-full max-w-[340px]">
              <div className="aspect-square w-full overflow-hidden bg-black/10">
                {a.coverImage ? (
                  <img src={a.coverImage} alt={lang === 'en' ? a.titleEn ?? a.title : a.title} className="h-full w-full object-cover" />
                ) : (
                  <div className="h-full w-full bg-gradient-to-br from-[#6D5EF7]/25 via-[#4D8CFF]/20 to-transparent" />
                )}
              </div>
            </button>

            <div className="mx-auto mt-6 max-w-[340px] text-xs font-medium tracking-[0.18em] text-white/85">
              {(lang === 'en' ? a.titleEn ?? a.title : a.title).toUpperCase()}
            </div>

            <button
              type="button"
              onClick={() => onListen(a)}
              className="glow-hover mt-4 inline-flex items-center justify-center rounded-full bg-white/10 px-6 py-2 text-xs font-medium tracking-wide text-white/90 transition hover:bg-white/14"
            >
              {t('music_listen_now')}
            </button>
          </div>
        ))}
      </div>
    </section>
  )
}

function ListenNowModal({ album, onClose }: { album: AlbumItem; onClose: () => void }) {
  const { lang, t } = useI18n()

  const links = (album.platformLinks ?? [])
    .slice()
    .sort((x, y) => platformOrder(x.label) - platformOrder(y.label) || x.label.localeCompare(y.label))

  return (
    <div className="fixed inset-0 z-50">
      <button type="button" aria-label="Close" onClick={onClose} className="absolute inset-0 bg-black/60" />
      <div className="absolute left-1/2 top-1/2 w-[min(920px,calc(100vw-32px))] -translate-x-1/2 -translate-y-1/2 overflow-hidden rounded-3xl bg-[#0B0F14] shadow-2xl shadow-black/60">
        <div aria-hidden className="pointer-events-none absolute inset-0">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_35%_25%,rgba(77,140,255,0.35),rgba(77,140,255,0)_55%),radial-gradient(circle_at_70%_65%,rgba(109,94,247,0.35),rgba(109,94,247,0)_55%)]" />
        </div>

        <div className="relative grid grid-cols-1 gap-6 p-6 md:grid-cols-[260px_1fr] md:p-8">
          <div className="overflow-hidden">
            <div className="aspect-square w-full overflow-hidden bg-black/20">
              {album.coverImage ? (
                <img src={album.coverImage} alt={lang === 'en' ? album.titleEn ?? album.title : album.title} className="h-full w-full object-cover" />
              ) : null}
            </div>
          </div>

          <div className="min-w-0">
            <div className="flex items-start justify-between gap-4">
              <div>
                <div className="text-2xl font-semibold tracking-tight text-white">{lang === 'en' ? album.titleEn ?? album.title : album.title}</div>
                <div className="mt-2 text-sm text-white/70">{t('music_choose_service')}</div>
              </div>
              <button
                type="button"
                onClick={onClose}
                className="glow-hover inline-flex h-10 w-10 items-center justify-center rounded-full bg-white/10 text-white/80 hover:bg-white/14"
                aria-label="Close"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="mt-6 grid gap-3">
              {links.map((l) => (
                <a
                  key={l.label}
                  href={l.url}
                  target="_blank"
                  rel="noreferrer"
                  className="glow-hover group flex items-center justify-between rounded-full bg-white px-6 py-4 text-sm text-zinc-900 transition hover:brightness-[0.98]"
                >
                  <span className="text-zinc-500">{t('music_play')}</span>
                  <span className="font-medium">{l.label}</span>
                </a>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

function SectionModal({
  title,
  body,
  onOpen,
  onClose,
}: {
  title: string
  body?: string
  onOpen: () => void
  onClose: () => void
}) {
  const { t } = useI18n()

  return (
    <div className="fixed inset-0 z-50">
      <button type="button" aria-label={t('common_close')} onClick={onClose} className="absolute inset-0 bg-black/60" />
      <div className="absolute left-1/2 top-1/2 w-[min(760px,calc(100vw-32px))] -translate-x-1/2 -translate-y-1/2 overflow-hidden rounded-3xl bg-[#0B0F14] shadow-2xl shadow-black/60">
        <div aria-hidden className="pointer-events-none absolute inset-0">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_35%_25%,rgba(77,140,255,0.28),rgba(77,140,255,0)_55%),radial-gradient(circle_at_70%_65%,rgba(109,94,247,0.32),rgba(109,94,247,0)_55%)]" />
        </div>
        <div className="relative p-6 md:p-8">
          <div className="flex items-start justify-between gap-4">
            <div>
              <div className="text-2xl font-semibold tracking-tight text-white">{title}</div>
              {body ? <div className="mt-3 text-sm text-white/70">{body}</div> : null}
            </div>
            <button
              type="button"
              onClick={onClose}
              className="glow-hover inline-flex h-10 w-10 items-center justify-center rounded-full bg-white/10 text-white/80 hover:bg-white/14"
              aria-label={t('common_close')}
            >
              <X className="h-5 w-5" />
            </button>
          </div>

          <div className="mt-8 flex gap-3">
            <button
              type="button"
              onClick={onOpen}
              className="glow-hover inline-flex items-center justify-center rounded-full bg-white px-6 py-3 text-sm font-medium text-zinc-900"
            >
              {t('common_open')}
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default function Singer() {
  const { t, lang } = useI18n()
  const [tab, setTab] = useState<SingerTab>('album')
  const [year, setYear] = useState('all')
  const [tag, setTag] = useState('all')
  const [availability, setAvailability] = useState('all')
  const [city, setCity] = useState('all')
  const [listening, setListening] = useState<AlbumItem | null>(null)
  const [sectionOpen, setSectionOpen] = useState<'albums' | 'merch' | 'plugins' | 'tours' | null>(null)

  const type = tab as ItemType
  const items = useMemo(() => getItemsByType(type), [type])
  const settings = useMemo(() => loadSiteSettings(), [])
  const videos = useMemo(() => loadMusicVideos(), [])
  const sections = useMemo(() => loadSingerSections(), [])

  const cityOptions = useMemo(() => {
    const cities = uniqStrings(items.filter((i) => i.type === 'tour').map((i) => i.city ?? '')).filter(Boolean)
    return [{ label: t('singer_all_cities'), value: 'all' }, ...cities.map((c) => ({ label: c, value: c }))]
  }, [items, t])

  const filtered = useMemo(() => applySingerFilters(items, year, tag, { availability, city }), [items, year, tag, availability, city])

  const musicNews = useMemo(() => {
    const out = (getItemsByType('album') as ContentItem[])
      .concat(getItemsByType('merch'))
      .concat(getItemsByType('plugin'))
      .concat(getItemsByType('tour'))
      .slice()
      .sort((a, b) => (Date.parse(b.updatedAt ?? b.publishedAt ?? '') || 0) - (Date.parse(a.updatedAt ?? a.publishedAt ?? '') || 0))
      .slice(0, 8)
    return out
  }, [])

  return (
    <div className="relative space-y-10">
      {settings.singerBackgroundImage ? (
        <div aria-hidden className="pointer-events-none absolute inset-0 -z-10 overflow-hidden">
          <div
            className="absolute inset-0 bg-cover bg-center"
            style={{
              backgroundImage: `url(${settings.singerBackgroundImage})`,
            }}
          />
          <div className="absolute inset-0 bg-gradient-to-b from-[#0B0F14]/35 via-[#0B0F14]/70 to-[#0B0F14]" />
        </div>
      ) : null}

      <PosterHero imageUrl={settings.singerPosterImage ?? '/hero/singer-poster.svg'} className="-mt-10">
        <div className="flex items-end justify-between gap-4">
          <div className="text-sm font-semibold tracking-tight text-white">Lawrence River</div>
          <div className="hidden gap-2 lg:flex">
            <button
              type="button"
              onClick={() => setSectionOpen('tours')}
              className="glow-hover rounded-full border border-white/25 bg-white/0 px-3 py-1.5 text-xs text-white/90 backdrop-blur hover:bg-white/10"
            >
              {t('type_tour')}
            </button>
            <button
              type="button"
              onClick={() => setSectionOpen('merch')}
              className="glow-hover rounded-full border border-white/25 bg-white/0 px-3 py-1.5 text-xs text-white/90 backdrop-blur hover:bg-white/10"
            >
              {t('type_merch')}
            </button>
            <button
              type="button"
              onClick={() => setSectionOpen('plugins')}
              className="glow-hover rounded-full border border-white/25 bg-white/0 px-3 py-1.5 text-xs text-white/90 backdrop-blur hover:bg-white/10"
            >
              {t('type_plugin')}
            </button>
            <button
              type="button"
              onClick={() => setSectionOpen('albums')}
              className="glow-hover rounded-full border border-white/25 bg-white/0 px-3 py-1.5 text-xs text-white/90 backdrop-blur hover:bg-white/10"
            >
              {t('type_album')}
            </button>
          </div>
        </div>
      </PosterHero>

      <section className="relative left-1/2 right-1/2 -ml-[50vw] -mr-[50vw] w-screen">
        <div
          className="h-[160px] w-full md:h-[220px]"
          style={{
            backgroundImage: `url(${settings.singerEraImage ?? '/hero/era.svg'})`,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
          }}
        />
      </section>

      <section className="flex items-center justify-between gap-4">
        <Tabs
          value={tab}
          onChange={(next) => {
            setTab(next)
            setYear('all')
            setTag('all')
            setAvailability('all')
            setCity('all')
          }}
        />
        <div className="text-xs text-zinc-500 dark:text-zinc-400">{t('common_count_items', { n: filtered.length })}</div>
      </section>

      {filtered.length ? (
        tab === 'album' ? (
          <div id="albums">
            <AlbumGrid items={filtered as AlbumItem[]} onListen={(a) => setListening(a)} />
          </div>
        ) : tab === 'merch' ? (
          <div id="merch" className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
            {filtered.map((it) => (
              <ContentCard key={it.id} item={it} />
            ))}
          </div>
        ) : tab === 'plugin' ? (
          <div id="plugins" className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
            {filtered.map((it) => (
              <ContentCard key={it.id} item={it} />
            ))}
          </div>
        ) : (
          <div id="tours" className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
            {filtered.map((it) => (
              <ContentCard key={it.id} item={it} />
            ))}
          </div>
        )
      ) : (
        <section className="rounded-2xl border border-zinc-200 bg-white p-6 text-sm text-zinc-600 dark:border-white/10 dark:bg-white/5 dark:text-zinc-300">
          {t('singer_empty')}
        </section>
      )}

      <section className="space-y-3 pt-6">
        <div className="flex items-baseline justify-between gap-4">
          <div className="text-sm font-semibold tracking-tight">{t('home_latest')}</div>
          <div className="text-xs text-zinc-500 dark:text-zinc-400">{t('home_latest_hint')}</div>
        </div>
        <div className="space-y-3">
          {musicNews.map((it) => (
            <Link
              key={it.id}
              to={`/item/${it.type}/${it.slug}`}
              className="flex items-center justify-between gap-3 rounded-2xl border border-zinc-200 bg-white px-5 py-4 transition hover:border-zinc-300 hover:bg-zinc-50 dark:border-white/10 dark:bg-white/5 dark:hover:border-white/20 dark:hover:bg-white/10"
            >
              <div className="min-w-0">
                <div className="flex flex-wrap items-center gap-2">
                  <span className="rounded-md bg-zinc-100 px-2 py-1 text-xs text-zinc-600 dark:bg-white/10 dark:text-zinc-300">
                    {it.type === 'album'
                      ? t('type_album')
                      : it.type === 'merch'
                        ? t('type_merch')
                        : it.type === 'plugin'
                          ? t('type_plugin')
                          : t('type_tour')}
                  </span>
                  <span className="truncate text-sm font-medium">{it.title}</span>
                </div>
              </div>
              <div className="text-xs text-zinc-500 dark:text-zinc-400">{it.updatedAt ?? it.publishedAt ?? ''}</div>
            </Link>
          ))}
        </div>
      </section>

      {videos.length ? (
        <section id="mv" className="space-y-4 pt-6">
          <div className="flex items-baseline justify-between gap-4">
            <div className="text-sm font-semibold tracking-tight">{t('music_mv')}</div>
          </div>
          <div className="grid grid-cols-1 gap-6">
            {videos.map((v) => (
              <div key={v.youtubeId} className="space-y-3">
                <div className="relative aspect-video overflow-hidden rounded-3xl bg-black shadow-sm shadow-black/[0.18]">
                  <iframe
                    className="absolute inset-0 h-full w-full"
                    src={`https://www.youtube-nocookie.com/embed/${encodeURIComponent(v.youtubeId)}?rel=0&modestbranding=1`}
                    title={v.title}
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                    allowFullScreen
                  />
                </div>
                <div className="text-xs font-medium tracking-wide text-zinc-500 dark:text-zinc-400">
                  {t('home_hero_singer')} · {v.title}
                </div>
              </div>
            ))}
          </div>
        </section>
      ) : null}

      <section className="relative left-1/2 right-1/2 -ml-[50vw] -mr-[50vw] w-screen overflow-hidden bg-[#0B0F14] py-16">
        <div aria-hidden className="pointer-events-none absolute inset-0">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_35%,rgba(255,255,255,0.14),rgba(255,255,255,0)_55%)]" />
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_25%_70%,rgba(109,94,247,0.22),rgba(109,94,247,0)_55%),radial-gradient(circle_at_80%_60%,rgba(77,140,255,0.22),rgba(77,140,255,0)_55%)]" />
        </div>
        <div className="relative mx-auto max-w-[1200px] px-4">
          <div className="text-center">
            <div className="text-4xl font-semibold tracking-tight text-white">Lawrence River</div>
            {settings.socialLinks?.length ? (
              <div className="mt-6 flex justify-center">
                <SocialLinks links={settings.socialLinks} className="text-white" />
              </div>
            ) : null}
            <div className="mt-6 text-xs text-white/70">© {new Date().getFullYear()} Lawrence River. All Rights Reserved.</div>
          </div>
        </div>
      </section>

      {listening ? <ListenNowModal album={listening} onClose={() => setListening(null)} /> : null}
      {sectionOpen ? (
        <SectionModal
          title={(() => {
            const s = sections.find((x) => x.id === sectionOpen)
            if (!s) return sectionOpen
            return lang === 'en' ? s.titleEn ?? s.title : s.title
          })()}
          body={(() => {
            const s = sections.find((x) => x.id === sectionOpen)
            if (!s) return undefined
            return lang === 'en' ? s.bodyEn ?? s.body : s.body
          })()}
          onClose={() => setSectionOpen(null)}
          onOpen={() => {
            const nextTab = sectionOpen === 'plugins' ? 'plugin' : (sectionOpen as SingerTab)
            setTab(nextTab)
            setYear('all')
            setTag('all')
            setAvailability('all')
            setCity('all')
            setSectionOpen(null)
            requestAnimationFrame(() => {
              const el = document.getElementById(sectionOpen)
              el?.scrollIntoView({ behavior: 'smooth', block: 'start' })
            })
          }}
        />
      ) : null}
    </div>
  )
}
