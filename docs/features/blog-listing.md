# Blog Listing Page

## Overview

Create the blog listing page at `/blog` with filtering by category and tags via query parameters.

## Page Implementation

Create `app/blog/page.tsx`:

```typescript
import { Suspense } from 'react';
import { BlogList } from '@/components/blog/blog-list';
import { BlogFilters } from '@/components/blog/blog-filters';

interface BlogPageProps {
  searchParams: {
    category?: string;
    tag?: string;
    page?: string;
  };
}

export default function BlogPage({ searchParams }: BlogPageProps) {
  return (
    <div className="container py-12">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-4xl font-bold font-mono">~/blog</h1>
        <p className="mt-2 text-muted-foreground">
          Thoughts, tutorials, and insights about technology
        </p>
      </div>

      {/* Filters */}
      <BlogFilters currentCategory={searchParams.category} currentTag={searchParams.tag} />

      {/* Posts */}
      <Suspense fallback={<BlogListSkeleton />}>
        <BlogList
          category={searchParams.category}
          tag={searchParams.tag}
          page={parseInt(searchParams.page || '1')}
        />
      </Suspense>
    </div>
  );
}
```

## Blog List Component

Create `components/blog/blog-list.tsx`:

```typescript
import { getPayloadClient } from '@/lib/payload-client';
import { ArticleList } from './article-list';
import { Pagination } from './pagination';

interface BlogListProps {
  category?: string;
  tag?: string;
  page?: number;
}

export async function BlogList({ category, tag, page = 1 }: BlogListProps) {
  const payload = await getPayloadClient();
  const pageSize = 12;

  // Build where clause
  const where: any = {
    status: {
      equals: 'published',
    },
  };

  if (category) {
    where.category = {
      equals: category,
    };
  }

  if (tag) {
    where.tags = {
      contains: tag,
    };
  }

  // Fetch posts
  const posts = await payload.find({
    collection: 'posts',
    where,
    sort: '-publishedAt',
    limit: pageSize,
    page,
    depth: 2,
  });

  const totalPages = Math.ceil(posts.totalDocs / pageSize);

  return (
    <div className="space-y-8">
      {/* Results count */}
      <div className="text-sm text-muted-foreground font-mono">
        Found {posts.totalDocs} post{posts.totalDocs !== 1 ? 's' : ''}
        {category && ` in category`}
        {tag && ` with tag`}
      </div>

      {/* Posts */}
      <ArticleList posts={posts.docs} />

      {/* Pagination */}
      {totalPages > 1 && (
        <Pagination
          currentPage={page}
          totalPages={totalPages}
          category={category}
          tag={tag}
        />
      )}
    </div>
  );
}
```

## Blog Filters Component

Create `components/blog/blog-filters.tsx`:

```typescript
'use client';

import { useRouter, useSearchParams } from 'next/navigation';
import { X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { getPayloadClient } from '@/lib/payload-client';
import { Suspense, useEffect, useState } from 'react';

function FiltersContent({ currentCategory, currentTag }: {
  currentCategory?: string;
  currentTag?: string;
}) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [categories, setCategories] = useState<any[]>([]);
  const [tags, setTags] = useState<any[]>([]);

  useEffect(() => {
    // Fetch categories and tags
    const fetchFilters = async () => {
      const payload = await getPayloadClient();

      const [categoriesData, tagsData] = await Promise.all([
        payload.find({
          collection: 'categories',
          limit: 100,
        }),
        payload.find({
          collection: 'tags',
          limit: 100,
        }),
      ]);

      setCategories(categoriesData.docs);
      setTags(tagsData.docs);
    };

    fetchFilters();
  }, []);

  const setFilter = (type: 'category' | 'tag', value?: string) => {
    const params = new URLSearchParams(searchParams.toString());

    if (value) {
      params.set(type, value);
    } else {
      params.delete(type);
    }

    // Reset to page 1 when filters change
    params.delete('page');

    router.push(`/blog?${params.toString()}`);
  };

  return (
    <div className="mb-8 space-y-4">
      {/* Active filters */}
      {(currentCategory || currentTag) && (
        <div className="flex flex-wrap items-center gap-2">
          <span className="text-sm text-muted-foreground">Active filters:</span>

          {currentCategory && (
            <Button
              variant="secondary"
              size="sm"
              onClick={() => setFilter('category')}
              className="font-mono"
            >
              Category: {categories.find(c => c.slug === currentCategory)?.name || currentCategory}
              <X className="ml-2 h-3 w-3" />
            </Button>
          )}

          {currentTag && (
            <Button
              variant="secondary"
              size="sm"
              onClick={() => setFilter('tag')}
              className="font-mono"
            >
              Tag: {tags.find(t => t.slug === currentTag)?.name || currentTag}
              <X className="ml-2 h-3 w-3" />
            </Button>
          )}

          {(currentCategory || currentTag) && (
            <Button
              variant="ghost"
              size="sm"
              onClick={() => {
                router.push('/blog');
              }}
              className="font-mono"
            >
              Clear all
            </Button>
          )}
        </div>
      )}

      {/* Filter dropdowns */}
      <div className="flex flex-wrap gap-4">
        {/* Category filter */}
        <select
          value={currentCategory || ''}
          onChange={(e) => setFilter('category', e.target.value || undefined)}
          className="rounded-md border border-border bg-card px-3 py-2 text-sm font-mono"
        >
          <option value="">All Categories</option>
          {categories.map((category) => (
            <option key={category.id} value={category.slug}>
              {category.icon} {category.name}
            </option>
          ))}
        </select>

        {/* Tag filter */}
        <select
          value={currentTag || ''}
          onChange={(e) => setFilter('tag', e.target.value || undefined)}
          className="rounded-md border border-border bg-card px-3 py-2 text-sm font-mono"
        >
          <option value="">All Tags</option>
          {tags.map((tag) => (
            <option key={tag.id} value={tag.slug}>
              #{tag.name}
            </option>
          ))}
        </select>
      </div>
    </div>
  );
}

export function BlogFilters({ currentCategory, currentTag }: {
  currentCategory?: string;
  currentTag?: string;
}) {
  return (
    <Suspense fallback={<div>Loading filters...</div>}>
      <FiltersContent currentCategory={currentCategory} currentTag={currentTag} />
    </Suspense>
  );
}
```

## Pagination Component

Create `components/blog/pagination.tsx`:

```typescript
import Link from 'next/link';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  category?: string;
  tag?: string;
}

export function Pagination({ currentPage, totalPages, category, tag }: PaginationProps) {
  const buildUrl = (page: number) => {
    const params = new URLSearchParams();
    if (category) params.set('category', category);
    if (tag) params.set('tag', tag);
    if (page > 1) params.set('page', page.toString());
    const queryString = params.toString();
    return `/blog${queryString ? `?${queryString}` : ''}`;
  };

  return (
    <div className="flex items-center justify-center gap-2">
      {/* Previous */}
      <Button
        asChild
        variant="outline"
        disabled={currentPage === 1}
        className="font-mono"
      >
        <Link href={buildUrl(currentPage - 1)}>
          <ChevronLeft className="mr-2 h-4 w-4" />
          Previous
        </Link>
      </Button>

      {/* Page numbers */}
      <div className="flex items-center gap-2">
        {Array.from({ length: totalPages }, (_, i) => i + 1)
          .filter(
            (page) =>
              page === 1 ||
              page === totalPages ||
              (page >= currentPage - 1 && page <= currentPage + 1)
          )
          .map((page, index, array) => {
            const prevPage = array[index - 1];
            const showEllipsis = prevPage && page - prevPage > 1;

            return (
              <div key={page} className="flex items-center">
                {showEllipsis && (
                  <span className="px-2 text-muted-foreground">...</span>
                )}
                <Button
                  asChild
                  variant={page === currentPage ? 'default' : 'outline'}
                  className="font-mono"
                >
                  <Link href={buildUrl(page)}>{page}</Link>
                </Button>
              </div>
            );
          })}
      </div>

      {/* Next */}
      <Button
        asChild
        variant="outline"
        disabled={currentPage === totalPages}
        className="font-mono"
      >
        <Link href={buildUrl(currentPage + 1)}>
          Next
          <ChevronRight className="ml-2 h-4 w-4" />
        </Link>
      </Button>
    </div>
  );
}
```

## Skeleton Loading

Create `components/blog/blog-list-skeleton.tsx`:

```typescript
export function BlogListSkeleton() {
  return (
    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
      {[1, 2, 3, 4, 5, 6].map((i) => (
        <div
          key={i}
          className="rounded-lg border border-border bg-card p-6 animate-pulse"
        >
          <div className="aspect-video w-full rounded bg-muted mb-4" />
          <div className="h-4 w-20 rounded bg-muted mb-3" />
          <div className="h-6 w-full rounded bg-muted mb-2" />
          <div className="h-6 w-3/4 rounded bg-muted mb-4" />
          <div className="space-y-2">
            <div className="h-4 w-16 rounded bg-muted" />
            <div className="h-4 w-20 rounded bg-muted" />
          </div>
        </div>
      ))}
    </div>
  );
}
```

## Metadata

Create `app/blog/layout.tsx`:

```typescript
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Blog',
  description: 'Thoughts, tutorials, and insights about technology and software development.',
  openGraph: {
    title: 'Blog',
    description: 'Thoughts, tutorials, and insights about technology and software development.',
    type: 'website',
  },
};

export default function BlogLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
```

## Next Steps

- [ ] Implement single post page
- [ ] Implement about page
- [ ] Implement search page
