import { useI18n } from '@/i18n'

export default function Footer() {
  const { t } = useI18n()

  return (
    <footer className="border-t border-zinc-200/70 dark:border-white/10">
      <div className="container max-w-[1200px] px-4 py-10">
        <div className="flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
          <div className="text-sm text-zinc-600 dark:text-zinc-400">
            © {new Date().getFullYear()} Lawrence River · LIAO Honglin
          </div>
          <div className="text-xs text-zinc-500 dark:text-zinc-500">
            {t('footer_line')}
          </div>
        </div>
      </div>
    </footer>
  )
}
