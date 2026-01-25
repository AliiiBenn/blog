# Issue: Implement Analytics Tracking for Blog

## Status
**Open** - Ready to implement

## Priority
Medium

## Overview
Implement analytics tracking to monitor blog traffic, user engagement, and content performance. This will help understand which articles perform best and where traffic comes from.

## Requirements

### Functional Requirements
1. Track page views for each blog post
2. Track unique visitors (approximately)
3. Track referrer sources (where traffic comes from)
4. Display analytics in Payload CMS admin dashboard
5. Show top performing articles
6. Track basic user agent data (device type, browser)

### Non-Functional Requirements
- GDPR compliant (no cookies, anonymized IPs)
- No performance impact on page load
- Privacy-first approach
- Must work with ad-blockers (server-side tracking)

## Proposed Solution

### Approach: Server Actions with Payload CMS Collection

#### 1. Create Analytics Collection in Payload

**Collection Structure:**
```typescript
{
  slug: 'analytics',
  fields: [
    {
      name: 'path',
      type: 'text',
      required: true,
      unique: true,
      index: true
    },
    {
      name: 'pageViews',
      type: 'number',
      required: true,
      defaultValue: 0
    },
    {
      name: 'lastViewed',
      type: 'date',
      required: true
    },
    {
      name: 'referrer',
      type: 'text'
    },
    {
      name: 'userAgent',
      type: 'text'
    },
    {
      name: 'device',
      type: 'group',
      fields: [
        { name: 'type', type: 'text' }, // mobile/desktop/tablet
        { name: 'browser', type: 'text' },
        { name: 'os', type: 'text' }
      ]
    }
  ]
}
```

#### 2. Create Server Action for Tracking

**File:** `app/actions/analytics.ts`

```typescript
'use server'

export async function trackPageView(data: {
  slug: string
  referrer?: string
  userAgent?: string
}) {
  // Create or update analytics entry
  // Increment pageViews counter
  // Update lastViewed timestamp
}
```

#### 3. Create Client Component Tracker

**File:** `components/analytics-tracker.tsx`

```typescript
'use client'

import { useEffect } from 'react'
import { trackPageView } from '@/app/actions/analytics'

export function AnalyticsTracker({ slug }: { slug: string }) {
  useEffect(() => {
    trackPageView({
      slug,
      referrer: document.referrer,
      userAgent: navigator.userAgent
    })
  }, [slug])

  return null
}
```

#### 4. Integrate in Blog Post Page

Add `<AnalyticsTracker slug={slug} />` to blog post pages.

#### 5. Create Admin Dashboard

**Custom View in Payload Admin:**
- Total page views (all time)
- Page views over time (last 30 days chart)
- Top 10 most viewed articles
- Referrer breakdown
- Device type distribution
- Geographic distribution (if implemented)

## Alternative Solutions Considered

### 1. Vercel Analytics (Recommended for simplicity)
**Pros:**
- Zero setup required
- Privacy-first
- No cookies
- Free tier available

**Cons:**
- Data stored on Vercel servers (US)
- Limited customization
- Vendor lock-in

**Use case:** If blog is hosted on Vercel and quick setup is preferred

### 2. Plausible Analytics
**Pros:**
- Privacy-focused
- Open source
- No cookies needed
- Self-hosted option available

**Cons:**
- ~€9/month for hosted version
- Requires additional setup for self-hosted

**Use case:** If privacy is critical and budget allows

### 3. Simple Page View Counter
**Pros:**
- Minimal implementation
- Fast performance
- Easy to understand

**Cons:**
- Limited data
- No referrer tracking
- No user analytics

**Use case:** MVP or quick solution

## Implementation Plan

### Phase 1: MVP (1-2 days)
1. Create Analytics collection in Payload
2. Implement trackPageView server action
3. Create AnalyticsTracker component
4. Integrate in blog post page
5. Test tracking functionality

### Phase 2: Dashboard (1-2 days)
1. Create admin view in Payload
2. Add basic statistics (total views, top articles)
3. Create simple charts
4. Add date filtering

### Phase 3: Enhanced Analytics (Optional)
1. Referrer tracking
2. Device type detection
3. Geographic tracking
4. Time-on-page tracking
5. Export functionality

## Privacy Considerations

- No cookies or tracking scripts
- Anonymize IP addresses (hash or remove last octets)
- No personal data collection
- GDPR compliant by design
- Consider adding opt-out mechanism

## Performance Considerations

- Use server actions (non-blocking)
- Batch database writes if high traffic
- Add database indexes on frequently queried fields
- Cache computed statistics
- Consider rate limiting to prevent abuse

## Database Schema

**Indexes needed:**
- `path` (unique)
- `lastViewed` (for time-based queries)
- `pageViews` (for sorting)

## Success Metrics

- Analytics tracking works without errors
- Page views are accurately counted
- Dashboard displays correct statistics
- No performance degradation on page load
- Dashboard loads in under 2 seconds

## Dependencies

- Payload CMS hooks
- Next.js Server Actions
- PostgreSQL (existing)
- Optional: Chart library for dashboard (recharts, chart.js)

## Related Issues

None

## Notes

- Keep it simple initially
- Can add features later based on needs
- Consider data retention policy (e.g., keep data for 90 days)
- Document the analytics for future reference
