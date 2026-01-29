'use server'

import { getPayloadClient } from '@/lib/payload'

export interface TrackPageViewOptions {
  path: string
  referrer?: string
  userAgent?: string
}

export const trackPageView = async (options: TrackPageViewOptions): Promise<void> => {
  try {
    const payload = await getPayloadClient()
    const { path, referrer, userAgent } = options

    // Parse user agent for device info
    const deviceInfo = parseUserAgent(userAgent || '')

    // Check if this is a blog post path
    const blogPostMatch = path.match(/^\/blog\/([^/]+)$/)
    if (blogPostMatch) {
      const slug = blogPostMatch[1]

      // Find the post by slug
      const postResult = await payload.find({
        collection: 'posts',
        where: {
          and: [
            { slug: { equals: slug } },
            { status: { equals: 'published' } },
          ],
        },
        depth: 0,
      })

      if (postResult.docs.length > 0) {
        const post = postResult.docs[0]

        // Increment view count on the post
        await payload.update({
          collection: 'posts',
          id: post.id,
          data: {
            viewCount: (post.viewCount || 0) + 1,
            lastViewedAt: new Date().toISOString(),
          },
        })
      }
    }

    // Also track in analytics collection for overall stats
    const existing = await payload.find({
      collection: 'analytics',
      where: {
        path: { equals: path },
      },
      depth: 0,
    })

    if (existing.docs.length > 0) {
      // Update existing entry
      const analyticsEntry = existing.docs[0]
      await payload.update({
        collection: 'analytics',
        id: analyticsEntry.id,
        data: {
          pageViews: (analyticsEntry.pageViews || 0) + 1,
          lastViewed: new Date().toISOString(),
          referrer: referrer || analyticsEntry.referrer,
          userAgent: userAgent || analyticsEntry.userAgent,
          device: deviceInfo,
        },
      })
    } else {
      // Create new entry
      await payload.create({
        collection: 'analytics',
        data: {
          path,
          pageViews: 1,
          lastViewed: new Date().toISOString(),
          referrer,
          userAgent,
          device: deviceInfo,
        },
      })
    }
  } catch (error) {
    console.error('Failed to track page view:', error)
    // Don't throw - tracking failures shouldn't break the app
  }
}

export interface AnalyticsStats {
  totalViews: number
  topPages: Array<{
    path: string
    pageViews: number
  }>
}

export const getAnalyticsStats = async (): Promise<AnalyticsStats> => {
  try {
    const payload = await getPayloadClient()

    const result = await payload.find({
      collection: 'analytics',
      sort: '-pageViews',
      limit: 10,
      depth: 0,
    })

    const totalViews = result.docs.reduce((sum, doc) => sum + (doc.pageViews || 0), 0)

    return {
      totalViews,
      topPages: result.docs.map((doc) => ({
        path: doc.path,
        pageViews: doc.pageViews || 0,
      })),
    }
  } catch (error) {
    console.error('Failed to fetch analytics stats:', error)
    return {
      totalViews: 0,
      topPages: [],
    }
  }
}

// Simple user agent parser
function parseUserAgent(userAgent: string) {
  const ua = userAgent.toLowerCase()

  // Detect browser
  let browser = 'Unknown'
  if (ua.includes('chrome')) browser = 'Chrome'
  else if (ua.includes('firefox')) browser = 'Firefox'
  else if (ua.includes('safari')) browser = 'Safari'
  else if (ua.includes('edge')) browser = 'Edge'

  // Detect OS
  let os = 'Unknown'
  if (ua.includes('windows')) os = 'Windows'
  else if (ua.includes('mac')) os = 'macOS'
  else if (ua.includes('linux')) os = 'Linux'
  else if (ua.includes('android')) os = 'Android'
  else if (ua.includes('iphone') || ua.includes('ipad')) os = 'iOS'

  // Detect device type
  let type = 'desktop'
  if (ua.includes('mobile') || ua.includes('android') || ua.includes('iphone')) {
    type = 'mobile'
  } else if (ua.includes('ipad') || ua.includes('tablet')) {
    type = 'tablet'
  }

  return {
    type,
    browser,
    os,
  }
}
