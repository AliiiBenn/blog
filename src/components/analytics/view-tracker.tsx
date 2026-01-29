'use client'

import { useEffect, useState } from 'react'
import { usePathname } from 'next/navigation'
import { trackPageView } from '@/app/actions/analytics'

export interface ViewTrackerProps {
  disabled?: boolean
  minTimeOnPage?: number // Minimum time in seconds before tracking
}

/**
 * ViewTracker component
 *
 * Tracks page views with session-based deduplication and minimum time threshold.
 * Prevents view count manipulation by:
 * - Only counting one view per session per post
 * - Requiring minimum time on page (default 5 seconds)
 * - Not tracking known bots
 *
 * @param disabled - Disable tracking (useful for development)
 * @param minTimeOnPage - Minimum time in seconds before tracking (default: 5)
 */
export function ViewTracker({
  disabled = false,
  minTimeOnPage = 5,
}: ViewTrackerProps = {}) {
  const pathname = usePathname()
  const [hasTracked, setHasTracked] = useState(false)

  useEffect(() => {
    if (disabled || hasTracked || typeof window === 'undefined') return

    // Check if already viewed in this session
    const sessionKey = `viewed_${pathname}`
    const viewed = sessionStorage.getItem(sessionKey)

    if (viewed) {
      const viewedTime = parseInt(viewed, 10)
      const timeSinceView = Date.now() - viewedTime

      // Only allow re-tracking after 30 minutes
      if (timeSinceView < 30 * 60 * 1000) {
        return
      }
    }

    // Set timeout for minimum time threshold
    const timeout = setTimeout(() => {
      // Check for bots
      const userAgent = navigator.userAgent.toLowerCase()
      const isBot =
        userAgent.includes('bot') ||
        userAgent.includes('crawl') ||
        userAgent.includes('spider') ||
        userAgent.includes('crawl') ||
        userAgent.includes('slurp') ||
        userAgent.includes('curl') ||
        userAgent.includes('wget')

      if (isBot) return

      // Track the page view
      trackPageView({
        path: pathname,
        referrer: document.referrer || undefined,
        userAgent: navigator.userAgent || undefined,
      })

      // Mark as viewed in this session
      sessionStorage.setItem(sessionKey, Date.now().toString())
      setHasTracked(true)
    }, minTimeOnPage * 1000)

    return () => clearTimeout(timeout)
  }, [pathname, disabled, hasTracked, minTimeOnPage])

  return null
}
