import { useCallback, useEffect, useRef, useState } from 'react'
import { Minus, Plus } from 'lucide-react'

interface StepperProps {
  label: string
  value: number
  min: number
  max: number
  step: number
  unit?: string
  onChange: (v: number) => void
}

function quantise(raw: number, min: number, max: number, step: number) {
  const snapped = min + Math.round((raw - min) / step) * step
  const clamped = Math.min(max, Math.max(min, snapped))
  return Math.round(clamped * 100) / 100
}

export function Stepper({ label, value, min, max, step, unit = '', onChange }: StepperProps) {
  const trackRef = useRef<HTMLDivElement>(null)
  const [dragging, setDragging] = useState(false)
  const pct = ((value - min) / (max - min)) * 100

  const setFromClientX = useCallback(
    (clientX: number) => {
      const track = trackRef.current
      if (!track) return
      const rect = track.getBoundingClientRect()
      const ratio = Math.min(1, Math.max(0, (clientX - rect.left) / rect.width))
      onChange(quantise(min + ratio * (max - min), min, max, step))
    },
    [min, max, step, onChange],
  )

  useEffect(() => {
    if (!dragging) return
    const onMove = (e: PointerEvent) => {
      e.preventDefault()
      setFromClientX(e.clientX)
    }
    const onUp = () => setDragging(false)
    window.addEventListener('pointermove', onMove, { passive: false })
    window.addEventListener('pointerup', onUp)
    window.addEventListener('pointercancel', onUp)
    return () => {
      window.removeEventListener('pointermove', onMove)
      window.removeEventListener('pointerup', onUp)
      window.removeEventListener('pointercancel', onUp)
    }
  }, [dragging, setFromClientX])

  const onKeyDown = (e: React.KeyboardEvent) => {
    const map: Record<string, number> = { ArrowLeft: -step, ArrowDown: -step, ArrowRight: step, ArrowUp: step }
    if (e.key in map) {
      e.preventDefault()
      onChange(quantise(value + map[e.key], min, max, step))
    } else if (e.key === 'Home') {
      e.preventDefault()
      onChange(min)
    } else if (e.key === 'End') {
      e.preventDefault()
      onChange(max)
    }
  }

  return (
    <div className="rounded-xl border border-border bg-input p-2.5 transition-colors hover:border-primary/30">
      <div className="mb-2 flex items-center justify-between gap-2">
        <span className="truncate text-[11px] font-medium text-muted-foreground">{label}</span>
        <span className="shrink-0 text-xs font-semibold tabular-nums text-foreground">
          {value}
          {unit}
        </span>
      </div>

      <div className="flex items-center gap-2">
        <button
          type="button"
          onClick={() => onChange(quantise(value - step, min, max, step))}
          disabled={value <= min}
          aria-label={`Decrease ${label}`}
          className="inline-flex h-6 w-6 shrink-0 items-center justify-center rounded-lg border border-border text-muted-foreground transition-colors hover:border-primary/40 hover:text-primary disabled:pointer-events-none disabled:opacity-30"
        >
          <Minus className="h-3 w-3" />
        </button>

        <div
          ref={trackRef}
          role="slider"
          tabIndex={0}
          aria-label={label}
          aria-valuemin={min}
          aria-valuemax={max}
          aria-valuenow={value}
          aria-valuetext={`${value}${unit}`}
          onPointerDown={(e) => {
            e.preventDefault()
            setDragging(true)
            setFromClientX(e.clientX)
          }}
          onKeyDown={onKeyDown}
          className="group relative flex h-5 flex-1 cursor-grab touch-none items-center focus:outline-none active:cursor-grabbing"
        >
          <div className="h-1 w-full overflow-hidden rounded-full bg-border">
            <div className="h-full rounded-full bg-primary" style={{ width: `${pct}%` }} />
          </div>
          <span
            className={`pointer-events-none absolute h-3 w-3 -translate-x-1/2 rounded-full border-2 border-background bg-primary shadow-sm transition-transform ${
              dragging ? 'scale-125' : 'group-hover:scale-110 group-focus:scale-110'
            }`}
            style={{ left: `${pct}%` }}
          />
        </div>

        <button
          type="button"
          onClick={() => onChange(quantise(value + step, min, max, step))}
          disabled={value >= max}
          aria-label={`Increase ${label}`}
          className="inline-flex h-6 w-6 shrink-0 items-center justify-center rounded-lg border border-border text-muted-foreground transition-colors hover:border-primary/40 hover:text-primary disabled:pointer-events-none disabled:opacity-30"
        >
          <Plus className="h-3 w-3" />
        </button>
      </div>
    </div>
  )
}
