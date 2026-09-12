import { useCallback, useEffect, useRef, useState } from 'react'
import type { StyleSettings } from '@/types'

const STORAGE_KEY = 'placeprep-resume-builder:style'

export const defaultStyleSettings: StyleSettings = {
  fontFamily: 'inter',
  template: 'classic',
  nameSize: 22,
  headingSize: 11.5,
  bodySize: 10.25,
  metaSize: 9.25,
  lineSpacing: 1.1,
}

function loadInitial(): StyleSettings {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (raw) return { ...defaultStyleSettings, ...JSON.parse(raw) }
  } catch {
    return defaultStyleSettings
  }
  return defaultStyleSettings
}

export function useStyleSettings() {
  const [style, setStyle] = useState<StyleSettings>(loadInitial)
  const firstRun = useRef(true)

  useEffect(() => {
    if (firstRun.current) {
      firstRun.current = false
      return
    }
    const timeout = setTimeout(() => {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(style))
    }, 300)
    return () => clearTimeout(timeout)
  }, [style])

  const update = useCallback(<K extends keyof StyleSettings>(key: K, value: StyleSettings[K]) => {
    setStyle((prev) => ({ ...prev, [key]: value }))
  }, [])

  const resetStyle = useCallback(() => {
    localStorage.removeItem(STORAGE_KEY)
    setStyle(defaultStyleSettings)
  }, [])

  return { style, update, resetStyle }
}
