import { Link } from 'react-router-dom'
import type { ContentItem } from '@/content/types'
import { cn } from '@/lib/utils'
import TagPill from './TagPill'
import { formatDate } from '@/utils/content'
import { useI18n, pickByLang } from '@/i18n'

export default function ContentCard({ item, compact }: { item: ContentItem; compact?: boolean }) {
  const { lang, t } = useI18n()
  const title = pickByLang(lang, item.title, item.titleEn)
  const summary = pickByLang(lang, item.summary, item.summaryEn)
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
    <Link
      to={`/item/${item.type}/${item.slug}`}
      className={cn(
        'group block rounded-2xl border border-zinc-200/80 bg-white/75 p-5 shadow-sm shadow-black/[0.02] backdrop-blur transition hover:border-zinc-300 hover:shadow-md hover:shadow-black/[0.04] dark:border-white/10 dark:bg-white/5 dark:shadow-black/0 dark:hover:border-white/20',
        compact && 'p-4',
      )}
    >
      <div className="flex items-start gap-3">
        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-center gap-2">
            <span className="rounded-md bg-zinc-100 px-2 py-1 text-xs text-zinc-600 dark:bg-white/10 dark:text-zinc-300">
              {typeLabel}
            </span>
            {(item.updatedAt || item.publishedAt) && (
              <span className="text-xs text-zinc-500 dark:text-zinc-400">{formatDate(item.updatedAt ?? item.publishedAt)}</span>
            )}
            {item.pinned && (
              <span className="rounded-md bg-[#6D5EF7]/10 px-2 py-1 text-xs text-[#6D5EF7]">{t('home_pinned')}</span>
            )}
          </div>

          <div className="mt-2 line-clamp-2 text-sm font-semibold tracking-tight text-zinc-950 group-hover:text-zinc-800 dark:text-white dark:group-hover:text-zinc-100">
            {title}
          </div>

          {summary ? (
            <div className="mt-2 line-clamp-2 text-sm text-zinc-600 dark:text-zinc-300">{summary}</div>
          ) : null}

          {item.tags.length ? (
            <div className="mt-3 flex flex-wrap gap-2">
              {item.tags.slice(0, 4).map((t) => (
                <TagPill key={t} label={t} />
              ))}
              {item.tags.length > 4 ? <TagPill label={`+${item.tags.length - 4}`} /> : null}
            </div>
          ) : null}
        </div>
      </div>
    </Link>
  )
}
