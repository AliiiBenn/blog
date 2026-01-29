'use client'

import { useEffect } from 'react'
import { usePathname } from 'next/navigation'
import { trackPageView } from '@/app/actions/analytics'

export interface AnalyticsTrackerProps {
  disabled?: boolean
}

/**
 * AnalyticsTracker component
 *
 * Automatically tracks page views using Next.js usePathname
 * and sends data to Payload Analytics collection via Server Actions.
 *
 * @param disabled - Disable tracking (useful for development)
 */
export function AnalyticsTracker({ disabled = false }: AnalyticsTrackerProps = {}) {
  const pathname = usePathname()

  useEffect(() => {
    if (disabled || typeof window === 'undefined') return

    // Small delay to ensure page load is tracked
    const timeout = setTimeout(() => {
      trackPageView({
        path: pathname,
        referrer: document.referrer || undefined,
        userAgent: navigator.userAgent || undefined,
      })
    }, 100)

    return () => clearTimeout(timeout)
  }, [pathname, disabled])

  return null
}
