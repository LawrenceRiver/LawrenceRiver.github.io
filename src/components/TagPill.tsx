import { cn } from '@/lib/utils'

export default function TagPill({ label, active }: { label: string; active?: boolean }) {
  return (
    <span
      className={cn(
        'inline-flex items-center rounded-full border px-2.5 py-1 text-xs',
        active
          ? 'border-[#6D5EF7]/40 bg-[#6D5EF7]/10 text-[#6D5EF7] dark:border-[#6D5EF7]/50'
          : 'border-zinc-200 bg-white text-zinc-600 dark:border-white/10 dark:bg-white/5 dark:text-zinc-300',
      )}
    >
      {label}
    </span>
  )
}
