# Sitemap & RSS Feed

## Overview

Implement dynamic sitemap and RSS feed generation for better SEO and content syndication.

## Sitemap Generation

Create `app/sitemap.ts`:

```typescript
import { MetadataRoute } from 'next';
import { getPayloadClient } from '@/lib/payload-client';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const payload = await getPayloadClient();
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://yourdomain.com';

  // Fetch all published posts
  const posts = await payload.find({
    collection: 'posts',
    where: {
      status: {
        equals: 'published',
      },
    },
    sort: '-publishedAt',
    limit: 1000,
    depth: 0,
  });

  // Fetch categories
  const categories = await payload.find({
    collection: 'categories',
    limit: 1000,
    depth: 0,
  });

  // Fetch tags
  const tags = await payload.find({
    collection: 'tags',
    limit: 1000,
    depth: 0,
  });

  // Static pages
  const staticPages: MetadataRoute.Sitemap = [
    {
      url: baseUrl,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 1,
    },
    {
      url: `${baseUrl}/blog`,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 0.9,
    },
    {
      url: `${baseUrl}/about`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.8,
    },
    {
      url: `${baseUrl}/search`,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 0.7,
    },
  ];

  // Post pages
  const postPages: MetadataRoute.Sitemap = posts.docs.map((post) => ({
    url: `${baseUrl}/blog/${post.slug}`,
    lastModified: new Date(post.updatedAt || post.publishedAt),
    changeFrequency: 'weekly' as const,
    priority: 0.7,
  }));

  // Category pages
  const categoryPages: MetadataRoute.Sitemap = categories.docs.map((category) => ({
    url: `${baseUrl}/category/${category.slug}`,
    lastModified: new Date(),
    changeFrequency: 'weekly' as const,
    priority: 0.6,
  }));

  // Tag pages
  const tagPages: MetadataRoute.Sitemap = tags.docs.map((tag) => ({
    url: `${baseUrl}/tag/${tag.slug}`,
    lastModified: new Date(),
    changeFrequency: 'weekly' as const,
    priority: 0.5,
  }));

  return [...staticPages, ...postPages, ...categoryPages, ...tagPages];
}
```

## RSS Feed

Create `app/rss/route.ts`:

```typescript
import { NextResponse } from 'next/server';
import { getPayloadClient } from '@/lib/payload-client';

export const dynamic = 'force-dynamic';
export const revalidate = 3600; // Revalidate every hour

export async function GET() {
  const payload = await getPayloadClient();
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://yourdomain.com';

  // Fetch latest posts
  const posts = await payload.find({
    collection: 'posts',
    where: {
      status: {
        equals: 'published',
      },
    },
    sort: '-publishedAt',
    limit: 50,
    depth: 1,
  });

  const feedItems = posts.docs.map((post) => ({
    title: post.title,
    description: post.excerpt || '',
    link: `${baseUrl}/blog/${post.slug}`,
    guid: `${baseUrl}/blog/${post.slug}`,
    pubDate: new Date(post.publishedAt).toUTCString(),
    category: post.category?.name || 'Uncategorized',
    author: post.author?.name || 'Your Name',
  }));

  const rssXml = generateRSS({
    title: 'Blog RSS Feed',
    description: 'Latest posts from the blog',
    link: baseUrl,
    language: 'en-us',
    lastBuildDate: new Date().toUTCString(),
    items: feedItems,
  });

  return new NextResponse(rssXml, {
    headers: {
      'Content-Type': 'application/xml; charset=utf-8',
      'Cache-Control': 'public, max-age=3600, s-maxage=3600',
    },
  });
}

interface RSSFeed {
  title: string;
  description: string;
  link: string;
  language: string;
  lastBuildDate: string;
  items: Array<{
    title: string;
    description: string;
    link: string;
    guid: string;
    pubDate: string;
    category?: string;
    author?: string;
  }>;
}

function generateRSS(feed: RSSFeed): string {
  const items = feed.items
    .map(
      (item) => `
    <item>
      <title><![CDATA[${item.title}]]></title>
      <description><![CDATA[${item.description}]]></description>
      <link>${item.link}</link>
      <guid isPermaLink="true">${item.guid}</guid>
      <pubDate>${item.pubDate}</pubDate>
      ${item.category ? `<category><![CDATA[${item.category}]]></category>` : ''}
      ${item.author ? `<author>${item.author}</author>` : ''}
    </item>`
    )
    .join('');

  return `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
  <channel>
    <title><![CDATA[${feed.title}]]></title>
    <description><![CDATA[${feed.description}]]></description>
    <link>${feed.link}</link>
    <atom:link href="${feed.link}/rss" rel="self" type="application/rss+xml" />
    <language>${feed.language}</language>
    <lastBuildDate>${feed.lastBuildDate}</lastBuildDate>
    ${items}
  </channel>
</rss>`;
}
```

## JSON Feed (Optional)

Create `app/feed/json/route.ts`:

```typescript
import { NextResponse } from 'next/server';
import { getPayloadClient } from '@/lib/payload-client';

export const dynamic = 'force-dynamic';

export async function GET() {
  const payload = await getPayloadClient();
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://yourdomain.com';

  const posts = await payload.find({
    collection: 'posts',
    where: { status: { equals: 'published' } },
    sort: '-publishedAt',
    limit: 50,
    depth: 1,
  });

  const jsonFeed = {
    version: 'https://jsonfeed.org/version/1.1',
    title: 'Blog',
    description: 'Latest posts from the blog',
    home_page_url: baseUrl,
    feed_url: `${baseUrl}/feed/json`,
    icon: `${baseUrl}/icon.png`,
    authors: [
      {
        name: 'Your Name',
        url: `${baseUrl}/about`,
      },
    ],
    items: posts.docs.map((post) => ({
      id: `${baseUrl}/blog/${post.slug}`,
      url: `${baseUrl}/blog/${post.slug}`,
      title: post.title,
      content_html: post.excerpt || '',
      summary: post.excerpt || '',
      date_published: new Date(post.publishedAt).toISOString(),
      date_modified: new Date(post.updatedAt).toISOString(),
      authors: [
        {
          name: post.author?.name || 'Your Name',
        },
      ],
      tags: [
        post.category?.name,
        ...(post.tags?.map((tag: any) => tag.name) || []),
      ].filter(Boolean),
    })),
  };

  return NextResponse.json(jsonFeed, {
    headers: {
      'Cache-Control': 'public, max-age=3600, s-maxage=3600',
    },
  });
}
```

## Category-Specific RSS Feeds

Create `app/category/[slug]/rss/route.ts`:

```typescript
import { NextResponse } from 'next/server';
import { notFound } from 'next/navigation';
import { getPayloadClient } from '@/lib/payload-client';

export async function GET(
  request: Request,
  { params }: { params: { slug: string } }
) {
  const payload = await getPayloadClient();
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://yourdomain.com';

  // Fetch category
  const category = await payload.find({
    collection: 'categories',
    where: { slug: { equals: params.slug } },
    limit: 1,
  });

  if (!category.docs[0]) {
    notFound();
  }

  const categoryData = category.docs[0];

  // Fetch posts in this category
  const posts = await payload.find({
    collection: 'posts',
    where: {
      and: [
        { status: { equals: 'published' } },
        { category: { equals: categoryData.id } },
      ],
    },
    sort: '-publishedAt',
    limit: 50,
    depth: 1,
  });

  const feedItems = posts.docs.map((post) => ({
    title: post.title,
    description: post.excerpt || '',
    link: `${baseUrl}/blog/${post.slug}`,
    guid: `${baseUrl}/blog/${post.slug}`,
    pubDate: new Date(post.publishedAt).toUTCString(),
  }));

  const rssXml = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0">
  <channel>
    <title><![CDATA[${categoryData.name} - Blog]]></title>
    <description><![CDATA[${categoryData.description || `Posts in ${categoryData.name}`}]]></description>
    <link>${baseUrl}/category/${params.slug}</link>
    ${feedItems.map(item => `
    <item>
      <title><![CDATA[${item.title}]]></title>
      <description><![CDATA[${item.description}]]></description>
      <link>${item.link}</link>
      <guid>${item.guid}</guid>
      <pubDate>${item.pubDate}</pubDate>
    </item>`).join('')}
  </channel>
</rss>`;

  return new NextResponse(rssXml, {
    headers: { 'Content-Type': 'application/xml; charset=utf-8' },
  });
}
```

## Add RSS Link to Header

Update `app/layout.tsx`:

```typescript
export const metadata: Metadata = {
  // ... other metadata
  alternates: {
    types: {
      'application/rss+xml': [
        {
          title: 'RSS Feed',
          url: '/rss',
        },
      ],
    },
  },
};
```

Or add to header component:

```typescript
// In components/layout/header.tsx
<Link rel="alternate" type="application/rss+xml" href="/rss" />
```

## Next Steps

- [ ] Implement image handling
- [ ] Implement performance optimization
- [ ] Add Open Graph image generation
