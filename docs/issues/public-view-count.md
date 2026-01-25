# Issue: Add Public View Count Display for Blog Posts

## Status
**Open** - Ready to implement

## Priority
Medium

## Overview
Display view counts publicly on blog posts to show popularity and add social proof. This will make the blog more engaging by showing readers which articles are most popular.

## Requirements

### Functional Requirements
1. Display view count on individual blog post pages
2. Display view count on blog post cards (list view)
3. Format numbers in a readable way (e.g., "1.2k", "5k", "100")
4. Cache view counts to avoid performance issues
5. Update counts periodically (not real-time)
6. Show "views" label with the count
7. Handle zero views gracefully (don't show or show "0 views")
8. Prevent view count manipulation (basic protection)

### Non-Functional Requirements
- Fast page load (view count shouldn't block rendering)
- No additional database queries per page if possible
- Accurate counts (within caching period)
- Mobile-friendly display
- Accessible (screen reader friendly)

## Proposed Solution

### Data Structure

**Add to Posts collection fields:**
```typescript
{
  name: 'viewCount',
  type: 'number',
  defaultValue: 0,
  admin: {
    readOnly: true, // Updated by analytics system only
    condition: (data) => data.status === 'published' // Only show for published posts
  }
}

{
  name: 'lastViewedAt',
  type: 'date',
  admin: {
    readOnly: true,
    hidden: true // Only for system use
  }
}
```

### Display Locations

#### 1. Blog Post Cards

**Location:** `components/posts/post-card.tsx`

Display in the card footer or metadata section:
```tsx
<div className="flex items-center gap-2 text-xs text-muted-foreground">
  <Calendar className="h-3 w-3" />
  <span>{post.readingTime}m</span>
  <span>•</span>
  <Eye className="h-3 w-3" />
  <span>{formatViewCount(post.viewCount)} views</span>
</div>
```

**Styling considerations:**
- Use eye icon (lucide-react `Eye` or `Users`)
- Keep it subtle (muted text)
- Consistent placement across all cards
- Don't clutter the design

#### 2. Blog Post Detail Page

**Location:** `app/(frontend)/blog/[slug]/page.tsx`

Display in the header metadata section:
```tsx
<div className="flex items-center gap-2 text-muted-foreground">
  <Calendar className="h-3 w-3" />
  {format(new Date(post.publishedDate), 'MMM d, yyyy')}
  <Clock className="h-3 w-3" />
  {post.readingTime}m
  <Eye className="h-3 w-3" />
  {formatViewCount(post.viewCount)} views
</div>
```

**Alternative placement options:**
- In the hero section below the title
- Next to the publish date
- In a "Stats" section with read time
- In the footer area

### Number Formatting

Create a utility function to format large numbers:

```typescript
// lib/utils.ts
export function formatViewCount(count: number): string {
  if (count === 0) return '0'
  if (count < 1000) return count.toString()

  const suffixes = ['', 'k', 'M', 'B', 'T']
  const suffixNum = Math.floor(('' + Math.floor(count)).length / 3)
  const shortValue = parseFloat((suffixNum !== 0
    ? count / Math.pow(1000, suffixNum)
    : count
  ).toPrecision(3))
  const shortNumber = shortValue % 1 !== 0
    ? shortValue.toFixed(1)
    : shortValue
  return shortNumber + suffixes[suffixNum]
}

// Examples:
// 0 -> "0"
// 5 -> "5"
// 100 -> "100"
// 1500 -> "1.5k"
// 15000 -> "15k"
// 150000 -> "150k"
// 1500000 -> "1.5M"
```

### Caching Strategy

**Option 1: Server-Side Caching (Recommended)**

Cache view counts for a period to avoid excessive database reads:

```typescript
// app/actions/posts.ts
const viewCache = new Map<string, { count: number; timestamp: number }>()
const CACHE_TTL = 60000 // 1 minute

export async function getViewCount(postId: string): Promise<number> {
  const cached = viewCache.get(postId)
  if (cached && Date.now() - cached.timestamp < CACHE_TTL) {
    return cached.count
  }

  // Fetch from database
  const post = await getPostBySlug(slug)
  const count = post?.viewCount || 0

  viewCache.set(postId, { count, timestamp: Date.now() })
  return count
}
```

**Option 2: Incremental Counter**

Update view count asynchronously without blocking page load:

```typescript
// Server Action to track view
'use server'

export async function trackView(postId: string) {
  // Increment in background
  // Use React Query or similar for optimistic updates
}
```

**Option 3: Payload Hook**

Use Payload `beforeChange` hook to increment views:

```typescript
// collections/Posts.ts
hooks: {
  beforeRead: [
    async ({ req, doc }) => {
      // Only increment on frontend views, not admin
      if (req.query?.incrementView !== 'true') return doc

      // Increment view count
      await payload.update({
        collection: 'posts',
        id: doc.id,
        data: {
          viewCount: (doc.viewCount || 0) + 1
        }
      })

      return doc
    }
  ]
}
```

### Anti-Manipulation Measures

To prevent view count manipulation:

1. **Session-based tracking:**
   - Only count one view per session per post
   - Use sessionStorage to track viewed posts
   - Expire after 30 minutes

2. **Rate limiting:**
   - Limit increments from same IP
   - Use middleware to detect spam

3. **Bot detection:**
   - Don't count known bots
   - Check user agent strings
   - Use honeypot fields

4. **Time threshold:**
   - Require minimum time on page (e.g., 5 seconds)
   - Track with `beforeunload` event

**Implementation example:**
```typescript
// components/view-tracker.tsx
'use client'

import { useEffect, useState } from 'react'
import { trackView } from '@/app/actions/analytics'

export function ViewTracker({ postId }: { postId: string }) {
  useEffect(() => {
    // Check if already viewed in this session
    const viewed = sessionStorage.getItem(`viewed_${postId}`)
    if (viewed) return

    // Mark as viewed
    sessionStorage.setItem(`viewed_${postId}`, Date.now().toString())

    // Track after minimum time (5 seconds)
    const timeout = setTimeout(() => {
      trackView({ postId })
    }, 5000)

    return () => clearTimeout(timeout)
  }, [postId])

  return null
}
```

### Integration with Analytics System

This feature should work with the analytics system documented in `analytics-implementation.md`:

**Data flow:**
1. User visits blog post page
2. `ViewTracker` component detects new view
3. After 5 seconds, calls `trackPageView()` server action
4. Server action increments `viewCount` in Posts collection
5. Updates analytics collection entry
6. Next page load shows updated count

## Display Variations

### Minimal Style (Recommended)
```
125 views
```

### With Icon
```
👁 125 views
```

### With Label
```
125 views • 5 min read
```

### Badge Style (Alternative)
```tsx
<Badge variant="secondary" className="font-mono">
  {formatViewCount(post.viewCount)} views
</Badge>
```

### Popular Badge

Show "Popular" badge for posts with high view counts:
```tsx
{post.viewCount > 1000 && (
  <Badge variant="default" className="font-mono">
    🔥 Popular
  </Badge>
)}
```

## Implementation Plan

### Phase 1: Data Layer (1 day)
1. Add `viewCount` and `lastViewedAt` fields to Posts collection
2. Create `formatViewCount` utility function
3. Implement caching strategy
4. Add view tracking server action
5. Test basic incrementing

### Phase 2: UI Integration (1 day)
1. Add view count to blog post cards
2. Add view count to blog post detail pages
3. Style to match terminal aesthetic
4. Add icon and formatting
5. Test responsive display

### Phase 3: Anti-Manipulation (Optional)
1. Implement session tracking
2. Add time threshold (5 seconds)
3. Add bot detection
4. Test with various scenarios
5. Monitor for abuse

### Phase 4: Enhancements (Optional)
1. Add "Popular" badge for high-view posts
2. Add sorting by views in blog listing
3. Add "Most Viewed" section
4. Add view count trend (↑ ↓)
5. Export view statistics

## Performance Considerations

- **Cache aggressively:** View counts don't need to be real-time
- **Don't block rendering:** Load counts asynchronously
- **Batch updates:** If high traffic, batch database updates
- **Use CDN cache:** Cache pages with view counts in header
- **Pagination:** For listing pages, calculate view counts in one query

## Privacy Considerations

- View counts are aggregate data (no PII)
- No need for cookie consent
- No personal information stored
- GDPR compliant by design

## Accessibility

- Screen reader announcement: "125 views"
- Icon with aria-label: "View count"
- Don't use color alone to convey popularity
- Maintain sufficient contrast

## Example UI Mocks

### Blog Post Card
```
┌─────────────────────────────────────┐
│ post_article-name...            ⚙   │ ← Terminal header
├─────────────────────────────────────┤
│ [Image]                              │
│                                      │
│ TypeScript > 5m read • 1.2k views   │ ← Metadata with views
│                                      │
│ > Article Title Here                 │
│                                      │
│ Excerpt text...                      │
│                                      │
│ Jan 15, 2025                          │
│ #typescript #react                  │
│ ./read_more.sh >                    │
└─────────────────────────────────────┘
```

### Blog Post Page
```
> My Awesome Article

TypeScript > Jan 15, 2025 • 5m read • 1.2k views
─────────────────────────────────────────────────
[Article content...]
```

## Success Metrics

- View counts display accurately
- Page load time not impacted (< 100ms added)
- No manipulation of view counts detected
- User engagement increases (time on site)
- More clicks on popular articles
- Positive user feedback

## Alternatives Considered

### 1. Real-time Counter
Update count immediately on every page load.

**Pros:**
- Always accurate

**Cons:**
- Performance impact
- Database load
- Not necessary for this use case

**Decision:** Cached counts updated periodically

### 2. Client-side Only Counter
Store counts in localStorage or client-side state.

**Pros:**
- Fast
- No database load

**Cons:**
- Not persistent across users
- Can be manipulated
- Inaccurate

**Decision:** Server-side with caching

### 3. Third-party Service
Use service like Disqus or Medium.

**Pros:**
- No implementation needed

**Cons:**
- External dependency
- Privacy concerns
- Limited customization

**Decision:** Custom implementation

## Dependencies

- Posts collection (existing)
- Analytics system (from analytics-implementation.md)
- Lucide React icons (existing - `Eye` or `Users`)
- Utility functions (existing)

## Related Issues

- [Analytics Implementation](./analytics-implementation.md) - Backend tracking system
- [Markdown Paste/Import](./markdown-paste-import.md) - Content creation

## Technical Notes

### View Count vs Unique Views

This issue implements **view count** (page views), not unique visitors. Unique visitors require more complex tracking and are less impressive numbers for social proof.

### Accuracy vs Performance

View counts don't need to be perfectly accurate:
- ±5% is acceptable
- Real-time not needed
- Cached values OK
- Round numbers fine (1.2k instead of 1,247)

### Database Optimization

For high-traffic sites:
- Consider counter table pattern
- Use Redis for fast increments
- Batch updates (every minute)
- Materialized views for statistics

## Open Questions

1. Should view counts be hidden for posts with 0 views?
   - **Recommendation:** Yes, don't show or show "No views yet"

2. Should we show view counts on draft posts in admin?
   - **Recommendation:** Yes, for testing

3. Should view counts be editable by admin?
   - **Recommendation:** No, read-only to prevent manipulation

4. Cache duration?
   - **Recommendation:** 1-5 minutes for balance

5. Minimum time threshold?
   - **Recommendation:** 5 seconds to count as a view

## Future Enhancements

1. **View Count Leaderboard** - Widget showing top posts this week
2. **Trending Posts** - Posts with rapid view count increase
3. **Reading Time vs Views** - Correlation analysis
4. **Geographic Heat Map** - Views by country
5. **Referrer Breakdown** - Views by source (Google, Twitter, etc.)
