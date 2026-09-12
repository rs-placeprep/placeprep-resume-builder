import { useEffect, useRef, useState } from 'react'
import { Info } from 'lucide-react'
import clsx from 'clsx'

interface InfoPopoverProps {
  children: React.ReactNode
  label?: string
  tone?: 'default' | 'warning'
}

export function InfoPopover({ children, label = 'More information', tone = 'default' }: InfoPopoverProps) {
  const [open, setOpen] = useState(false)
  const wrapRef = useRef<HTMLSpanElement>(null)

  useEffect(() => {
    if (!open) return
    const onDown = (e: PointerEvent) => {
      if (!wrapRef.current?.contains(e.target as Node)) setOpen(false)
    }
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && setOpen(false)
    document.addEventListener('pointerdown', onDown, true)
    document.addEventListener('keydown', onKey)
    return () => {
      document.removeEventListener('pointerdown', onDown, true)
      document.removeEventListener('keydown', onKey)
    }
  }, [open])

  return (
    <span ref={wrapRef} className="relative inline-flex">
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        aria-label={label}
        aria-expanded={open}
        className={clsx(
          'inline-flex h-5 w-5 items-center justify-center rounded-full border transition-colors',
          tone === 'warning'
            ? 'border-amber-500/40 text-amber-600 hover:bg-amber-500/10 dark:text-amber-400'
            : 'border-border text-muted-foreground hover:border-primary/40 hover:text-primary',
        )}
      >
        <Info className="h-3 w-3" />
      </button>

      {open && (
        <span className="animate-fade-up absolute left-1/2 top-7 z-50 w-64 -translate-x-1/2 rounded-xl border border-border bg-card p-3 text-left text-xs font-normal leading-relaxed text-muted-foreground shadow-[0_20px_50px_-16px_rgba(0,0,0,0.35)] dark:shadow-[0_20px_50px_-12px_rgba(0,0,0,0.75)]">
          {children}
        </span>
      )}
    </span>
  )
}
