import { cn } from '@/lib/utils'

export type SelectOption = { label: string; value: string }

export default function FilterBar({
  className,
  children,
}: {
  className?: string
  children: React.ReactNode
}) {
  return (
    <div
      className={cn(
        'flex flex-col gap-3 rounded-2xl border border-zinc-200/80 bg-white/75 p-4 shadow-sm shadow-black/[0.02] backdrop-blur dark:border-white/10 dark:bg-white/5 dark:shadow-black/0 md:flex-row md:items-center md:gap-4',
        className,
      )}
    >
      {children}
    </div>
  )
}

export function Select({
  label,
  value,
  onChange,
  options,
}: {
  label: string
  value: string
  onChange: (next: string) => void
  options: SelectOption[]
}) {
  return (
    <label className="flex items-center gap-2 text-sm text-zinc-600 dark:text-zinc-300">
      <span className="whitespace-nowrap text-xs text-zinc-500 dark:text-zinc-400">{label}</span>
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="rounded-xl border border-zinc-200 bg-white px-3 py-2 text-sm text-zinc-900 outline-none transition focus:border-zinc-300 dark:border-white/10 dark:bg-white/5 dark:text-zinc-100 dark:focus:border-white/20"
      >
        {options.map((o) => (
          <option key={o.value} value={o.value}>
            {o.label}
          </option>
        ))}
      </select>
    </label>
  )
}
