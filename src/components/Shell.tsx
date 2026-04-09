import { Outlet } from 'react-router-dom'
import Footer from './Footer'
import TopNav from './TopNav'

export default function Shell() {
  return (
    <div className="relative min-h-dvh bg-white text-zinc-950 dark:bg-[#0B0F14] dark:text-zinc-100">
      <div aria-hidden className="pointer-events-none absolute inset-0 -z-10 overflow-hidden">
        <div className="absolute -top-48 left-1/2 h-[520px] w-[900px] -translate-x-1/2 rounded-full bg-[#6D5EF7]/20 blur-3xl dark:bg-[#6D5EF7]/15" />
        <div className="absolute bottom-[-260px] right-[-160px] h-[520px] w-[520px] rounded-full bg-cyan-400/10 blur-3xl dark:bg-cyan-400/10" />
        <div className="absolute inset-0 bg-[linear-gradient(to_right,rgba(0,0,0,0.04)_1px,transparent_1px),linear-gradient(to_bottom,rgba(0,0,0,0.04)_1px,transparent_1px)] bg-[size:48px_48px] dark:bg-[linear-gradient(to_right,rgba(255,255,255,0.06)_1px,transparent_1px),linear-gradient(to_bottom,rgba(255,255,255,0.06)_1px,transparent_1px)]" />
        <div className="absolute inset-0 bg-gradient-to-b from-white/70 via-white/85 to-white dark:from-[#0B0F14]/55 dark:via-[#0B0F14]/75 dark:to-[#0B0F14]" />
      </div>
      <TopNav />
      <main className="container max-w-[1200px] px-4 pb-16 pt-8">
        <Outlet />
      </main>
      <Footer />
    </div>
  )
}
