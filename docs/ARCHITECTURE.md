# Blog Architecture

## Project Structure

```
blog/
├── app/                          # Next.js App Router
│   ├── (public)/                 # Public route group
│   │   ├── page.tsx              # Homepage (hero + articles)
│   │   ├── about/
│   │   │   └── page.tsx          # Static about page
│   │   ├── blog/
│   │   │   ├── page.tsx          # Blog listing with filters
│   │   │   └── [slug]/
│   │   │       └── page.tsx      # Single blog post
│   │   ├── category/
│   │   │   └── [slug]/
│   │   │       └── page.tsx      # Category page
│   │   ├── tag/
│   │   │   └── [slug]/
│   │   │       └── page.tsx      # Tag page
│   │   └── search/
│   │       └── page.tsx          # Search results page (client-side search)
│   ├── globals.css               # Global styles + Tailwind
│   ├── layout.tsx                # Root layout
│   ├── sitemap.ts                # Dynamic sitemap
│   └── rss/
│       └── route.ts              # RSS feed
│
├── src/                          # Source directory (optional, with src-dir flag)
│   ├── api/                      # Server Actions (tRPC-like API)
│   │   ├── posts/                # Post-related server actions
│   │   │   ├── get.ts            # Get posts with filters
│   │   │   ├── getBySlug.ts      # Get single post by slug
│   │   │   └── getRelated.ts     # Get related posts
│   │   ├── categories/           # Category server actions
│   │   │   └── index.ts          # Get all categories
│   │   ├── tags/                 # Tag server actions
│   │   │   └── index.ts          # Get all tags
│   │   ├── search/               # Search server actions
│   │   │   └── query.ts          # Local search algorithm
│   │   └── index.ts              # Main export: `export { api }`
│   │
│   ├── components/               # React components
│   │   ├── ui/                   # shadcn/ui components (atomic)
│   │   │   ├── button.tsx
│   │   │   ├── card.tsx
│   │   │   ├── input.tsx
│   │   │   ├── badge.tsx
│   │   │   ├── separator.tsx
│   │   │   └── ...
│   │   │
│   │   ├── layout/               # Common layout components
│   │   │   ├── header/
│   │   │   │   ├── header.tsx
│   │   │   │   ├── nav.tsx
│   │   │   │   ├── mobile-menu.tsx
│   │   │   │   └── index.ts
│   │   │   ├── footer/
│   │   │   │   ├── footer.tsx
│   │   │   │   ├── social-links.tsx
│   │   │   │   └── index.ts
│   │   │   ├── sidebar/
│   │   │   │   ├── sidebar.tsx
│   │   │   │   ├── sidebar-section.tsx
│   │   │   │   └── index.ts
│   │   │   └── containers/
│   │   │       ├── page-container.tsx
│   │   │       ├── content-wrapper.tsx
│   │   │       └── index.ts
│   │   │
│   │   ├── posts/                # Post-specific components
│   │   │   ├── post-card/
│   │   │   │   ├── post-card.tsx
│   │   │   │   ├── post-card-skeleton.tsx
│   │   │   │   └── index.ts
│   │   │   ├── post-header/
│   │   │   │   ├── post-header.tsx
│   │   │   │   ├── post-meta.tsx
│   │   │   │   └── index.ts
│   │   │   ├── post-content/
│   │   │   │   ├── post-content.tsx
│   │   │   │   ├── prose.tsx
│   │   │   │   └── index.ts
│   │   │   ├── post-list/
│   │   │   │   ├── post-list.tsx
│   │   │   │   ├── post-grid.tsx
│   │   │   │   └── index.ts
│   │   │   └── related-posts/
│   │   │       ├── related-posts.tsx
│   │   │       └── index.ts
│   │   │
│   │   ├── categories/           # Category-specific components
│   │   │   ├── category-badge/
│   │   │   │   ├── category-badge.tsx
│   │   │   │   └── index.ts
│   │   │   ├── category-list/
│   │   │   │   ├── category-list.tsx
│   │   │   │   └── index.ts
│   │   │   └── category-card/
│   │   │       ├── category-card.tsx
│   │   │       └── index.ts
│   │   │
│   │   ├── tags/                 # Tag-specific components
│   │   │   ├── tag-badge/
│   │   │   │   ├── tag-badge.tsx
│   │   │   │   └── index.ts
│   │   │   ├── tag-cloud/
│   │   │   │   ├── tag-cloud.tsx
│   │   │   │   └── index.ts
│   │   │   └── tag-list/
│   │   │       ├── tag-list.tsx
│   │   │       └── index.ts
│   │   │
│   │   ├── search/               # Search-specific components
│   │   │   ├── search-bar/
│   │   │   │   ├── search-bar.tsx
│   │   │   │   ├── search-input.tsx
│   │   │   │   └── index.ts
│   │   │   ├── search-results/
│   │   │   │   ├── search-results.tsx
│   │   │   │   ├── search-filters.tsx
│   │   │   │   └── index.ts
│   │   │   └── search-suggestion/
│   │   │       ├── search-suggestion.tsx
│   │   │       └── index.ts
│   │   │
│   │   ├── home/                 # Homepage-specific components
│   │   │   ├── hero/
│   │   │   │   ├── hero.tsx
│   │   │   │   ├── hero-terminal.tsx
│   │   │   │   └── index.ts
│   │   │   ├── featured-posts/
│   │   │   │   ├── featured-posts.tsx
│   │   │   │   └── index.ts
│   │   │   └── latest-posts/
│   │   │       ├── latest-posts.tsx
│   │   │       └── index.ts
│   │   │
│   │   └── shared/               # Shared multi-feature components
│   │       ├── metadata/
│   │       │   ├── publish-date.tsx
│   │       │   ├── reading-time.tsx
│   │       │   └── index.ts
│   │       ├── feedback/
│   │       │   ├── error-boundary.tsx
│   │       │   ├── error-message.tsx
│   │       │   ├── empty-state.tsx
│   │       │   └── index.ts
│   │       └── loading/
│   │           ├── page-skeleton.tsx
│   │           ├── card-skeleton.tsx
│   │           └── index.ts
│   │
│   ├── core/                     # Core business logic (no DB)
│   │   ├── validators/           # Input validation schemas
│   │   │   └── index.ts          # Zod schemas
│   │   ├── formatters/           # Data formatting
│   │   │   ├── date.ts           # Date formatting
│   │   │   ├── text.ts           # Text truncation, etc.
│   │   │   └── index.ts
│   │   ├── constants/            # App constants
│   │   │   ├── breakpoints.ts    # Responsive breakpoints
│   │   │   ├── routes.ts         # Route constants
│   │   │   └── index.ts
│   │   ├── utils/                # Pure utility functions
│   │   │   ├── cn.ts             # Class name merger (clsx + tailwind-merge)
│   │   │   ├── debounce.ts       # Debounce utility
│   │   │   └── index.ts
│   │   └── types/                # Shared types (non-DB)
│   │       ├── index.ts          # Common types
│   │       └── api.ts            # API input/output types
│   │
│   ├── hooks/                    # ALL hooks use TanStack Query
│   │   ├── use-posts.ts          # Posts queries & mutations
│   │   ├── use-categories.ts     # Categories queries
│   │   ├── use-tags.ts           # Tags queries
│   │   ├── use-search.ts         # Search with real-time feel
│   │   ├── use-theme.ts          # Theme (Zustand)
│   │   └── index.ts              # Export all hooks
│   │
│   ├── lib/                      # External integrations
│   │   ├── payload-client.ts     # Payload client config
│   │   └── utils.ts              # Legacy utils (prefer @/core)
│   │
│   └── stores/                   # State management (Zustand)
│       ├── theme-store.ts        # Theme state
│       └── index.ts
│
├── payload/                      # PayloadCMS configuration
│   ├── collections/              # Data collections
│   │   ├── Admins.ts             # Admin users collection
│   │   ├── Posts.ts              # Blog posts collection
│   │   ├── Categories.ts         # Categories collection
│   │   ├── Tags.ts               # Tags collection
│   │   └── Media.ts              # Media uploads (S3)
│   ├── globals.ts                # Global config
│   ├── types.ts                  # TypeScript types
│   └── init.ts                   # Payload initialization
│
├── public/                       # Static assets
│   └── images/                   # Static images
│
├── docs/                         # Documentation
│   ├── PROJECT.md                # Project overview
│   ├── ARCHITECTURE.md           # This file
│   └── CICD.md                   # CI/CD strategy
│
└── package.json
```

## Database Schema

### Admins Collection

```typescript
{
  email: string;              // Admin email (unique)
  name: string;               // Admin display name
  password: string;           // Hashed password
  role: 'admin';              // Admin role (single role)
  createdAt: Date;            // Account creation date
}
```

### Posts Collection

```typescript
{
  title: string;              // Post title
  slug: string;               // URL-friendly unique identifier
  content: RichText;          // Rich text content (Payload editor)
  excerpt: string;            // Short description/summary
  coverImage: Upload;         // Featured image (S3)
  category: Category;         // Single category relation
  tags: Tag[];                // Multiple tags relation
  publishedAt: Date;          // Publication date
  createdAt: Date;            // Creation date
  updatedAt: Date;            // Last update date
  status: 'draft' | 'published';
  relatedPosts: Post[];       // Related posts links
}
```

### Categories Collection

```typescript
{
  name: string;               // Display name
  slug: string;               // URL-friendly unique identifier
  description?: string;       // Optional description
  icon?: string;              // Optional emoji or icon name
}
```

### Tags Collection

```typescript
{
  name: string;               // Display name
  slug: string;               // URL-friendly unique identifier
  color?: string;             // Optional hex color
}
```

### Media Collection

```typescript
{
  filename: string;           // Original filename
  mimeType: string;           // File type (image/png, etc.)
  filesize: number;           // File size in bytes
  url: string;                // S3 URL
  alt?: string;               // Alt text for accessibility
  width?: number;             // Image width (if image)
  height?: number;            // Image height (if image)
}
```

## Search Algorithm

### Architecture

**Client-side + Server Action hybrid approach:**

1. **Client Component** (`search-bar.tsx`): Captures search input with debounce
2. **Server Action** (`@/api/search/search-posts.ts`): Executes search on server
3. **TanStack Query**: Caches search results and manages loading/error states

### Local Search Strategy

Given the modest number of posts, a local search algorithm is sufficient:

```typescript
interface SearchOptions {
  query: string;
  category?: string;
  tag?: string;
  limit?: number;
  page?: number;
}

interface SearchResult {
  posts: Post[];
  totalResults: number;
  totalPages: number;
}
```

**Scoring System:**
- Title match: 10 points
- Excerpt match: 5 points
- Content match: 1 point
- Combined score for ranking

**Implementation (Server Action):**
1. Server Action receives search query and filters
2. Fetches all published posts from Payload (cached)
3. Filters by category/tag if provided
4. Searches across title, excerpt, and content
5. Calculates relevance scores
6. Sorts by score and date
7. Returns paginated results

**Client Integration:**
- TanStack Query manages the server action call
- Debounced search input (300ms delay)
- Loading and error states handled automatically
- Results cached for identical queries

## Technical Stack & Patterns

### API Layer Architecture

**Principles:**
- ✅ **Pure Functions** - No side effects, predictable
- ✅ **No OOP** - No classes, no services, no constructors
- ✅ **No Services** - Just functions and types
- ✅ **Type-Safe** - Full TypeScript coverage
- ✅ **tRPC-like** - Single `api` object, nested calls

**Example Structure:**

```typescript
// src/api/posts/get.ts
'use server';

import { getPayload } from 'payload';
import config from '@/payload/init';

export interface GetPostsInput {
  status?: 'draft' | 'published';
  category?: string;
  tag?: string;
  limit?: number;
  page?: number;
}

export async function getPosts(input: GetPostsInput) {
  const payload = await getPayload({ config });

  const where = {
    ...(input.status && { status: input.status }),
    ...(input.category && { category: { equals: input.category } }),
    ...(input.tag && { tags: { contains: input.tag } }),
  };

  const result = await payload.find({
    collection: 'posts',
    where,
    limit: input.limit || 10,
    page: input.page || 1,
    sort: '-publishedAt',
  });

  return {
    posts: result.docs,
    totalPages: result.totalPages,
    totalDocs: result.totalDocs,
  };
}
```

```typescript
// src/api/posts/index.ts
export { getPosts as get } from './get';
export { getPostBySlug as getBySlug } from './getBySlug';
export { getRelatedPosts as getRelated } from './getRelated';

export type { GetPostsInput, GetPostsOutput } from './get';
export type { GetPostBySlugInput, GetPostBySlugOutput } from './getBySlug';
```

```typescript
// src/api/index.ts - Main entry point
export { api } from './api';

// Re-export types if needed
export type { Post, Category, Tag } from '@/payload-types';
```

```typescript
// src/api/api.ts - API aggregator
import * as posts from './posts';
import * as categories from './categories';
import * as tags from './tags';
import * as search from './search';

export const api = {
  posts,
  categories,
  tags,
  search,
};
```

**Usage in Components:**

```typescript
// Server Component
import { api } from '@/api';

export default async function HomePage() {
  const { posts } = await api.posts.get({
    status: 'published',
    limit: 6,
  });

  return <PostList posts={posts} />;
}
```

```typescript
// Client Component + TanStack Query
'use client';

import { useQuery } from '@tanstack/react-query';
import { api } from '@/api';

export function PostList() {
  const { data, isLoading } = useQuery({
    queryKey: ['posts'],
    queryFn: () => api.posts.get({ status: 'published' }),
  });

  if (isLoading) return <Skeleton />;
  return <Posts posts={data.posts} />;
}
```

**Key Benefits:**
- 🎯 **Single Import** - `import { api } from '@/api'`
- 🔒 **Type-Safe** - Full autocomplete and type checking
- 🧹 **Clean** - No classes, no services, just functions
- 🔄 **Testable** - Pure functions are easy to test
- 📦 **Organized** - Logical grouping by domain
- 🚀 **Fast** - No overhead, direct function calls

### State Management

**TanStack Query (React Query)** - ALL Server State
- **Every hook uses TanStack Query**
- Real-time feel with smart caching
- Optimistic updates for instant feedback
- Background refetch for fresh data
- Stale-while-revalidate strategy

**Zustand** - Client State
- Lightweight global state
- Theme, UI preferences, mobile menu
- Used only when Context insufficient

**React Context** - Tree State
- Theme provider, auth, feature flags
- Preferred for simple nested state

### Real-Time Mentalité

**Philosophy:**
Even though it's a blog, everything should feel real-time and responsive.

**TanStack Query Configuration:**
```typescript
// Default query config for real-time feel
const defaultOptions = {
  staleTime: 1000 * 60, // 1 minute
  gcTime: 1000 * 60 * 5, // 5 minutes
  refetchOnWindowFocus: true,
  refetchOnReconnect: true,
  retry: 3,
  refetchInterval: false, // Only when needed
};
```

**Optimistic Updates (Example):**
```typescript
// Future: Like button with optimistic update
const likeMutation = useMutation({
  mutationFn: (postId: string) => api.posts.like(postId),
  onMutate: async (postId) => {
    // Cancel current queries
    await queryClient.cancelQueries({ queryKey: ['posts'] });

    // Snapshot previous value
    const previous = queryClient.getQueryData(['posts']);

    // Optimistically update
    queryClient.setQueryData(['posts'], (old) => ({
      ...old,
      posts: old.posts.map((p) =>
        p.id === postId ? { ...p, likes: p.likes + 1 } : p
      ),
    }));

    return { previous };
  },
  onError: (err, postId, context) => {
    // Rollback on error
    queryClient.setQueryData(['posts'], context.previous);
  },
});
```

### Hooks Architecture

**All hooks in @/hooks, all use TanStack Query:**

```typescript
// src/hooks/use-posts.ts
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { api } from '@/api';

export function usePosts(options: GetPostsInput = {}) {
  return useQuery({
    queryKey: ['posts', options],
    queryFn: () => api.posts.get(options),
    staleTime: 1000 * 60, // 1 minute
  });
}

export function usePost(slug: string) {
  return useQuery({
    queryKey: ['post', slug],
    queryFn: () => api.posts.getBySlug({ slug }),
    staleTime: 1000 * 60 * 5, // 5 minutes (posts change less often)
  });
}

export function useInfinitePosts(options: GetPostsInput = {}) {
  return useInfiniteQuery({
    queryKey: ['posts', 'infinite', options],
    queryFn: ({ pageParam = 1 }) =>
      api.posts.get({ ...options, page: pageParam }),
    initialPageParam: 1,
    getNextPageParam: (lastPage) => {
      if (lastPage.page < lastPage.totalPages) {
        return lastPage.page + 1;
      }
      return undefined;
    },
  });
}
```

```typescript
// src/hooks/use-search.ts
import { useQuery } from '@tanstack/react-query';
import { api } from '@/api';
import { useState } from 'react';
import { debounce } from '@/core/utils';

export function useSearch() {
  const [query, setQuery] = useState('');

  const debouncedQuery = useMemo(
    () => debounce((q: string) => q, 300),
    []
  );

  const searchQuery = useQuery({
    queryKey: ['search', query],
    queryFn: () => api.search.query({ q: debouncedQuery(query) }),
    enabled: query.length > 2,
    staleTime: 1000 * 30, // 30 seconds (search results age faster)
  });

  return {
    query,
    setQuery,
    results: searchQuery.data,
    isLoading: searchQuery.isLoading,
    isError: searchQuery.isError,
  };
}
```

```typescript
// src/hooks/use-categories.ts
import { useQuery } from '@tanstack/react-query';
import { api } from '@/api';

export function useCategories() {
  return useQuery({
    queryKey: ['categories'],
    queryFn: () => api.categories.getAll(),
    staleTime: 1000 * 60 * 10, // 10 minutes (rarely change)
  });
}

export function useCategory(slug: string) {
  return useQuery({
    queryKey: ['category', slug],
    queryFn: () => api.categories.getBySlug({ slug }),
    staleTime: 1000 * 60 * 10,
  });
}
```

```typescript
// src/hooks/use-tags.ts
import { useQuery } from '@tanstack/react-query';
import { api } from '@/api';

export function useTags() {
  return useQuery({
    queryKey: ['tags'],
    queryFn: () => api.tags.getAll(),
    staleTime: 1000 * 60 * 10, // 10 minutes
  });
}

export function useTag(slug: string) {
  return useQuery({
    queryKey: ['tag', slug],
    queryFn: () => api.tags.getBySlug({ slug }),
    staleTime: 1000 * 60 * 10,
  });
}
```

**Usage Pattern:**
```typescript
'use client';

import { usePosts, usePost } from '@/hooks';

// Server Component style but with real-time feel
export function LatestPosts() {
  const { data, isLoading, error } = usePosts({
    status: 'published',
    limit: 6,
    sort: '-publishedAt',
  });

  if (isLoading) return <PostListSkeleton />;
  if (error) return <ErrorMessage error={error} />;

  return <PostList posts={data.posts} />;
}
```

**Key Differences:**

| Approach | Use Case | Pros | Cons |
|----------|----------|------|------|
| Server Component | Initial page load | Zero client JS, faster | No interactivity |
| Client + Query | User interactions | Real-time updates | More client JS |

**Best Practice:**
- Use **Server Components** by default
- Use **hooks from @/hooks** for interactivity
- Every hook returns `{ data, isLoading, error, isError }`
- Real-time feel with smart stale times

### Core Business Logic (@/core)

**No database, pure business logic:**

```typescript
// src/core/validators/index.ts
import { z } from 'zod';

export const searchInputSchema = z.object({
  q: z.string().min(2),
  category: z.string().optional(),
  tag: z.string().optional(),
  limit: z.number().min(1).max(100).default(10),
});

export type SearchInput = z.infer<typeof searchInputSchema>;
```

```typescript
// src/core/formatters/date.ts
export function formatDate(date: Date | string): string {
  return new Intl.DateTimeFormat('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  }).format(new Date(date));
}

export function formatReadingTime(minutes: number): string {
  if (minutes < 1) return '1 min read';
  return `${minutes} min read`;
}

export function getRelativeTime(date: Date | string): string {
  const now = new Date();
  const past = new Date(date);
  const seconds = Math.floor((now.getTime() - past.getTime()) / 1000);

  if (seconds < 60) return 'just now';
  if (seconds < 3600) return `${Math.floor(seconds / 60)}m ago`;
  if (seconds < 86400) return `${Math.floor(seconds / 3600)}h ago`;
  return `${Math.floor(seconds / 86400)}d ago`;
}
```

```typescript
// src/core/formatters/text.ts
export function truncate(text: string, maxLength: number): string {
  if (text.length <= maxLength) return text;
  return text.slice(0, maxLength).trim() + '...';
}

export function slugify(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^\w\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .trim();
}
```

```typescript
// src/core/constants/breakpoints.ts
export const BREAKPOINTS = {
  sm: 640,
  md: 768,
  lg: 1024,
  xl: 1280,
  '2xl': 1536,
} as const;

export type Breakpoint = keyof typeof BREAKPOINTS;
```

```typescript
// src/core/utils/debounce.ts
export function debounce<T extends (...args: any[]) => any>(
  fn: T,
  delay: number
): (...args: Parameters<T>) => void {
  let timeoutId: NodeJS.Timeout;

  return (...args: Parameters<T>) => {
    clearTimeout(timeoutId);
    timeoutId = setTimeout(() => fn(...args), delay);
  };
}
```

```typescript
// src/core/utils/cn.ts
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}
```

**Core Principles:**
- ✅ Pure functions, no side effects
- ✅ No database access
- ✅ No API calls
- ✅ Fully typed with TypeScript
- ✅ Testable in isolation
- ✅ Reusable across the app

**When to use @/core vs @/lib:**
| @/core | @/lib |
|--------|--------|
| Business logic | External integrations |
| Pure functions | Payload client |
| Validators, formatters | Third-party configs |
| App-specific utilities | Library wrappers |

### Component Organization

**Principles:**
- ✅ **Feature-based grouping** - Posts, categories, tags, search, home
- ✅ **Layout separation** - Header, footer, sidebar isolated
- ✅ **Shared components** - Reusable across features
- ✅ **No mixing** - Never mix feature-specific with common components
- ✅ **Index exports** - Each folder has an index.ts for clean imports

**Folder Structure Rules:**

```
components/
├── ui/              # Atomic primitives (shadcn/ui) - Button, Card, Input...
├── layout/          # Layout ONLY (header, footer, sidebar)
├── [feature]/       # Feature-specific (posts, categories, tags...)
│   └── [component]/
│       ├── [component].tsx
│       ├── [component]-test.tsx        # Tests alongside
│       ├── [component]-skeleton.tsx    # Loading state
│       └── index.ts                    # Re-exports
└── shared/          # Cross-feature business logic
    ├── metadata/     # PublishDate, ReadingTime...
    ├── feedback/     # ErrorBoundary, EmptyState...
    └── loading/      # PageSkeleton, CardSkeleton...
```

**IMPORTANT:**
- `ui/` = shadcn/ui primitives (Button, Card, Input, Badge...)
- NO custom button components - use `ui/button`
- NO custom card components - use `ui/card`
- `shared/` = business logic components ONLY

**Component Folder Pattern:**

Each complex component gets its own folder:

```typescript
// components/posts/post-card/post-card.tsx
export function PostCard({ post }: PostCardProps) {
  return (
    <article className="card">
      <PostCardHeader post={post} />
      <PostCardContent post={post} />
      <PostCardFooter post={post} />
    </article>
  );
}

// components/posts/post-card/post-card-skeleton.tsx
export function PostCardSkeleton() {
  return (
    <article className="card">
      <Skeleton className="h-48 w-full" />
      <Skeleton className="h-4 w-3/4 mt-4" />
      <Skeleton className="h-4 w-1/2 mt-2" />
    </article>
  );
}

// components/posts/post-card/index.ts
export { PostCard } from './post-card';
export { PostCardSkeleton } from './post-card-skeleton';
```

**Import Conventions:**

```typescript
// ✅ GOOD - Feature-specific imports
import { PostCard, PostCardSkeleton } from '@/components/posts/post-card';
import { CategoryBadge } from '@/components/categories/category-badge';
import { Header } from '@/components/layout/header';

// ❌ BAD - Don't import from nested paths
import { PostCard } from '@/components/posts/post-card/post-card';

// ✅ GOOD - Layout components
import { Header, Footer, Sidebar } from '@/components/layout';

// ✅ GOOD - Shared components
import { Skeleton, ErrorMessage } from '@/components/shared';
import { Button } from '@/components/ui';
```

**Component Categorization:**

| Category | Location | Examples | Rules |
|----------|----------|----------|-------|
| **UI** | `components/ui/` | Button, Card, Input, Badge | shadcn/ui primitives - NO custom versions |
| **Layout** | `components/layout/` | Header, Footer, Sidebar | Feature-agnostic, reusable layout |
| **Feature** | `components/[feature]/` | Posts, Categories, Tags | Feature-specific, cohesive |
| **Shared** | `components/shared/` | Metadata, Feedback, Loading | Cross-feature BUSINESS logic |

**Naming Conventions:**

```typescript
// Component files: kebab-case
post-card.tsx
category-badge.tsx
search-bar.tsx

// Component exports: PascalCase
export function PostCard() {}
export function CategoryBadge() {}
export function SearchBar() {}

// Folders: kebab-case
components/posts/post-card/
components/categories/category-badge/
components/search/search-bar/

// Index files: export with same name
// components/posts/post-card/index.ts
export { PostCard } from './post-card';
```

**File Organization Rules:**

1. **One component per folder** (if complex)
2. **Tests alongside components** (post-card.test.tsx)
3. **Subcomponents** in same folder (PostCardHeader.tsx)
4. **Variants** in same folder (PostCardSkeleton.tsx)
5. **Always export from index.ts**

**Example: Complete Component Structure**

```typescript
// components/posts/post-list/post-list.tsx
import { PostCard } from '../post-card';

export function PostList({ posts }: PostListProps) {
  if (posts.length === 0) return <EmptyState />;

  return (
    <div className="grid gap-6">
      {posts.map((post) => (
        <PostCard key={post.id} post={post} />
      ))}
    </div>
  );
}

// components/posts/post-list/post-grid.tsx
export function PostGrid({ posts }: PostGridProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {posts.map((post) => (
        <PostCard key={post.id} post={post} />
      ))}
    </div>
  );
}

// components/posts/post-list/index.ts
export { PostList } from './post-list';
export { PostGrid } from './post-grid';
```

**When to Create a New Feature Folder:**

✅ **Create separate folder when:**
- Component has 3+ related subcomponents
- Component will have variants/skeletons/tests
- Component is reused in multiple places
- Component has complex logic

❌ **Keep in existing folder when:**
- Simple, single-use component
- Minimal logic (< 50 lines)
- Won't have tests or variants

**Anti-Patterns to Avoid:**

```typescript
// ❌ BAD - Don't create custom UI primitives
import { Button } from '@/components/shared/button';  // Wrong!
import { MyCard } from '@/components/posts/card';     // Wrong!

// ✅ GOOD - Use shadcn/ui primitives
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';

// ❌ BAD - Feature component in shared
import { PostCard } from '@/components/shared/post-card';

// ✅ GOOD - Feature component in feature folder
import { PostCard } from '@/components/posts/post-card';

// ❌ BAD - Layout component in features
import { Header } from '@/components/posts/header';

// ✅ GOOD - Layout in layout/
import { Header } from '@/components/layout/header';

// ❌ BAD - Business logic in ui/
import { PublishDate } from '@/components/ui/publish-date';

// ✅ GOOD - Business logic in shared/
import { PublishDate } from '@/components/shared/metadata';
```

**UI Primitives (from shadcn/ui):**
- Button, Card, Input, Badge, Separator, etc.
- ✅ Always use `@/components/ui/*`
- ❌ NEVER create custom versions in other folders

**Shared Components (business logic):**
- PublishDate, ReadingTime, ErrorBoundary, EmptyState
- ✅ Use for cross-feature business logic
- ❌ NOT for UI primitives

**Export Strategy:**

```typescript
// Option 1: Named exports (preferred for components)
export { PostCard } from './post-card';

// Option 2: Default export (only for single-component files)
export default function PostCard() {}

// Option 3: Re-export from index
export * from './post-list';
export { PostCard } from './post-card';
```

### When to Use What

| Scenario | Approach | Example |
|----------|----------|---------|
| Static content | Server Component | Homepage hero |
| Initial data | Server Component + `api.posts.get()` | Blog listing |
| User search | Client Component + Query + `api.search.query()` | Search bar |
| Filters/sorting | Client Component + Query + `api.posts.get()` | Category filter |
| Real-time updates | Query with refetchInterval | (rarely needed) |
| Simple UI state | useState | Form input |
| Global app state | Zustand | Theme, sidebar |
| Tree state | Context | Auth, theme provider |

**Rule of Thumb:**
1. Start with Server Component
2. Add 'use client' only if needed for interactivity
3. Use TanStack Query only for user-triggered data changes

## Routing Strategy

### Public Routes (App Router)

| Route | Purpose | Caching Strategy |
|-------|---------|------------------|
| `/` | Homepage | ISR (revalidate every hour) |
| `/about` | About page | Static |
| `/blog` | Blog listing | ISR (revalidate every hour) |
| `/blog/[slug]` | Single post | ISR (revalidate on demand) |
| `/category/[slug]` | Category page | ISR (revalidate every hour) |
| `/tag/[slug]` | Tag page | ISR (revalidate every hour) |
| `/search` | Search | No cache (dynamic) |

### Server Actions

All server operations use **Next.js Server Actions**, not API routes.

**API Structure (tRPC-like):**
```typescript
// Single entry point
import { api } from '@/api';

// Usage
await api.posts.get({ status: 'published', limit: 10 });
await api.posts.getBySlug({ slug: 'my-post' });
await api.categories.getAll();
await api.tags.getAll();
await api.search.query({ q: 'react', category: 'tech' });
```

**File Organization:**
```
src/api/
├── posts/
│   ├── get.ts          → api.posts.get()
│   ├── getBySlug.ts    → api.posts.getBySlug()
│   └── getRelated.ts   → api.posts.getRelated()
├── categories/
│   └── index.ts        → api.categories.getAll()
├── tags/
│   └── index.ts        → api.tags.getAll()
├── search/
│   └── query.ts        → api.search.query()
└── index.ts            → Main export (aggregates all)
```

### Why Server Actions?

- ✅ No `/api` routes clutter
- ✅ Direct server function calls
- ✅ Type-safe with TypeScript
- ✅ Automatic error handling
- ✅ Progressive enhancement with React Server Components
- ✅ tRPC-like API without the complexity
- ✅ Pure functions, no OOP overhead

## PayloadCMS Integration

### Server vs Client Access

**Server Components & Server Actions:**
- Direct Payload import
- Type-safe access to collections
- No network overhead
- Best for initial page loads

**Client Components (via Server Actions):**
- Server Actions wrap Payload calls
- Client never accesses Payload directly
- Type-safe with TypeScript
- TanStack Query handles caching

### Why This Approach?

- ✅ **Security**: Client never has direct database access
- ✅ **Type Safety**: Full TypeScript coverage
- ✅ **Performance**: Server Components reduce client JS
- ✅ **Caching**: TanStack Query prevents duplicate requests
- ✅ **Simplicity**: No REST API routes to maintain

### Admin Access

- Protected route: `/admin`
- Admin users managed via `Admins` collection
- Email/password authentication
- Managed via Payload's built-in auth

## Image Handling

### Upload Flow

1. Author uploads image via Payload admin
2. Image stored in AWS S3 bucket
3. Payload stores metadata in PostgreSQL
4. Next.js Image component for optimization
5. Blur placeholder generated automatically

### Image Sizes

Responsive images with:
- 16:9 aspect ratio for cover images
- WebP/AVIF formats
- Lazy loading
- Progressive loading with blur

## SEO Implementation

### Meta Tags

Each page includes:
- Title and description
- Open Graph tags
- Twitter Card tags
- Canonical URL
- Schema.org JSON-LD

### Sitemap

Dynamic sitemap generated at `/sitemap.xml`:
- All published posts
- Category and tag pages
- Static pages (about, blog listing)
- Updated automatically

### RSS Feed

Feed generated at `/rss`:
- Recent posts (last 50)
- Full content or excerpts
- Standard RSS 2.0 format

## Performance Optimization

### Next.js Features

- **ISR (Incremental Static Regeneration)**: Blog posts and listings
- **Server Components**: Reduce client JavaScript
- **Streaming**: Progressive page rendering
- **Image Optimization**: Next.js Image component

### Caching Strategy

- Static pages: Edge cache
- Blog posts: ISR with revalidation
- API routes: Short cache where appropriate
- Images: Long cache with CDN

## Styling Architecture

### Tailwind Configuration

```javascript
module.exports = {
  theme: {
    extend: {
      colors: {
        background: '#000000',
        foreground: '#ffffff',
        card: '#0a0a0a',
        'card-hover': '#111111',
        border: '#333333',
        primary: '#0070f3', // Vercel blue
        'primary-hover': '#0060df',
      },
      fontFamily: {
        mono: ['var(--font-geist-mono)'],
        sans: ['var(--font-geist-sans)'],
      },
    },
  },
}
```

### Component Patterns

- Server components by default
- Client components only when needed (interactivity)
- Compound components for complex UI
- Consistent props interfaces

## Deployment

### Vercel Configuration

```javascript
// vercel.json
{
  "buildCommand": "pnpm build",
  "devCommand": "pnpm dev",
  "installCommand": "pnpm install",
  "framework": "nextjs",
  "regions": ["iad1"] // US East
}
```

### Environment Variables

```env
# Database
DATABASE_URL=
# Payload
PAYLOAD_SECRET=
# AWS S3
S3_BUCKET_NAME=
S3_REGION=
S3_ACCESS_KEY_ID=
S3_SECRET_ACCESS_KEY=
S3_ENDPOINT=  # Optional: for S3-compatible services
# Vercel Postgres
POSTGRES_URL=
POSTGRES_PRISMA_URL=
POSTGRES_URL_NON_POOLING=
```

## Security Considerations

- Payload admin protected with auth
- CSRF protection on API routes
- Rate limiting on search endpoint
- Secure headers (CSP, XSS protection)
- Environment variables for secrets
- No sensitive data in client code

## Development Workflow

### Local Development

1. Install dependencies: `pnpm install`
2. Setup environment variables
3. Run database migrations
4. Start dev server: `pnpm dev`
5. Access Payload admin: `http://localhost:3000/admin`

### Production Deployment

1. Push to `main` branch
2. Vercel auto-deploys
3. Database migrations run automatically
4. CDN caching enabled by default

## Future Extensibility

### Potential Additions

- Newsletter signup (Resend, Mailchimp)
- Comment system (giscus, Commento)
- Analytics (Vercel Analytics, Plausible)
- Webmentions
- Multiple authors
- Post series/collections
- Code syntax highlighting
- Mermaid diagrams
- Reading time estimation

### Architecture Enabling Growth

- Modular component structure
- Type-safe database access
- Clear separation of concerns
- Documented patterns
- Scalable caching strategy
