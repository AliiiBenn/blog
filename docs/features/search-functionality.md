# Search Functionality

## Overview

Implement a local search feature using a custom algorithm. The search will work across post titles, excerpts, and content with relevance scoring.

## Search Algorithm

Create `lib/search.ts`:

```typescript
import { getPayloadClient } from '@/lib/payload-client';

export interface SearchOptions {
  query: string;
  category?: string;
  tag?: string;
  limit?: number;
  page?: number;
}

export interface SearchResult {
  posts: any[];
  totalResults: number;
  totalPages: number;
  currentPage: number;
}

export async function searchPosts(options: SearchOptions): Promise<SearchResult> {
  const { query, category, tag, limit = 12, page = 1 } = options;

  if (!query.trim()) {
    return {
      posts: [],
      totalResults: 0,
      totalPages: 0,
      currentPage: 1,
    };
  }

  const payload = await getPayloadClient();

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

  // Fetch all posts (we need to fetch all for relevance scoring)
  const allPosts = await payload.find({
    collection: 'posts',
    where,
    sort: '-publishedAt',
    limit: 1000, // Adjust based on expected post count
    depth: 2,
  });

  // Tokenize query
  const queryTokens = query
    .toLowerCase()
    .split(/\s+/)
    .filter((token) => token.length > 0);

  // Score each post
  const scoredPosts = allPosts.docs.map((post) => {
    let score = 0;

    const title = post.title?.toLowerCase() || '';
    const excerpt = post.excerpt?.toLowerCase() || '';
    const content = JSON.stringify(post.content).toLowerCase();

    queryTokens.forEach((token) => {
      // Title matches - highest weight
      if (title.includes(token)) {
        score += 10;
        if (title === token) score += 5; // Exact match bonus
      }

      // Excerpt matches - medium weight
      if (excerpt.includes(token)) {
        score += 5;
        if (excerpt === token) score += 2;
      }

      // Content matches - lower weight
      if (content.includes(token)) {
        score += 1;
      }
    });

    return {
      ...post,
      _score: score,
    };
  });

  // Filter posts with score > 0 and sort by score
  const filteredPosts = scoredPosts
    .filter((post) => post._score > 0)
    .sort((a, b) => {
      // First by score, then by date
      if (b._score !== a._score) {
        return b._score - a._score;
      }
      return new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime();
    });

  const totalResults = filteredPosts.length;
  const totalPages = Math.ceil(totalResults / limit);

  // Paginate
  const start = (page - 1) * limit;
  const paginatedPosts = filteredPosts.slice(start, start + limit);

  return {
    posts: paginatedPosts,
    totalResults,
    totalPages,
    currentPage: page,
  };
}
```

## Search API Route

Create `app/api/search/route.ts`:

```typescript
import { NextRequest, NextResponse } from 'next/server';
import { searchPosts } from '@/lib/search';

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;

  const query = searchParams.get('q') || '';
  const category = searchParams.get('category') || undefined;
  const tag = searchParams.get('tag') || undefined;
  const page = parseInt(searchParams.get('page') || '1');
  const limit = parseInt(searchParams.get('limit') || '12');

  try {
    const results = await searchPosts({
      query,
      category,
      tag,
      limit,
      page,
    });

    return NextResponse.json(results);
  } catch (error) {
    console.error('Search error:', error);
    return NextResponse.json(
      { error: 'Search failed' },
      { status: 500 }
    );
  }
}
```

## Search Page

Create `app/search/page.tsx`:

```typescript
'use client';

import { useSearchParams } from 'next/navigation';
import { useState, useEffect } from 'react';
import { SearchBar } from '@/components/blog/search-bar';
import { ArticleList } from '@/components/blog/article-list';
import { Pagination } from '@/components/blog/pagination';

export default function SearchPage() {
  const searchParams = useSearchParams();
  const initialQuery = searchParams.get('q') || '';

  const [query, setQuery] = useState(initialQuery);
  const [results, setResults] = useState<any[]>([]);
  const [totalResults, setTotalResults] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const [searched, setSearched] = useState(false);

  const performSearch = async (searchQuery: string, page: number = 1) => {
    if (!searchQuery.trim()) {
      setResults([]);
      setTotalResults(0);
      setTotalPages(0);
      setSearched(false);
      return;
    }

    setLoading(true);
    setSearched(true);

    try {
      const params = new URLSearchParams({
        q: searchQuery,
        page: page.toString(),
      });

      const response = await fetch(`/api/search?${params.toString()}`);
      const data = await response.json();

      setResults(data.posts);
      setTotalResults(data.totalResults);
      setTotalPages(data.totalPages);
      setCurrentPage(data.currentPage);
    } catch (error) {
      console.error('Search error:', error);
    } finally {
      setLoading(false);
    }
  };

  // Perform initial search if query in URL
  useEffect(() => {
    if (initialQuery) {
      performSearch(initialQuery);
    }
  }, [initialQuery]);

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setCurrentPage(1);
    performSearch(query, 1);
  };

  return (
    <div className="container py-12">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-4xl font-bold font-mono">~/search</h1>
        <p className="mt-2 text-muted-foreground">
          Search through all blog posts
        </p>
      </div>

      {/* Search Bar */}
      <form onSubmit={handleSubmit} className="mb-8">
        <SearchBar value={query} onChange={setQuery} />
      </form>

      {/* Results */}
      {loading && <div className="text-center py-12">Searching...</div>}

      {!loading && searched && results.length === 0 && (
        <div className="text-center py-12">
          <p className="text-muted-foreground">
            No results found for "<strong>{query}</strong>"
          </p>
        </div>
      )}

      {!loading && searched && results.length > 0 && (
        <div className="space-y-8">
          <div className="text-sm text-muted-foreground font-mono">
            Found {totalResults} result{totalResults !== 1 ? 's' : ''} for "{query}"
          </div>

          <ArticleList posts={results} />

          {totalPages > 1 && (
            <Pagination
              currentPage={currentPage}
              totalPages={totalPages}
              onPageChange={(page) => performSearch(query, page)}
            />
          )}
        </div>
      )}

      {!searched && !loading && (
        <div className="text-center py-12 text-muted-foreground">
          Enter a search term to find posts
        </div>
      )}
    </div>
  );
}
```

## Updated Search Bar Component

Update `components/blog/search-bar.tsx` to handle value changes:

```typescript
'use client';

import { Search } from 'lucide-react';
import { Input } from '@/components/ui/input';

interface SearchBarProps {
  value?: string;
  onChange?: (value: string) => void;
  onSubmit?: (query: string) => void;
}

export function SearchBar({ value = '', onChange, onSubmit }: SearchBarProps) {
  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      onSubmit?.(value);
    }
  };

  return (
    <div className="relative">
      <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
      <Input
        type="search"
        placeholder="Search posts..."
        value={value}
        onChange={(e) => onChange?.(e.target.value)}
        onKeyDown={handleKeyDown}
        className="pl-10 bg-card border-border"
      />
    </div>
  );
}
```

## Updated Pagination Component

Update to support client-side pagination:

```typescript
interface PaginationProps {
  currentPage: number;
  totalPages: number;
  category?: string;
  tag?: string;
  onPageChange?: (page: number) => void;
}

export function Pagination({ currentPage, totalPages, category, tag, onPageChange }: PaginationProps) {
  const buildUrl = (page: number) => {
    const params = new URLSearchParams();
    if (category) params.set('category', category);
    if (tag) params.set('tag', tag);
    if (page > 1) params.set('page', page.toString());
    return `/blog?${params.toString()}`;
  };

  // For client-side pagination (search page)
  if (onPageChange) {
    return (
      <div className="flex items-center justify-center gap-2">
        <Button
          variant="outline"
          disabled={currentPage === 1}
          onClick={() => onPageChange(currentPage - 1)}
          className="font-mono"
        >
          Previous
        </Button>

        {/* Page numbers */}
        <div className="flex items-center gap-2">
          {Array.from({ length: totalPages }, (_, i) => i + 1)
            .filter((page) => page === 1 || page === totalPages || (page >= currentPage - 1 && page <= currentPage + 1))
            .map((page, index, array) => {
              const prevPage = array[index - 1];
              const showEllipsis = prevPage && page - prevPage > 1;

              return (
                <div key={page}>
                  {showEllipsis && <span className="px-2 text-muted-foreground">...</span>}
                  <Button
                    variant={page === currentPage ? 'default' : 'outline'}
                    onClick={() => onPageChange(page)}
                    className="font-mono"
                  >
                    {page}
                  </Button>
                </div>
              );
            })}
        </div>

        <Button
          variant="outline"
          disabled={currentPage === totalPages}
          onClick={() => onPageChange(currentPage + 1)}
          className="font-mono"
        >
          Next
        </Button>
      </div>
    );
  }

  // Server-side pagination (blog listing)
  return (
    // Original implementation with Link components
    <div>...</div>
  );
}
```

## Search in Header

Add search shortcut in header:

```typescript
// In components/layout/header.tsx
import Link from 'next/link';
import { Search } from 'lucide-react';

export function Header() {
  return (
    <header className="...">
      {/* ... */}
      <Link href="/search" className="hidden md:block">
        <Search className="h-5 w-5 hover:text-primary transition-colors" />
      </Link>
    </header>
  );
}
```

## Next Steps

- [ ] Implement about page
- [ ] Add keyboard shortcut for search (Cmd+K)
- [ ] Add search highlighting
