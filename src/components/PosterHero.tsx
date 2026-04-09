import { cn } from '@/lib/utils'

export default function PosterHero({
  imageUrl,
  className,
  children,
}: {
  imageUrl: string
  className?: string
  children?: React.ReactNode
}) {
  return (
    <section className={cn('relative left-1/2 right-1/2 -ml-[50vw] -mr-[50vw] w-screen', className)}>
      <div className="relative mx-auto max-w-none">
        <div
          className="relative h-[460px] w-full overflow-hidden md:h-[620px]"
          style={{
            backgroundImage: `url(${imageUrl})`,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
          }}
        >
          <div className="absolute inset-0 bg-gradient-to-t from-black/65 via-black/10 to-black/0" />
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_20%,rgba(255,255,255,0.22),rgba(255,255,255,0)_55%)] mix-blend-overlay" />
          {children ? <div className="absolute inset-x-0 bottom-0 px-5 pb-5 md:px-8 md:pb-8">{children}</div> : null}
        </div>
      </div>
    </section>
  )
}
