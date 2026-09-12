import { useEffect } from 'react'
import { CheckCircle2 } from 'lucide-react'
import { FireworksBackground } from './ui/fireworks-background'

interface Props {
  open: boolean
  onClose: () => void
}

export function CelebrationOverlay({ open, onClose }: Props) {
  useEffect(() => {
    if (!open) return
    const timer = setTimeout(onClose, 4200)
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && onClose()
    document.addEventListener('keydown', onKey)
    return () => {
      clearTimeout(timer)
      document.removeEventListener('keydown', onKey)
    }
  }, [open, onClose])

  if (!open) return null

  return (
    <div className="fixed inset-0 z-[200] cursor-pointer" onClick={onClose}>
      <FireworksBackground
        className="absolute inset-0 bg-black/70 backdrop-blur-[2px]"
        durationMs={2800}
        population={1.6}
        color={['#3b82f6', '#22c55e', '#f59e0b', '#ec4899', '#a855f7']}
      />
      <div className="pointer-events-none absolute inset-0 flex items-center justify-center">
        <div className="animate-fade-up flex flex-col items-center gap-3 rounded-2xl border border-white/15 bg-black/50 px-8 py-6 text-center backdrop-blur-md">
          <CheckCircle2 className="h-10 w-10 text-emerald-400" />
          <p className="text-lg font-semibold text-white">Resume downloaded</p>
          <p className="max-w-xs text-sm text-white/70">
            Good luck with the applications. Tailor it per role and you will stand out.
          </p>
        </div>
      </div>
    </div>
  )
}
