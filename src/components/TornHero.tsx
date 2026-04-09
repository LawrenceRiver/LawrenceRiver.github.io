import { Link } from 'react-router-dom'
import { cn } from '@/lib/utils'

export default function TornHero({
  left,
  right,
}: {
  left: { title: string; href: string; imageUrl: string; cta: string }
  right: { title: string; href: string; imageUrl: string; cta: string }
}) {
  return (
    <section className="relative overflow-hidden rounded-xl border border-zinc-200/80 bg-white/40 shadow-sm shadow-black/[0.02] backdrop-blur dark:border-white/10 dark:bg-white/5 dark:shadow-black/0">
      <div className="relative grid min-h-[240px] grid-cols-1 md:min-h-[320px] md:grid-cols-2">
        <div
          className={cn(
            'relative flex items-end overflow-hidden p-6 md:p-8',
            "before:absolute before:inset-0 before:bg-cover before:bg-center before:opacity-90 before:content-['']",
          )}
          style={{
            clipPath: 'polygon(0 0, 100% 0, 96% 100%, 0 100%)',
          }}
        >
          <div
            className="absolute inset-0 bg-cover bg-center"
            style={{
              backgroundImage: `url(${left.imageUrl})`,
            }}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/10 to-black/10 dark:from-black/80" />
          <Link to={left.href} aria-label={left.title} className="absolute inset-0 z-10" />
          <div className="absolute bottom-6 left-6 z-20 text-sm font-semibold tracking-tight text-white/55 md:bottom-8 md:left-8 md:text-base">
            {left.title}
          </div>
        </div>

        <div
          className="relative flex items-end overflow-hidden p-6 md:p-8"
          style={{
            clipPath: 'polygon(4% 0, 100% 0, 100% 100%, 0 100%)',
          }}
        >
          <div
            className="absolute inset-0 bg-cover bg-center"
            style={{
              backgroundImage: `url(${right.imageUrl})`,
            }}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/10 to-black/10 dark:from-black/80" />
          <Link to={right.href} aria-label={right.title} className="absolute inset-0 z-10" />
          <div className="absolute right-6 top-6 z-20 text-sm font-semibold tracking-tight text-white/55 md:right-8 md:top-8 md:text-base">
            {right.title}
          </div>
        </div>

        <div aria-hidden className="pointer-events-none absolute inset-y-0 left-1/2 w-[92px] -translate-x-1/2 md:w-[140px]">
          <div className="absolute inset-y-0 left-1/2 w-[160px] -translate-x-1/2 md:w-[220px]">
            <div className="absolute inset-0 bg-[linear-gradient(to_right,rgba(0,0,0,0),rgba(0,0,0,0.32),rgba(0,0,0,0))] blur-[10px]" />
            <div className="absolute inset-0 bg-[linear-gradient(to_right,rgba(255,255,255,0),rgba(255,255,255,0.06),rgba(255,255,255,0))]" />
          </div>
          <div
            className="absolute inset-0"
            style={{
              clipPath:
                'polygon(45% 0, 55% 0, 60% 8%, 46% 14%, 58% 24%, 44% 32%, 56% 40%, 42% 48%, 58% 60%, 44% 70%, 58% 80%, 46% 88%, 60% 100%, 40% 100%, 52% 92%, 38% 86%, 52% 78%, 40% 70%, 54% 62%, 38% 54%, 54% 46%, 40% 38%, 54% 28%, 40% 20%, 52% 12%, 40% 4%)',
              background:
                'linear-gradient(to bottom, rgba(255,255,255,0.10), rgba(255,255,255,0.02)), repeating-linear-gradient(135deg, rgba(255,255,255,0.14), rgba(255,255,255,0.14) 2px, rgba(255,255,255,0) 2px, rgba(255,255,255,0) 8px)',
              opacity: 1,
            }}
          />
          <div
            className="absolute inset-0 bg-black/25 blur-[2px]"
            style={{
              clipPath:
                'polygon(45% 0, 55% 0, 60% 8%, 46% 14%, 58% 24%, 44% 32%, 56% 40%, 42% 48%, 58% 60%, 44% 70%, 58% 80%, 46% 88%, 60% 100%, 40% 100%, 52% 92%, 38% 86%, 52% 78%, 40% 70%, 54% 62%, 38% 54%, 54% 46%, 40% 38%, 54% 28%, 40% 20%, 52% 12%, 40% 4%)',
            }}
          />
        </div>
      </div>
    </section>
  )
}
