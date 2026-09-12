import { PenLine } from 'lucide-react'
import { StripedPattern } from '@/components/ui/striped-pattern'

interface GuideCoverArtProps {
  title: string
  tag?: string
}

const CANVAS = '#12151b'
const BLUE = '#3b82f6'

export function GuideCoverArt({ title, tag = 'Resume Guide' }: GuideCoverArtProps) {
  return (
    <div
      className="relative w-full overflow-hidden rounded-2xl border border-border"
      style={{ background: CANVAS, aspectRatio: '16 / 10', minHeight: 260, maxHeight: 520 }}
    >
      <div
        className="absolute rounded-full blur-3xl"
        style={{
          width: '55%',
          aspectRatio: 1,
          top: '-20%',
          right: '-10%',
          background: BLUE,
          opacity: 0.26,
        }}
      />
      <div
        className="absolute rounded-full blur-2xl"
        style={{
          width: '32%',
          aspectRatio: 1,
          bottom: '-15%',
          left: '-8%',
          background: BLUE,
          opacity: 0.16,
        }}
      />

      <StripedPattern
        direction="left"
        width={14}
        height={14}
        className="text-white/[0.07] stroke-[0.4] [mask-image:linear-gradient(to_bottom,black_0%,transparent_78%)]"
      />

      <div className="relative flex h-full flex-col p-5 sm:p-7 md:p-10">
        <div className="flex items-center gap-2">
          <PenLine className="h-4 w-4 text-white/55 md:h-5 md:w-5" />
          <span className="text-[10px] font-bold uppercase tracking-[0.18em] text-white/75 sm:text-xs md:text-sm">
            {tag}
          </span>
        </div>

        <div className="flex min-w-0 flex-1 flex-col justify-center pb-0 sm:pb-[6%] md:pb-[10%]">
          <p
            className="max-w-[92%] text-[clamp(1.5rem,6.2vw,4rem)] font-bold leading-[1.1] tracking-tight text-white sm:max-w-[84%] md:max-w-[80%]"
            style={{ textWrap: 'balance' }}
          >
            {title}
          </p>
        </div>

        <div className="flex items-center gap-2">
          <span className="h-px w-4 bg-white/40 md:w-5" aria-hidden="true" />
          <span className="text-[10px] font-medium tracking-wide text-white/45 sm:text-xs md:text-sm">
            R&apos;s PlacePrep
          </span>
        </div>
      </div>
    </div>
  )
}
