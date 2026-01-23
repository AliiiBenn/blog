# Homepage

## Overview

Create the homepage with a terminal-style hero section and featured/latest posts.

## Homepage Component

Create `app/page.tsx`:

```typescript
import { HeroSection } from '@/components/home/hero-section';
import { FeaturedPosts } from '@/components/home/featured-posts';
import { getPayloadClient } from '@/lib/payload-client';

export default async function HomePage() {
  const payload = await getPayloadClient();

  // Fetch latest published posts
  const posts = await payload.find({
    collection: 'posts',
    where: {
      status: {
        equals: 'published',
      },
    },
    sort: '-publishedAt',
    limit: 6,
    depth: 2,
  });

  return (
    <>
      <HeroSection />
      <FeaturedPosts posts={posts.docs} />
    </>
  );
}
```

## Hero Section Component

Create `components/home/hero-section.tsx`:

```typescript
'use client';

import { useEffect, useRef } from 'react';
import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';

export function HeroSection() {
  const textRef = useRef<HTMLHeadingElement>(null);

  useEffect(() => {
    // Terminal typing effect
    const text = textRef.current;
    if (!text) return;

    const originalText = text.textContent || '';
    text.textContent = '';
    let index = 0;

    const interval = setInterval(() => {
      if (index < originalText.length) {
        text.textContent += originalText[index];
        index++;
      } else {
        clearInterval(interval);
      }
    }, 100);

    return () => clearInterval(interval);
  }, []);

  return (
    <section className="relative overflow-hidden border-b border-border">
      {/* Background grid */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px]" />

      <div className="container relative px-4 py-24 md:py-32">
        <div className="mx-auto max-w-4xl">
          {/* Terminal prompt */}
          <div className="mb-4 font-mono text-muted-foreground">
            <span className="text-primary">$</span> whoami
          </div>

          {/* Main heading with typing effect */}
          <h1
            ref={textRef}
            className="text-4xl font-bold font-mono md:text-6xl lg:text-7xl"
          >
            Developer, writer, creator
          </h1>

          {/* Description */}
          <p className="mt-6 text-lg text-muted-foreground md:text-xl">
            Welcome to my personal blog where I share thoughts on
            software development, architecture, and technology.
          </p>

          {/* CTA Buttons */}
          <div className="mt-8 flex flex-wrap gap-4">
            <Button asChild size="lg" className="font-mono">
              <Link href="/blog">
                View Blog
                <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
            <Button asChild variant="outline" size="lg" className="font-mono">
              <Link href="/about">About Me</Link>
            </Button>
          </div>

          {/* Terminal stats */}
          <div className="mt-12 flex flex-wrap gap-8 font-mono text-sm text-muted-foreground">
            <div>
              <span className="text-primary">~/posts</span> {latestPostsCount} published
            </div>
            <div>
              <span className="text-primary">~/categories</span> {categoriesCount} topics
            </div>
            <div>
              <span className="text-primary">~/tags</span> {tagsCount} tags
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
```

Simplified hero (server component version):

```typescript
import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';

export function HeroSection() {
  return (
    <section className="relative overflow-hidden border-b border-border">
      {/* Background grid */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px]" />

      <div className="container relative px-4 py-24 md:py-32">
        <div className="mx-auto max-w-4xl">
          {/* Terminal prompt */}
          <div className="mb-4 font-mono text-muted-foreground">
            <span className="text-primary">$</span> whoami
          </div>

          {/* Main heading */}
          <h1 className="text-4xl font-bold font-mono md:text-6xl lg:text-7xl">
            Developer, writer, creator
          </h1>

          {/* Description */}
          <p className="mt-6 text-lg text-muted-foreground md:text-xl">
            Welcome to my personal blog where I share thoughts on
            software development, architecture, and technology.
          </p>

          {/* CTA Buttons */}
          <div className="mt-8 flex flex-wrap gap-4">
            <Button asChild size="lg" className="font-mono">
              <Link href="/blog">
                View Blog
                <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
            <Button asChild variant="outline" size="lg" className="font-mono">
              <Link href="/about">About Me</Link>
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
}
```

## Featured Posts Component

Create `components/home/featured-posts.tsx`:

```typescript
import Link from 'next/link';
import { ArticleCard } from '@/components/blog/article-card';
import { ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface FeaturedPostsProps {
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

export function FeaturedPosts({ posts }: FeaturedPostsProps) {
  return (
    <section className="py-16 md:py-24">
      <div className="container">
        {/* Section header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h2 className="text-3xl font-bold font-mono">Latest Posts</h2>
            <p className="mt-2 text-muted-foreground">
              Thoughts, tutorials, and insights
            </p>
          </div>
          <Button asChild variant="outline" className="hidden md:flex font-mono">
            <Link href="/blog">
              View All
              <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
          </Button>
        </div>

        {/* Posts grid */}
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {posts.map((post) => (
            <ArticleCard key={post.id} post={post} />
          ))}
        </div>

        {/* Mobile CTA */}
        <div className="mt-8 md:hidden">
          <Button asChild variant="outline" className="w-full font-mono">
            <Link href="/blog">
              View All Posts
              <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
          </Button>
        </div>
      </div>
    </section>
  );
}
```

## Metadata

Add metadata to `app/page.tsx`:

```typescript
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Home | Blog',
  description: 'A personal blog about software development, architecture, and technology.',
  openGraph: {
    title: 'Home | Blog',
    description: 'A personal blog about software development, architecture, and technology.',
    type: 'website',
  },
};
```

## Next Steps

- [ ] Implement blog listing page
- [ ] Implement single post page
- [ ] Implement about page
- [ ] Implement search page
