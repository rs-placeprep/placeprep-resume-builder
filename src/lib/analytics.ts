import posthog from 'posthog-js'

const POSTHOG_KEY = import.meta.env.VITE_POSTHOG_KEY
const POSTHOG_HOST = import.meta.env.VITE_POSTHOG_HOST

let initialized = false

// Same PostHog project as placeprep.app, routed through the shared reverse-proxy domain so it isn't blocked by ad blockers.

export function initAnalytics() {
  if (initialized || typeof window === 'undefined') return
  if (!POSTHOG_KEY || !POSTHOG_HOST) {
    console.warn('[analytics] VITE_POSTHOG_KEY / VITE_POSTHOG_HOST not set, skipping PostHog init.')
    return
  }
  initialized = true

  posthog.init(POSTHOG_KEY, {
    api_host: POSTHOG_HOST,
    defaults: '2026-05-30',
    capture_pageview: true,
    capture_pageleave: true,
  })
}
