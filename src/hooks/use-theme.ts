import { useCallback, useEffect, useRef, useState } from 'react'

export type Theme = 'light' | 'dark'

const STORAGE_KEY = 'resume-builder-theme'
const STYLE_ID = 'theme-toggler-styles'

function injectStyles() {
  if (document.getElementById(STYLE_ID)) return
  const style = document.createElement('style')
  style.id = STYLE_ID
  style.textContent = `
    @keyframes theme-expand-tr {
      from { clip-path: circle(0% at 100% 0%); }
      to   { clip-path: circle(141% at 100% 0%); }
    }
    @keyframes theme-expand-bl {
      from { clip-path: circle(0% at 0% 100%); }
      to   { clip-path: circle(141% at 0% 100%); }
    }
  `
  document.head.appendChild(style)
}

function readTheme(): Theme {
  const stored = localStorage.getItem(STORAGE_KEY) as Theme | null
  if (stored === 'light' || stored === 'dark') return stored
  return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light'
}

export function useTheme() {
  const [theme, setThemeState] = useState<Theme>(readTheme)
  const overlayRef = useRef<HTMLDivElement | null>(null)

  useEffect(() => {
    injectStyles()
    return () => {
      overlayRef.current?.remove()
    }
  }, [])

  const apply = useCallback((next: Theme) => {
    document.documentElement.classList.toggle('dark', next === 'dark')
    localStorage.setItem(STORAGE_KEY, next)
    setThemeState(next)
  }, [])

  const toggle = useCallback(() => {
    if (overlayRef.current) return
    const next: Theme = theme === 'dark' ? 'light' : 'dark'

    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      apply(next)
      return
    }

    const animName = next === 'dark' ? 'theme-expand-tr' : 'theme-expand-bl'
    const newBg = next === 'dark' ? '#0a0a0b' : '#ffffff'

    const overlay = document.createElement('div')
    overlay.style.cssText = [
      'position:fixed',
      'inset:0',
      'z-index:9999',
      'pointer-events:none',
      `background-color:${newBg}`,
      `animation:${animName} 450ms ease-in-out forwards`,
    ].join(';')
    document.body.appendChild(overlay)
    overlayRef.current = overlay

    overlay.addEventListener('animationend', () => {
      apply(next)
      requestAnimationFrame(() => {
        overlay.remove()
        overlayRef.current = null
      })
    })
  }, [theme, apply])

  return { theme, toggle }
}
