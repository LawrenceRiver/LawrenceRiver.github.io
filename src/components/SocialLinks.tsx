import { cn } from '@/lib/utils'

type SocialId = 'instagram' | 'youtube' | 'spotify' | 'bilibili' | 'rednote' | 'tiktok' | 'douyin'

function Icon({ id }: { id: SocialId }) {
  const common = { width: 22, height: 22, viewBox: '0 0 24 24' }
  if (id === 'instagram') {
    return (
      <svg {...common} fill="none" xmlns="http://www.w3.org/2000/svg">
        <rect x="4" y="4" width="16" height="16" rx="5" stroke="currentColor" strokeWidth="1.6" />
        <circle cx="12" cy="12" r="3.5" stroke="currentColor" strokeWidth="1.6" />
        <circle cx="17" cy="7" r="1" fill="currentColor" />
      </svg>
    )
  }
  if (id === 'youtube') {
    return (
      <svg {...common} fill="none" xmlns="http://www.w3.org/2000/svg">
        <path
          d="M10.1 8.7 16 12l-5.9 3.3V8.7Z"
          fill="currentColor"
        />
        <path
          d="M21 12c0 2.2-.2 3.6-.5 4.4a2.6 2.6 0 0 1-1.6 1.6c-.9.3-2.8.5-6.9.5s-6-.2-6.9-.5a2.6 2.6 0 0 1-1.6-1.6C3.2 15.6 3 14.2 3 12s.2-3.6.5-4.4A2.6 2.6 0 0 1 5.1 6c.9-.3 2.8-.5 6.9-.5s6 .2 6.9.5a2.6 2.6 0 0 1 1.6 1.6c.3.8.5 2.2.5 4.4Z"
          stroke="currentColor"
          strokeWidth="1.4"
        />
      </svg>
    )
  }
  if (id === 'spotify') {
    return (
      <svg {...common} fill="none" xmlns="http://www.w3.org/2000/svg">
        <circle cx="12" cy="12" r="8" stroke="currentColor" strokeWidth="1.4" />
        <path d="M7.7 11.1c3.4-1.1 6.8-.8 9.8.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" opacity="0.9" />
        <path d="M8.2 13.3c2.8-.8 5.5-.6 7.8.5" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" opacity="0.75" />
        <path d="M8.7 15.3c2.1-.5 4.1-.4 5.7.4" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" opacity="0.6" />
      </svg>
    )
  }
  if (id === 'bilibili') {
    return (
      <svg {...common} fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M8 7 6.3 5.7M16 7l1.7-1.3" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" />
        <rect x="5" y="7" width="14" height="11" rx="3" stroke="currentColor" strokeWidth="1.4" />
        <path d="M9 11.5h.01M15 11.5h.01" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" />
      </svg>
    )
  }
  if (id === 'rednote') {
    return (
      <svg {...common} fill="none" xmlns="http://www.w3.org/2000/svg">
        <rect x="5" y="4.5" width="14" height="15" rx="3" stroke="currentColor" strokeWidth="1.4" />
        <path d="M8 9h8M8 12h6M8 15h7" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" opacity="0.9" />
      </svg>
    )
  }
  if (id === 'tiktok' || id === 'douyin') {
    return (
      <svg {...common} fill="none" xmlns="http://www.w3.org/2000/svg">
        <path
          d="M14 6c.7 1.8 2 3 4 3v2c-1.6 0-3-.6-4-1.6V15a4 4 0 1 1-4-4h1v2h-1a2 2 0 1 0 2 2V6h2Z"
          fill="currentColor"
          opacity="0.95"
        />
      </svg>
    )
  }
  return null
}

export default function SocialLinks({
  links,
  className,
}: {
  links: { id: string; url: string }[]
  className?: string
}) {
  const normalized = links
    .map((l) => ({ id: String(l.id).toLowerCase(), url: l.url }))
    .filter((l) => ['instagram', 'youtube', 'spotify', 'bilibili', 'rednote', 'tiktok', 'douyin'].includes(l.id)) as {
    id: SocialId
    url: string
  }[]

  if (!normalized.length) return null

  return (
    <div className={cn('flex flex-wrap items-center gap-3', className)}>
      {normalized.map((l) => (
        <a
          key={l.id}
          href={l.url}
          target="_blank"
          rel="noreferrer"
          className="glow-hover inline-flex h-10 w-10 items-center justify-center rounded-full bg-white/0 text-white/65 transition hover:text-white"
          aria-label={l.id}
          title={l.id}
        >
          <Icon id={l.id} />
        </a>
      ))}
    </div>
  )
}

