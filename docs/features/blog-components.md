# Blog Components

## Overview

Create reusable components for displaying blog content: ArticleCard, ArticleHeader, ArticleContent, CategoryBadge, TagBadge, and SearchBar.

## Article Card Component

Create `components/blog/article-card.tsx`:

```typescript
import Link from 'next/link';
import Image from 'next/image';
import { Calendar, Clock } from 'lucide-react';
import { CategoryBadge } from './category-badge';
import { TagBadge } from './tag-badge';

interface ArticleCardProps {
  post: {
    id: string;
    title: string;
    slug: string;
    excerpt: string;
    coverImage?: {
      url: string;
      alt?: string;
    };
    category: {
      name: string;
      slug: string;
      icon?: string;
    };
    tags: Array<{
      name: string;
      slug: string;
      color?: string;
    }>;
    publishedAt: string;
  };
}

export function ArticleCard({ post }: ArticleCardProps) {
  return (
    <article className="group relative overflow-hidden rounded-lg border border-border bg-card transition-all hover:border-primary/50 hover:shadow-lg hover:shadow-primary/10">
      <Link href={`/blog/${post.slug}`} className="block">
        {/* Cover Image */}
        {post.coverImage && (
          <div className="relative aspect-video w-full overflow-hidden">
            <Image
              src={post.coverImage.url}
              alt={post.coverImage.alt || post.title}
              fill
              className="object-cover transition-transform group-hover:scale-105"
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            />
          </div>
        )}

        {/* Content */}
        <div className="p-6">
          {/* Category */}
          <CategoryBadge category={post.category} />

          {/* Title */}
          <h2 className="mt-3 text-xl font-bold font-mono group-hover:text-primary transition-colors">
            {post.title}
          </h2>

          {/* Excerpt */}
          <p className="mt-2 text-muted-foreground line-clamp-2">
            {post.excerpt}
          </p>

          {/* Tags */}
          {post.tags.length > 0 && (
            <div className="mt-4 flex flex-wrap gap-2">
              {post.tags.slice(0, 3).map((tag) => (
                <TagBadge key={tag.id} tag={tag} />
              ))}
            </div>
          )}

          {/* Meta */}
          <div className="mt-4 flex items-center text-sm text-muted-foreground">
            <Calendar className="mr-1 h-4 w-4" />
            <time dateTime={post.publishedAt}>
              {new Date(post.publishedAt).toLocaleDateString('en-US', {
                year: 'numeric',
                month: 'long',
                day: 'numeric',
              })}
            </time>
          </div>
        </div>
      </Link>
    </article>
  );
}
```

## Article Header Component

Create `components/blog/article-header.tsx`:

```typescript
import { Calendar, User } from 'lucide-react';
import { CategoryBadge } from './category-badge';
import { TagBadge } from './tag-badge';

interface ArticleHeaderProps {
  title: string;
  category: {
    name: string;
    slug: string;
    icon?: string;
  };
  tags: Array<{
    name: string;
    slug: string;
    color?: string;
  }>;
  publishedAt: string;
  author?: {
    name: string;
  };
}

export function ArticleHeader({
  title,
  category,
  tags,
  publishedAt,
  author,
}: ArticleHeaderProps) {
  return (
    <header className="mb-8">
      {/* Category */}
      <CategoryBadge category={category} />

      {/* Title */}
      <h1 className="mt-4 text-4xl font-bold font-mono md:text-5xl">
        {title}
      </h1>

      {/* Meta */}
      <div className="mt-6 flex flex-wrap items-center gap-4 text-muted-foreground">
        <div className="flex items-center">
          <Calendar className="mr-2 h-4 w-4" />
          <time dateTime={publishedAt}>
            {new Date(publishedAt).toLocaleDateString('en-US', {
              year: 'numeric',
              month: 'long',
              day: 'numeric',
            })}
          </time>
        </div>

        {author && (
          <div className="flex items-center">
            <User className="mr-2 h-4 w-4" />
            <span>{author.name}</span>
          </div>
        )}
      </div>

      {/* Tags */}
      {tags.length > 0 && (
        <div className="mt-6 flex flex-wrap gap-2">
          {tags.map((tag) => (
            <TagBadge key={tag.id} tag={tag} />
          ))}
        </div>
      )}
    </header>
  );
}
```

## Article Content Component

Create `components/blog/article-content.tsx`:

```typescript
import { RichText } from '@payloadcms/richtext-slate';

interface ArticleContentProps {
  content: any; // Payload rich text content
}

export function ArticleContent({ content }: ArticleContentProps) {
  return (
    <div className="prose prose-invert max-w-none">
      <RichText content={content} />
    </div>
  );
}
```

## Category Badge Component

Create `components/blog/category-badge.tsx`:

```typescript
import Link from 'next/link';

interface CategoryBadgeProps {
  category: {
    name: string;
    slug: string;
    icon?: string;
  };
}

export function CategoryBadge({ category }: CategoryBadgeProps) {
  return (
    <Link
      href={`/blog?category=${category.slug}`}
      className="inline-flex items-center gap-1 rounded-full border border-border bg-card px-3 py-1 text-sm font-medium transition-colors hover:border-primary hover:text-primary"
    >
      {category.icon && <span>{category.icon}</span>}
      <span>{category.name}</span>
    </Link>
  );
}
```

## Tag Badge Component

Create `components/blog/tag-badge.tsx`:

```typescript
import Link from 'next/link';

interface TagBadgeProps {
  tag: {
    name: string;
    slug: string;
    color?: string;
  };
}

export function TagBadge({ tag }: TagBadgeProps) {
  const style = tag.color ? { borderColor: tag.color } : {};

  return (
    <Link
      href={`/blog?tag=${tag.slug}`}
      className="inline-flex items-center rounded-md border border-border px-2.5 py-0.5 text-xs font-medium transition-colors hover:border-primary hover:text-primary"
      style={style}
    >
      #{tag.name}
    </Link>
  );
}
```

## Search Bar Component

Create `components/blog/search-bar.tsx`:

```typescript
'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Search } from 'lucide-react';
import { Input } from '@/components/ui/input';

export function SearchBar() {
  const [query, setQuery] = useState('');
  const router = useRouter();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (query.trim()) {
      router.push(`/search?q=${encodeURIComponent(query)}`);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="relative">
      <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
      <Input
        type="search"
        placeholder="Search posts..."
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        className="pl-10 bg-card border-border"
      />
    </form>
  );
}
```

## Article List Component

Create `components/blog/article-list.tsx`:

```typescript
import { ArticleCard } from './article-card';

interface ArticleListProps {
  posts: Array<{
    id: string;
    title: string;
    slug: string;
    excerpt: string;
    coverImage?: {
      url: string;
      alt?: string;
    };
    category: {
      name: string;
      slug: string;
      icon?: string;
    };
    tags: Array<{
      name: string;
      slug: string;
      color?: string;
    }>;
    publishedAt: string;
  }>;
}

export function ArticleList({ posts }: ArticleListProps) {
  if (posts.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-muted-foreground">No posts found.</p>
      </div>
    );
  }

  return (
    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
      {posts.map((post) => (
        <ArticleCard key={post.id} post={post} />
      ))}
    </div>
  );
}
```

## Related Posts Component

Create `components/blog/related-posts.tsx`:

```typescript
import Link from 'next/link';
import Image from 'next/image';
import { ArticleCard } from './article-card';

interface RelatedPostsProps {
  posts: Array<{
    id: string;
    title: string;
    slug: string;
    excerpt: string;
    coverImage?: {
      url: string;
      alt?: string;
    };
    category: {
      name: string;
      slug: string;
      icon?: string;
    };
    publishedAt: string;
  }>;
}

export function RelatedPosts({ posts }: RelatedPostsProps) {
  if (posts.length === 0) return null;

  return (
    <section className="mt-12 border-t border-border pt-8">
      <h2 className="text-2xl font-bold font-mono mb-6">Related Posts</h2>
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {posts.map((post) => (
          <ArticleCard key={post.id} post={post} />
        ))}
      </div>
    </section>
  );
}
```

## Next Steps

- [ ] Create homepage components
- [ ] Implement pages
- [ ] Add pagination component
