import { Link, NavLink, useNavigate } from 'react-router-dom'
import { Moon, Search, Sun } from 'lucide-react'
import { useMemo, useState } from 'react'
import { cn } from '@/lib/utils'
import { useTheme } from '@/hooks/useTheme'
import { useI18n } from '@/i18n'

function NavItem({ to, label }: { to: string; label: string }) {
  return (
    <NavLink
      to={to}
      className={({ isActive }) =>
        cn(
          'rounded-md px-3 py-2 text-sm transition-colors hover:bg-zinc-100 dark:hover:bg-white/10',
          isActive && 'bg-zinc-100 text-zinc-950 dark:bg-white/10 dark:text-white',
        )
      }
    >
      {label}
    </NavLink>
  )
}

export default function TopNav() {
  const { isDark, toggleTheme } = useTheme()
  const { lang, setLang, t } = useI18n()
  const navigate = useNavigate()
  const [q, setQ] = useState('')

  const placeholder = useMemo(() => t('nav_search_placeholder'), [t])

  return (
    <header className="sticky top-0 z-20 border-b border-zinc-200/70 bg-white/80 backdrop-blur dark:border-white/10 dark:bg-[#0B0F14]/70">
      <div className="container flex max-w-[1200px] items-center gap-3 px-4 py-3">
        <Link to="/" className="flex items-center gap-2 rounded-md px-2 py-1 hover:bg-zinc-100 dark:hover:bg-white/10">
          <span className="text-sm font-semibold tracking-tight">Lawrence River</span>
          <span className="hidden text-xs text-zinc-500 dark:text-zinc-400 md:inline">{t('nav_tagline')}</span>
        </Link>

        <nav className="hidden items-center gap-1 md:flex">
          <NavItem to="/" label={t('nav_home')} />
          <NavItem to="/singer" label={t('nav_singer')} />
          <NavItem to="/research" label={t('nav_research')} />
        </nav>

        <div className="ml-auto flex flex-1 items-center gap-2 md:flex-none">
          <form
            className="hidden w-full max-w-[520px] items-center gap-2 md:flex"
            onSubmit={(e) => {
              e.preventDefault()
              const trimmed = q.trim()
              navigate(trimmed ? `/?q=${encodeURIComponent(trimmed)}` : '/')
            }}
          >
            <div className="relative w-full">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-zinc-500" />
              <input
                value={q}
                onChange={(e) => setQ(e.target.value)}
                placeholder={placeholder}
                className="w-full rounded-xl border border-zinc-200/80 bg-white/70 px-9 py-2 text-sm outline-none backdrop-blur transition focus:border-zinc-300 dark:border-white/10 dark:bg-white/5 dark:focus:border-white/20"
              />
            </div>
          </form>

          <button
            type="button"
            onClick={() => setLang(lang === 'zh' ? 'en' : 'zh')}
            className="glow-hover inline-flex items-center justify-center rounded-xl border border-zinc-200/80 bg-white/70 px-3 py-2 text-xs font-medium backdrop-blur transition hover:bg-white dark:border-white/10 dark:bg-white/5 dark:hover:bg-white/10"
            aria-label={t('nav_toggle_lang')}
          >
            {lang === 'zh' ? 'EN' : '中文'}
          </button>

          <button
            type="button"
            onClick={toggleTheme}
            className="glow-hover inline-flex items-center justify-center rounded-xl border border-zinc-200/80 bg-white/70 px-3 py-2 text-sm backdrop-blur transition hover:bg-white dark:border-white/10 dark:bg-white/5 dark:hover:bg-white/10"
            aria-label="Toggle theme"
          >
            {isDark ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
          </button>
        </div>
      </div>
    </header>
  )
}
