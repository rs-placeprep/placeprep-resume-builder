import { useCallback, useEffect, useRef, useState } from 'react'
import type { ResumeData } from '@/types'
import { sampleResume, emptyResume } from '@/lib/sample-data'

const STORAGE_KEY = 'placeprep-resume-builder:data'

function loadInitial(): ResumeData {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (raw) return { ...emptyResume, ...JSON.parse(raw) }
  } catch {
    // corrupted storage, fall through to sample
  }
  return sampleResume
}

export function useResumeStore() {
  const [data, setData] = useState<ResumeData>(loadInitial)
  const firstRun = useRef(true)

  useEffect(() => {
    if (firstRun.current) {
      firstRun.current = false
      return
    }
    const timeout = setTimeout(() => {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(data))
    }, 300)
    return () => clearTimeout(timeout)
  }, [data])

  const update = useCallback(<K extends keyof ResumeData>(key: K, value: ResumeData[K]) => {
    setData((prev) => ({ ...prev, [key]: value }))
  }, [])

  const reset = useCallback(() => {
    localStorage.removeItem(STORAGE_KEY)
    setData(emptyResume)
  }, [])

  const loadSample = useCallback(() => {
    setData(sampleResume)
  }, [])

  return { data, setData, update, reset, loadSample }
}
