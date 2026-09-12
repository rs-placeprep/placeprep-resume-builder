import { useEffect, useState } from 'react'
import { List, X } from 'lucide-react'

export interface TocItem {
  id: string
  label: string
}

function useActiveSection(items: TocItem[]) {
  const [activeId, setActiveId] = useState(items[0]?.id ?? '')
  const [progress, setProgress] = useState(0)

  useEffect(() => {
    const onScroll = () => {
      const doc = document.documentElement
      const max = doc.scrollHeight - doc.clientHeight
      setProgress(max > 0 ? Math.min(1, Math.max(0, doc.scrollTop / max)) : 0)

      const line = doc.clientHeight * 0.3
      let current = items[0]?.id ?? ''
      for (const item of items) {
        const el = document.getElementById(item.id)
        if (el && el.getBoundingClientRect().top <= line) current = item.id
      }
      setActiveId(current)
    }

    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    window.addEventListener('resize', onScroll)
    return () => {
      window.removeEventListener('scroll', onScroll)
      window.removeEventListener('resize', onScroll)
    }
  }, [items])

  return { activeId, progress }
}

function TocList({ items, activeId, onNavigate }: { items: TocItem[]; activeId: string; onNavigate?: () => void }) {
  const activeIndex = Math.max(0, items.findIndex((i) => i.id === activeId))

  return (
    <ol className="relative space-y-1">
      <span aria-hidden="true" className="absolute inset-y-0 left-0 w-0.5 rounded-full bg-border" />
      <span
        aria-hidden="true"
        className="absolute left-0 top-0 w-0.5 rounded-full bg-primary transition-all duration-300"
        style={{ height: `${((activeIndex + 1) / items.length) * 100}%` }}
      />

      {items.map((item, i) => {
        const done = i <= activeIndex
        const active = item.id === activeId
        return (
          <li key={item.id}>
            <a
              href={`#${item.id}`}
              onClick={onNavigate}
              aria-current={active ? 'true' : undefined}
              className={`block py-1.5 pl-4 text-sm leading-snug transition-colors ${
                active
                  ? 'font-medium text-primary'
                  : done
                    ? 'text-foreground/70 hover:text-primary'
                    : 'text-muted-foreground hover:text-primary'
              }`}
            >
              {item.label}
            </a>
          </li>
        )
      })}
    </ol>
  )
}

export function GuideToc({ items }: { items: TocItem[] }) {
  const { activeId, progress } = useActiveSection(items)
  const [open, setOpen] = useState(false)

  useEffect(() => {
    if (!open) return
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && setOpen(false)
    document.addEventListener('keydown', onKey)
    return () => document.removeEventListener('keydown', onKey)
  }, [open])

  const pct = Math.round(progress * 100)

  return (
    <>
      <nav className="sticky top-24 hidden lg:block">
        <div className="mb-3 flex items-center justify-between gap-2">
          <p className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">On this page</p>
          <span className="text-xs font-medium tabular-nums text-muted-foreground">{pct}%</span>
        </div>
        <div className="mb-4 h-1 overflow-hidden rounded-full bg-border">
          <div className="h-full rounded-full bg-primary transition-all duration-200" style={{ width: `${pct}%` }} />
        </div>
        <TocList items={items} activeId={activeId} />
      </nav>

      <button
        type="button"
        onClick={() => setOpen(true)}
        aria-label="Open table of contents"
        className="fixed bottom-5 left-1/2 z-40 flex -translate-x-1/2 items-center gap-2 rounded-full border border-border bg-card/95 py-2.5 pl-4 pr-2.5 shadow-lg backdrop-blur-md transition-transform active:scale-95 lg:hidden"
      >
        <List className="h-4 w-4 text-muted-foreground" />
        <span className="max-w-[44vw] truncate text-xs font-medium">
          {items.find((i) => i.id === activeId)?.label ?? 'Contents'}
        </span>
        <span className="relative inline-flex h-7 w-7 items-center justify-center">
          <svg viewBox="0 0 36 36" className="absolute inset-0 -rotate-90">
            <circle cx="18" cy="18" r="15" fill="none" strokeWidth="3" className="stroke-border" />
            <circle
              cx="18"
              cy="18"
              r="15"
              fill="none"
              strokeWidth="3"
              strokeLinecap="round"
              className="stroke-primary transition-all duration-200"
              strokeDasharray={2 * Math.PI * 15}
              strokeDashoffset={2 * Math.PI * 15 * (1 - progress)}
            />
          </svg>
          <span className="text-[9px] font-bold tabular-nums text-primary">{pct}</span>
        </span>
      </button>

      {open && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <div className="absolute inset-0 bg-black/50 backdrop-blur-[2px]" onClick={() => setOpen(false)} />
          <div className="animate-fade-up absolute inset-x-0 bottom-0 max-h-[70vh] overflow-y-auto rounded-t-2xl border-t border-border bg-background p-4 pb-8 shadow-2xl">
            <div className="mb-3 flex items-center justify-between">
              <p className="text-sm font-semibold">On this page</p>
              <button
                type="button"
                onClick={() => setOpen(false)}
                aria-label="Close table of contents"
                className="btn-icon h-8 w-8"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
            <TocList items={items} activeId={activeId} onNavigate={() => setOpen(false)} />
          </div>
        </div>
      )}
    </>
  )
}
