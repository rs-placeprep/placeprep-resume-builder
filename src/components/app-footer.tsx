import { ArrowUpRight } from 'lucide-react'
import { GithubIcon, LinkedinIcon, XIcon, DiscordIcon } from '@/components/icons/social-icons'

const SOCIALS = [
  {
    icon: GithubIcon,
    href: 'https://github.com/rs-placeprep/placeprep-resume-builder',
    label: 'GitHub',
    hover: 'hover:border-[#181717]/40 hover:text-[#181717] dark:hover:border-white/40 dark:hover:text-white',
  },
  {
    icon: LinkedinIcon,
    href: 'https://www.linkedin.com/in/rohan-sharma-9386rs',
    label: 'LinkedIn',
    hover: 'hover:border-[#0A66C2]/40 hover:text-[#0A66C2]',
  },
  {
    icon: XIcon,
    href: 'https://x.com/rrs00179',
    label: 'X',
    hover: 'hover:border-[#181717]/40 hover:text-[#181717] dark:hover:border-white/40 dark:hover:text-white',
  },
  {
    icon: DiscordIcon,
    href: 'https://discord.gg/F8yygtCMU7#',
    label: 'Discord',
    hover: 'hover:border-[#5865F2]/40 hover:text-[#5865F2]',
  },
  // { icon: RedditIcon, href: '#', label: 'Reddit', hover: 'hover:border-[#FF4500]/40 hover:text-[#FF4500]' },
]

export function AppFooter() {
  return (
    <footer className="shrink-0 border-t border-border px-4 py-4 sm:px-6">
      <div className="mx-auto flex max-w-[1600px] flex-col items-center justify-between gap-4 sm:flex-row">
        <p className="order-2 text-center text-xs leading-relaxed text-muted-foreground sm:order-1 sm:text-left">
          A tool by{' '}
          <a
            href="https://placeprep.app"
            target="_blank"
            rel="noreferrer"
            className="font-medium text-foreground transition-colors hover:text-primary"
          >
            R&apos;s PlacePrep
          </a>{' '}
          · Your data stays in your browser, nothing is uploaded.
        </p>

        <div className="order-1 flex items-center gap-3 sm:order-2">
          <a
            href="https://placeprep.app"
            target="_blank"
            rel="noreferrer"
            className="inline-flex h-8 items-center gap-1 rounded-xl border border-primary/40 bg-primary/[0.08] px-3 text-xs font-medium text-primary transition-all duration-200 hover:border-primary/60 hover:bg-primary/[0.14]"
          >
            placeprep.app
            <ArrowUpRight className="h-3 w-3" />
          </a>

          <div className="flex items-center gap-1">
            {SOCIALS.map(({ icon: Icon, href, label, hover }) => (
              <a
                key={label}
                href={href}
                target="_blank"
                rel="noreferrer"
                aria-label={label}
                className={`inline-flex h-8 w-8 items-center justify-center rounded-xl border border-border text-muted-foreground transition-all duration-200 ${hover}`}
              >
                <Icon className="h-3.5 w-3.5" />
              </a>
            ))}
          </div>
        </div>
      </div>
    </footer>
  )
}
