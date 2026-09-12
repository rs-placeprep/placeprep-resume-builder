import { useEffect } from 'react'
import { ArrowUpRight, FileText, RotateCcw, X } from 'lucide-react'
import { GithubIcon, LinkedinIcon, XIcon, DiscordIcon } from '@/components/icons/social-icons'

interface Props {
  open: boolean
  onClose: () => void
  onReset?: () => void
  onLoadSample?: () => void
}

const SOCIALS = [
  { icon: GithubIcon, href: '#', label: 'GitHub' },
  { icon: LinkedinIcon, href: '#', label: 'LinkedIn' },
  { icon: XIcon, href: '#', label: 'X' },
  { icon: DiscordIcon, href: '#', label: 'Discord' },
]

export function MobileNav({ open, onClose, onReset, onLoadSample }: Props) {
  useEffect(() => {
    if (!open) return
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && onClose()
    document.addEventListener('keydown', onKey)
    document.body.style.overflow = 'hidden'
    return () => {
      document.removeEventListener('keydown', onKey)
      document.body.style.overflow = ''
    }
  }, [open, onClose])

  const run = (fn?: () => void) => () => {
    fn?.()
    onClose()
  }

  return (
    <>
      <div
        onClick={onClose}
        aria-hidden="true"
        className={`fixed inset-0 z-40 bg-black/50 backdrop-blur-[2px] transition-opacity duration-200 lg:hidden ${
          open ? 'opacity-100' : 'pointer-events-none opacity-0'
        }`}
      />

      <aside
        role="dialog"
        aria-modal="true"
        aria-label="Menu"
        className={`fixed inset-y-0 right-0 z-50 flex w-[min(84vw,320px)] flex-col border-l border-border bg-background shadow-2xl transition-transform duration-300 ease-out lg:hidden ${
          open ? 'translate-x-0' : 'translate-x-full'
        }`}
      >
        <div className="flex items-start justify-between gap-3 border-b border-border px-4 py-3">
          <div className="min-w-0 leading-tight">
            <p className="truncate text-sm font-bold tracking-tight">Resume builder</p>
            <p className="mt-0.5 truncate text-[11px] text-muted-foreground">A product by R&apos;s PlacePrep</p>
          </div>
          <button type="button" onClick={onClose} aria-label="Close menu" className="btn-icon h-8 w-8 shrink-0">
            <X className="h-4 w-4" />
          </button>
        </div>

        <nav className="flex-1 overflow-y-auto p-3">
          <a
            href="/guide/"
            className="flex items-center justify-between rounded-xl border border-border px-3.5 py-3 text-sm font-medium transition-colors hover:border-primary/40 hover:text-primary"
          >
            Resume tips
            <ArrowUpRight className="h-4 w-4 text-muted-foreground" />
          </a>

          <div className="mt-2 grid gap-2">
            <button
              type="button"
              onClick={run(onLoadSample)}
              className="flex items-center gap-2.5 rounded-xl border border-border px-3.5 py-3 text-left text-sm font-medium transition-colors hover:border-primary/40 hover:text-primary"
            >
              <FileText className="h-4 w-4 text-muted-foreground" />
              Load sample resume
            </button>

            <button
              type="button"
              onClick={run(onReset)}
              className="flex items-center gap-2.5 rounded-xl border border-border px-3.5 py-3 text-left text-sm font-medium transition-colors hover:border-red-500/40 hover:text-red-500"
            >
              <RotateCcw className="h-4 w-4 text-muted-foreground" />
              Clear all fields
            </button>
          </div>
        </nav>

        <div className="border-t border-border p-3">
          <a
            href="https://placeprep.app"
            target="_blank"
            rel="noreferrer"
            className="flex w-full items-center justify-center gap-1.5 rounded-xl border border-primary/40 bg-primary/[0.08] px-4 py-3 text-sm font-semibold text-primary transition-colors hover:border-primary/60 hover:bg-primary/[0.14]"
          >
            Try placeprep.app
            <ArrowUpRight className="h-4 w-4" />
          </a>

          <div className="mt-3 flex items-center justify-center gap-1.5">
            {SOCIALS.map(({ icon: Icon, href, label }) => (
              <a
                key={label}
                href={href}
                target="_blank"
                rel="noreferrer"
                aria-label={label}
                className="btn-icon h-8 w-8"
              >
                <Icon className="h-3.5 w-3.5" />
              </a>
            ))}
          </div>

          <p className="mt-3 text-center text-[11px] leading-relaxed text-muted-foreground">
            Your data stays in your browser, nothing is uploaded.
          </p>
        </div>
      </aside>
    </>
  )
}
