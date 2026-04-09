import { Link, useParams } from 'react-router-dom'
import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
import rehypeHighlight from 'rehype-highlight'
import { ExternalLink, FileText, ShoppingBag, Ticket } from 'lucide-react'
import { getItemByTypeAndSlug } from '@/content'
import type { ItemType } from '@/content/types'
import { formatDate } from '@/utils/content'
import { pickByLang, useI18n } from '@/i18n'

function ActionLink({ label, href, icon }: { label: string; href: string; icon: React.ReactNode }) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noreferrer"
      className="glow-hover inline-flex w-full items-center justify-between gap-3 rounded-xl border border-zinc-200 bg-white px-4 py-3 text-sm transition hover:bg-zinc-100 dark:border-white/10 dark:bg-white/5 dark:hover:bg-white/10"
    >
      <span className="inline-flex items-center gap-2">
        {icon}
        {label}
      </span>
      <ExternalLink className="h-4 w-4 text-zinc-500" />
    </a>
  )
}

export default function ItemDetail() {
  const { lang, t } = useI18n()
  const params = useParams()
  const type = (params.type ?? '') as ItemType
  const slug = params.slug ?? ''

  const item = getItemByTypeAndSlug(type, slug)

  if (!item) {
    return (
      <div className="rounded-2xl border border-zinc-200 bg-white p-8 text-sm text-zinc-600 dark:border-white/10 dark:bg-white/5 dark:text-zinc-300">
        {t('common_not_found')}{' '}
        <Link to="/" className="text-[#6D5EF7] hover:underline">
          {t('common_back_home')}
        </Link>
      </div>
    )
  }

  const title = pickByLang(lang, item.title, item.titleEn)

  const lineA: string[] = []
  if (item.type === 'paper') {
    if (item.authors?.length) lineA.push(item.authors.join(', '))
    if (item.venue) lineA.push(item.venue)
    if (item.year) lineA.push(String(item.year))
  }
  if (item.type === 'album') {
    if (item.artist) lineA.push(item.artist)
    if (item.releaseDate) lineA.push(item.releaseDate)
  }
  if (item.type === 'merch') {
    if (item.availabilityStatus) {
      lineA.push(
        item.availabilityStatus === 'available'
          ? t('singer_status_available')
          : item.availabilityStatus === 'sold_out'
            ? t('singer_status_sold_out')
            : t('singer_status_coming_soon'),
      )
    }
    if (item.price) lineA.push(item.price)
  }

  if (item.type === 'plugin') {
    if (item.availabilityStatus) {
      lineA.push(
        item.availabilityStatus === 'available'
          ? t('singer_status_available')
          : item.availabilityStatus === 'sold_out'
            ? t('singer_status_sold_out')
            : t('singer_status_coming_soon'),
      )
    }
    if (item.price) lineA.push(item.price)
  }
  if (item.type === 'tour') {
    if (item.eventDate) lineA.push(item.eventDate)
    if (item.city) lineA.push(item.city)
    if (item.venueName) lineA.push(item.venueName)
  }

  const links: { label: string; url: string; kind: 'pdf' | 'code' | 'platform' | 'buy' | 'ticket' | 'external' }[] = []
  if (item.type === 'paper') {
    if (item.pdfUrl) links.push({ label: 'PDF', url: item.pdfUrl, kind: 'pdf' })
    if (item.codeUrl) links.push({ label: 'Code', url: item.codeUrl, kind: 'code' })
  }
  if (item.type === 'album') {
    for (const l of item.platformLinks ?? []) links.push({ label: l.label, url: l.url, kind: 'platform' })
  }
  if (item.type === 'merch') {
    for (const l of item.buyLinks ?? []) links.push({ label: l.label, url: l.url, kind: 'buy' })
  }
  if (item.type === 'plugin') {
    for (const l of item.buyLinks ?? []) links.push({ label: l.label, url: l.url, kind: 'buy' })
  }
  if (item.type === 'tour') {
    for (const l of item.ticketLinks ?? []) links.push({ label: l.label, url: l.url, kind: 'ticket' })
  }
  for (const l of item.externalLinks ?? []) links.push({ label: l.label, url: l.url, kind: 'external' })

  const typeLabel =
    item.type === 'paper'
      ? t('type_paper')
      : item.type === 'album'
        ? t('type_album')
        : item.type === 'merch'
          ? t('type_merch')
          : item.type === 'plugin'
            ? t('type_plugin')
            : t('type_tour')

  return (
    <div className="space-y-8">
      <div className="text-xs text-zinc-500 dark:text-zinc-400">
        <Link to="/" className="hover:underline">
          {t('nav_home')}
        </Link>
        <span className="px-2">/</span>
        {type === 'paper' ? (
          <Link to="/research" className="hover:underline">
            {t('nav_research')}
          </Link>
        ) : (
          <Link to="/singer" className="hover:underline">
            {t('nav_singer')}
          </Link>
        )}
        <span className="px-2">/</span>
        <span>{typeLabel}</span>
      </div>

      <header className="space-y-3">
        <div className="flex flex-wrap items-center gap-2">
          <span className="rounded-md bg-zinc-100 px-2 py-1 text-xs text-zinc-600 dark:bg-white/10 dark:text-zinc-300">
            {typeLabel}
          </span>
          {(item.updatedAt || item.publishedAt) && (
            <span className="text-xs text-zinc-500 dark:text-zinc-400">{formatDate(item.updatedAt ?? item.publishedAt)}</span>
          )}
        </div>

        <h1 className="text-2xl font-semibold tracking-tight md:text-3xl">{title}</h1>

        {lineA.length ? <div className="text-sm text-zinc-600 dark:text-zinc-300">{lineA.join(' · ')}</div> : null}

        {item.tags.length ? (
          <div className="flex flex-wrap gap-2">
            {item.tags.map((t) => (
              <span
                key={t}
                className="inline-flex items-center rounded-full border border-zinc-200 bg-white px-2.5 py-1 text-xs text-zinc-600 dark:border-white/10 dark:bg-white/5 dark:text-zinc-300"
              >
                {t}
              </span>
            ))}
          </div>
        ) : null}
      </header>

      <div className="grid grid-cols-1 gap-8 lg:grid-cols-[1fr_320px]">
        <article className="rounded-3xl border border-zinc-200 bg-white p-6 dark:border-white/10 dark:bg-white/5 md:p-8">
          <div className="markdown">
            <ReactMarkdown remarkPlugins={[remarkGfm]} rehypePlugins={[rehypeHighlight]}>
              {item.body}
            </ReactMarkdown>
          </div>
        </article>

        <aside className="space-y-3">
          {item.type === 'merch' || item.type === 'plugin' ? (
            <div className="rounded-3xl border border-zinc-200 bg-white p-5 dark:border-white/10 dark:bg-white/5">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <div className="text-xs font-medium text-zinc-500 dark:text-zinc-400">{typeLabel}</div>
                  <div className="mt-1 text-sm font-semibold tracking-tight">{title}</div>
                </div>
                <div className="text-right">
                  {item.price ? <div className="text-sm font-semibold">{item.price}</div> : null}
                  {item.availabilityStatus ? (
                    <div className="mt-1 text-xs text-zinc-500 dark:text-zinc-400">
                      {item.availabilityStatus === 'available'
                        ? t('singer_status_available')
                        : item.availabilityStatus === 'sold_out'
                          ? t('singer_status_sold_out')
                          : t('singer_status_coming_soon')}
                    </div>
                  ) : null}
                </div>
              </div>

              <div className="mt-4 space-y-2">
                {links
                  .filter((l) => l.kind === 'buy')
                  .map((l) => (
                    <a
                      key={`buy:${l.label}`}
                      href={l.url}
                      target="_blank"
                      rel="noreferrer"
                      className="glow-hover inline-flex w-full items-center justify-center rounded-xl bg-gradient-to-r from-[#6D5EF7] to-[#4D8CFF] px-4 py-3 text-sm font-medium text-white"
                    >
                      {l.label}
                    </a>
                  ))}
              </div>
            </div>
          ) : null}

          <div className="rounded-3xl border border-zinc-200 bg-white p-5 dark:border-white/10 dark:bg-white/5">
            <div className="text-xs font-medium text-zinc-500 dark:text-zinc-400">{t('common_actions')}</div>
            <div className="mt-4 space-y-2">
              {links.map((l) => (
                <ActionLink
                  key={`${l.kind}:${l.label}`}
                  label={l.label}
                  href={l.url}
                  icon={
                    l.kind === 'pdf' ? (
                      <FileText className="h-4 w-4" />
                    ) : l.kind === 'buy' ? (
                      <ShoppingBag className="h-4 w-4" />
                    ) : l.kind === 'ticket' ? (
                      <Ticket className="h-4 w-4" />
                    ) : (
                      <ExternalLink className="h-4 w-4" />
                    )
                  }
                />
              ))}
              {!links.length ? (
                <div className="rounded-2xl border border-zinc-200 bg-white p-4 text-sm text-zinc-600 dark:border-white/10 dark:bg-white/5 dark:text-zinc-300">
                  {t('common_no_links')}
                </div>
              ) : null}
            </div>
          </div>

          <Link
            to={type === 'paper' ? '/research' : '/singer'}
            className="glow-hover inline-flex w-full items-center justify-center rounded-xl border border-zinc-200 bg-white px-4 py-3 text-sm transition hover:bg-zinc-100 dark:border-white/10 dark:bg-white/5 dark:hover:bg-white/10"
          >
            {t('common_back_list')}
          </Link>
        </aside>
      </div>
    </div>
  )
}
