# Single Blog Post Page

## Overview

Create individual blog post pages with dynamic routing at `/blog/[slug]`.

## Page Implementation

Create `app/blog/[slug]/page.tsx`:

```typescript
import { notFound } from 'next/navigation';
import { Metadata } from 'next';
import { getPayloadClient } from '@/lib/payload-client';
import { ArticleHeader } from '@/components/blog/article-header';
import { ArticleContent } from '@/components/blog/article-content';
import { RelatedPosts } from '@/components/blog/related-posts';
import Image from 'next/image';

interface PostPageProps {
  params: {
    slug: string;
  };
}

export async function generateMetadata({ params }: PostPageProps): Promise<Metadata> {
  const payload = await getPayloadClient();

  const post = await payload.find({
    collection: 'posts',
    where: {
      slug: {
        equals: params.slug,
      },
    },
    depth: 2,
  });

  if (!post.docs[0]) {
    return {
      title: 'Post Not Found',
    };
  }

  const postData = post.docs[0];

  return {
    title: postData.title,
    description: postData.excerpt,
    openGraph: {
      title: postData.title,
      description: postData.excerpt,
      type: 'article',
      publishedTime: postData.publishedAt,
      authors: [postData.author?.name || 'Author'],
      images: postData.coverImage?.url ? [postData.coverImage.url] : [],
    },
    twitter: {
      card: 'summary_large_image',
      title: postData.title,
      description: postData.excerpt,
      images: postData.coverImage?.url ? [postData.coverImage.url] : [],
    },
  };
}

export default async function PostPage({ params }: PostPageProps) {
  const payload = await getPayloadClient();

  const post = await payload.find({
    collection: 'posts',
    where: {
      slug: {
        equals: params.slug,
      },
      status: {
        equals: 'published',
      },
    },
    depth: 3,
  });

  if (!post.docs[0]) {
    notFound();
  }

  const postData = post.docs[0];

  // Fetch related posts
  const relatedPosts = await payload.find({
    collection: 'posts',
    where: {
      and: [
        {
          id: {
            not_equals: postData.id,
          },
        },
        {
          status: {
            equals: 'published',
          },
        },
        postData.category
          ? {
              category: {
                equals: postData.category.id,
              },
            }
          : {},
      ],
    },
    sort: '-publishedAt',
    limit: 3,
    depth: 2,
  });

  // JSON-LD Schema
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'BlogPosting',
    headline: postData.title,
    description: postData.excerpt,
    image: postData.coverImage?.url,
    datePublished: postData.publishedAt,
    dateModified: postData.updatedAt,
    author: {
      '@type': 'Person',
      name: postData.author?.name || 'Author',
    },
    publisher: {
      '@type': 'Organization',
      name: 'Blog',
      logo: {
        '@type': 'ImageObject',
        url: '/og.png',
      },
    },
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <article className="container py-12">
        <div className="mx-auto max-w-4xl">
          {/* Back link */}
          <a
            href="/blog"
            className="inline-flex items-center text-sm text-muted-foreground hover:text-primary transition-colors mb-8 font-mono"
          >
            ../blog
          </a>

          {/* Header */}
          <ArticleHeader
            title={postData.title}
            category={postData.category}
            tags={postData.tags}
            publishedAt={postData.publishedAt}
            author={postData.author}
          />

          {/* Cover Image */}
          {postData.coverImage && (
            <div className="relative aspect-video w-full rounded-lg overflow-hidden border border-border mb-8">
              <Image
                src={postData.coverImage.url}
                alt={postData.coverImage.alt || postData.title}
                fill
                className="object-cover"
                priority
                sizes="(max-width: 768px) 100vw, 896px"
              />
            </div>
          )}

          {/* Content */}
          <div className="prose prose-invert max-w-none">
            <ArticleContent content={postData.content} />
          </div>

          {/* Related Posts */}
          <RelatedPosts posts={relatedPosts.docs} />
        </div>
      </article>
    </>
  );
}
```

## Generate Static Params (Optional)

For static generation at build time:

```typescript
export async function generateStaticParams() {
  const payload = await getPayloadClient();

  const posts = await payload.find({
    collection: 'posts',
    where: {
      status: {
        equals: 'published',
      },
    },
    limit: 1000,
    depth: 0,
  });

  return posts.docs.map((post) => ({
    slug: post.slug,
  }));
}
```

## Article Content Renderer

Create a custom rich text renderer for Payload content:

```typescript
import { RichText } from '@payloadcms/richtext-slate';
import { Fragment } from 'react';

interface ArticleContentProps {
  content: any;
}

export function ArticleContent({ content }: ArticleContentProps) {
  if (!content) return null;

  return (
    <RichText
      content={content}
      components={{
        Heading1: ({ children }) => (
          <h1 className="text-4xl font-bold font-mono mt-12 mb-4">{children}</h1>
        ),
        Heading2: ({ children }) => (
          <h2 className="text-3xl font-bold font-mono mt-10 mb-4">{children}</h2>
        ),
        Heading3: ({ children }) => (
          <h3 className="text-2xl font-bold font-mono mt-8 mb-4">{children}</h3>
        ),
        Paragraph: ({ children }) => (
          <p className="my-4 leading-7">{children}</p>
        ),
        Link: ({ children, url }) => (
          <a
            href={url}
            className="text-primary hover:underline"
            target={url.startsWith('http') ? '_blank' : undefined}
            rel={url.startsWith('http') ? 'noopener noreferrer' : undefined}
          >
            {children}
          </a>
        ),
        UnorderedList: ({ children }) => (
          <ul className="my-4 list-disc list-inside space-y-2">{children}</ul>
        ),
        OrderedList: ({ children }) => (
          <ol className="my-4 list-decimal list-inside space-y-2">{children}</ol>
        ),
        Code: ({ children }) => (
          <code className="bg-muted px-1.5 py-0.5 rounded text-sm font-mono">
            {children}
          </code>
        ),
        CodeBlock: ({ children }) => (
          <pre className="bg-muted p-4 rounded-lg overflow-x-auto my-4">
            <code className="text-sm font-mono">{children}</code>
          </pre>
        ),
        BlockQuote: ({ children }) => (
          <blockquote className="border-l-4 border-primary pl-4 italic my-4">
            {children}
          </blockquote>
        ),
      }}
    />
  );
}
```

## Table of Contents (Optional)

Create a table of contents component for blog posts:

```typescript
'use client';

import { useEffect, useState } from 'react';
import { ScrollArea } from '@/components/ui/scroll-area';
import { cn } from '@/lib/utils';

interface TocItem {
  id: string;
  text: string;
  level: number;
}

export function TableOfContents() {
  const [headings, setHeadings] = useState<TocItem[]>([]);

  useEffect(() => {
    const elements = Array.from(
      document.querySelectorAll('article h2, article h3')
    );

    const items: TocItem[] = elements.map((el) => ({
      id: el.id,
      text: el.textContent || '',
      level: parseInt(el.tagName.substring(1)),
    }));

    setHeadings(items);
  }, []);

  const scrollToHeading = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  if (headings.length === 0) return null;

  return (
    <nav className="hidden xl:block fixed right-8 top-24 w-64">
      <div className="font-mono text-sm font-semibold mb-4">On this page</div>
      <ScrollArea className="h-[calc(100vh-8rem)]">
        <ul className="space-y-2">
          {headings.map((heading) => (
            <li
              key={heading.id}
              className={cn(
                'text-sm text-muted-foreground hover:text-primary cursor-pointer transition-colors',
                heading.level === 3 && 'pl-4'
              )}
              onClick={() => scrollToHeading(heading.id)}
            >
              {heading.text}
            </li>
          ))}
        </ul>
      </ScrollArea>
    </nav>
  );
}
```

## Next Steps

- [ ] Implement about page
- [ ] Implement search page
- [ ] Add reading time estimation
