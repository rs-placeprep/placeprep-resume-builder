import * as React from 'react'
import clsx from 'clsx'

const rand = (min: number, max: number): number => Math.random() * (max - min) + min

const randInt = (min: number, max: number): number => Math.floor(Math.random() * (max - min) + min)

const randColor = (): string => `hsl(${randInt(0, 360)}, 100%, 50%)`

type Range = { min: number; max: number } | number

function getValueByRange(range: Range): number {
  return typeof range === 'number' ? range : rand(range.min, range.max)
}

function getColor(color: string | string[] | undefined): string {
  if (Array.isArray(color)) return color[randInt(0, color.length)] ?? randColor()
  return color ?? randColor()
}

interface ParticleType {
  x: number
  y: number
  color: string
  vx: number
  vy: number
  gravity: number
  friction: number
  alpha: number
  decay: number
  size: number
  update: () => void
  draw: (ctx: CanvasRenderingContext2D) => void
  isAlive: () => boolean
}

function createParticle(
  x: number,
  y: number,
  color: string,
  speed: number,
  direction: number,
  gravity: number,
  friction: number,
  size: number,
  decay: number,
): ParticleType {
  return {
    x,
    y,
    color,
    vx: Math.cos(direction) * speed,
    vy: Math.sin(direction) * speed,
    gravity,
    friction,
    alpha: 1,
    decay,
    size,
    update() {
      this.vx *= this.friction
      this.vy *= this.friction
      this.vy += this.gravity
      this.x += this.vx
      this.y += this.vy
      this.alpha -= this.decay
    },
    draw(ctx) {
      ctx.save()
      ctx.globalAlpha = Math.max(this.alpha, 0)
      ctx.beginPath()
      ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2)
      ctx.fillStyle = this.color
      ctx.fill()
      ctx.restore()
    },
    isAlive() {
      return this.alpha > 0
    },
  }
}

interface FireworkType {
  x: number
  y: number
  targetY: number
  color: string
  size: number
  vx: number
  vy: number
  trail: { x: number; y: number }[]
  trailLength: number
  update: () => boolean
  explode: () => void
  draw: (ctx: CanvasRenderingContext2D) => void
}

function createFirework(
  x: number,
  y: number,
  targetY: number,
  color: string,
  speed: number,
  size: number,
  particleSpeed: Range,
  particleSize: Range,
  onExplode: (particles: ParticleType[]) => void,
  scale: number,
  particleCount: { min: number; max: number },
): FireworkType {
  const angle = -Math.PI / 2 + rand(-0.3, 0.3)

  return {
    x,
    y,
    targetY,
    color,
    size,
    vx: Math.cos(angle) * speed,
    vy: Math.sin(angle) * speed,
    trail: [],
    trailLength: randInt(10, 25),
    update() {
      this.trail.push({ x: this.x, y: this.y })
      if (this.trail.length > this.trailLength) this.trail.shift()

      this.x += this.vx
      this.y += this.vy
      this.vy += 0.02 * scale

      if (this.vy >= 0 || this.y <= this.targetY) {
        this.explode()
        return false
      }
      return true
    },
    explode() {
      const particles: ParticleType[] = []
      const count = randInt(particleCount.min, particleCount.max)
      for (let i = 0; i < count; i++) {
        particles.push(
          createParticle(
            this.x,
            this.y,
            this.color,
            getValueByRange(particleSpeed),
            rand(0, Math.PI * 2),
            0.05 * scale,
            0.98,
            getValueByRange(particleSize),
            rand(0.005, 0.02) * scale,
          ),
        )
      }
      onExplode(particles)
    },
    draw(ctx) {
      ctx.save()
      ctx.beginPath()
      if (this.trail.length > 1) {
        ctx.moveTo(this.trail[0]?.x ?? this.x, this.trail[0]?.y ?? this.y)
        for (const point of this.trail) ctx.lineTo(point.x, point.y)
      } else {
        ctx.moveTo(this.x, this.y)
        ctx.lineTo(this.x, this.y)
      }
      ctx.strokeStyle = this.color
      ctx.lineWidth = this.size
      ctx.lineCap = 'round'
      ctx.stroke()
      ctx.restore()
    },
  }
}

export interface FireworksBackgroundProps extends Omit<React.ComponentProps<'div'>, 'color'> {
  canvasProps?: React.ComponentProps<'canvas'>
  population?: number
  color?: string | string[]
  fireworkSpeed?: Range
  fireworkSize?: Range
  particleSpeed?: Range
  particleSize?: Range
  durationMs?: number
  scale?: number
  particleCount?: { min: number; max: number }
}

export function FireworksBackground({
  className,
  canvasProps,
  population = 1,
  color,
  fireworkSpeed = { min: 4, max: 8 },
  fireworkSize = { min: 2, max: 5 },
  particleSpeed = { min: 2, max: 7 },
  particleSize = { min: 1, max: 5 },
  durationMs,
  scale = 1,
  particleCount = { min: 50, max: 150 },
  ...props
}: FireworksBackgroundProps) {
  const canvasRef = React.useRef<HTMLCanvasElement>(null)
  const containerRef = React.useRef<HTMLDivElement>(null)

  React.useEffect(() => {
    const canvas = canvasRef.current
    const container = containerRef.current
    if (!canvas || !container) return

    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return

    const ctx = canvas.getContext('2d')
    if (!ctx) return

    let width = container.offsetWidth
    let height = container.offsetHeight
    canvas.width = width
    canvas.height = height

    const setCanvasSize = () => {
      width = container.offsetWidth
      height = container.offsetHeight
      canvas.width = width
      canvas.height = height
    }
    window.addEventListener('resize', setCanvasSize)

    const explosions: ParticleType[] = []
    const fireworks: FireworkType[] = []
    let launching = true
    let launchTimer: ReturnType<typeof setTimeout> | undefined
    let stopTimer: ReturnType<typeof setTimeout> | undefined

    const handleExplosion = (particles: ParticleType[]) => {
      explosions.push(...particles)
    }

    const launchFirework = () => {
      if (!launching) return

      fireworks.push(
        createFirework(
          rand(width * 0.1, width * 0.9),
          height,
          rand(height * 0.1, height * 0.4),
          getColor(color),
          getValueByRange(fireworkSpeed),
          getValueByRange(fireworkSize),
          particleSpeed,
          particleSize,
          handleExplosion,
          scale,
          particleCount,
        ),
      )

      launchTimer = setTimeout(launchFirework, rand(300, 800) / population)
    }

    launchFirework()

    if (durationMs) {
      stopTimer = setTimeout(() => {
        launching = false
        if (launchTimer) clearTimeout(launchTimer)
      }, durationMs)
    }

    let animationFrameId: number
    const animate = () => {
      ctx.clearRect(0, 0, width, height)

      for (let i = fireworks.length - 1; i >= 0; i--) {
        const firework = fireworks[i]
        if (!firework?.update()) fireworks.splice(i, 1)
        else firework.draw(ctx)
      }

      for (let i = explosions.length - 1; i >= 0; i--) {
        const particle = explosions[i]
        particle?.update()
        if (particle?.isAlive()) particle.draw(ctx)
        else explosions.splice(i, 1)
      }

      animationFrameId = requestAnimationFrame(animate)
    }

    animate()

    return () => {
      window.removeEventListener('resize', setCanvasSize)
      if (launchTimer) clearTimeout(launchTimer)
      if (stopTimer) clearTimeout(stopTimer)
      cancelAnimationFrame(animationFrameId)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    population,
    JSON.stringify(color),
    JSON.stringify(fireworkSpeed),
    JSON.stringify(fireworkSize),
    JSON.stringify(particleSpeed),
    JSON.stringify(particleSize),
    JSON.stringify(particleCount),
    durationMs,
    scale,
  ])

  return (
    <div
      ref={containerRef}
      data-slot="fireworks-background"
      className={clsx('relative size-full overflow-hidden', className)}
      {...props}
    >
      <canvas {...canvasProps} ref={canvasRef} className={clsx('absolute inset-0 size-full', canvasProps?.className)} />
    </div>
  )
}
