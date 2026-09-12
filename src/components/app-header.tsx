import { useState } from 'react'
import { Download, Menu, RotateCcw } from 'lucide-react'
import { ThemeToggle } from './theme-toggle'
import { MobileNav } from './mobile-nav'
import { Button } from './ui/button'

interface Props {
  onDownload?: () => void
  onReset?: () => void
  onLoadSample?: () => void
  downloading?: boolean
  variant?: 'builder' | 'guide'
}

export function AppHeader({ onDownload, onReset, onLoadSample, downloading = false, variant = 'builder' }: Props) {
  const [menuOpen, setMenuOpen] = useState(false)
  const isGuide = variant === 'guide'

  return (
    <>
      <header className="sticky top-0 z-30 border-b border-border bg-background/70 backdrop-blur-xl">
        <div className="mx-auto flex h-14 max-w-[1600px] items-center justify-between gap-2 px-4 sm:h-16 sm:gap-4 sm:px-6">
          <a href="/" className="group flex min-w-0 items-baseline gap-1.5">
            <span className="truncate text-base font-bold tracking-tight sm:text-xl">Resume builder</span>
            <span className="hidden shrink-0 text-sm font-medium text-muted-foreground transition-colors group-hover:text-primary sm:inline">
              (R&apos;s PlacePrep)
            </span>
          </a>

          {isGuide ? (
            <nav className="flex shrink-0 items-center gap-2">
              <ThemeToggle />
              <a href="/" className="btn-solid h-9 text-xs sm:text-sm">
                Build my resume
              </a>
            </nav>
          ) : (
            <>
              <nav className="hidden shrink-0 items-center gap-2 lg:flex">
                <a href="/guide/" className="btn-ghost h-9 px-3 text-sm font-medium">
                  Resume tips
                </a>
                <Button variant="ghost" size="sm" onClick={onLoadSample} className="h-9">
                  Load sample
                </Button>
                <Button variant="ghost" size="sm" onClick={onReset} className="h-9">
                  <RotateCcw className="h-3.5 w-3.5" />
                  Clear
                </Button>
                <ThemeToggle />
                <Button variant="solid" size="sm" onClick={onDownload} disabled={downloading} className="h-9">
                  <Download className="h-3.5 w-3.5" />
                  {downloading ? 'Generating…' : 'Download PDF'}
                </Button>
              </nav>

              <div className="flex shrink-0 items-center gap-2 lg:hidden">
                <ThemeToggle />
                <Button variant="solid" size="sm" onClick={onDownload} disabled={downloading} className="h-9">
                  <Download className="h-4 w-4" />
                  <span className="hidden sm:inline">{downloading ? 'Generating…' : 'Download PDF'}</span>
                </Button>
                <button
                  type="button"
                  onClick={() => setMenuOpen(true)}
                  aria-label="Open menu"
                  aria-expanded={menuOpen}
                  className="btn-icon h-9 w-9"
                >
                  <Menu className="h-4 w-4" />
                </button>
              </div>
            </>
          )}
        </div>
      </header>

      {!isGuide && (
        <MobileNav
          open={menuOpen}
          onClose={() => setMenuOpen(false)}
          onReset={onReset}
          onLoadSample={onLoadSample}
        />
      )}
    </>
  )
}
