import { cn } from '@/lib/utils'

function hashToHue(input: string) {
  let h = 0
  for (let i = 0; i < input.length; i++) h = (h * 31 + input.charCodeAt(i)) >>> 0
  return h % 360
}

export default function VenuePill({ label, className }: { label: string; className?: string }) {
  const hue = hashToHue(label)
  const bg = `hsla(${hue}, 80%, 55%, 0.22)`
  const border = `hsla(${hue}, 90%, 60%, 0.35)`
  const text = `hsla(${hue}, 95%, 70%, 1)`

  return (
    <span
      className={cn(
        'inline-flex min-w-[92px] items-center justify-center rounded-md border px-3 py-1 text-xs font-semibold tracking-wide',
        className,
      )}
      style={{ backgroundColor: bg, borderColor: border, color: text }}
    >
      {label}
    </span>
  )
}

