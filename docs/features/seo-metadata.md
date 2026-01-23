# SEO & Metadata

## Overview

Implement comprehensive SEO with dynamic meta tags, Open Graph, Twitter Cards, and Schema.org markup.

## Root Layout Metadata

Update `app/layout.tsx`:

```typescript
import { Metadata } from 'next';
import { Inter, JetBrains_Mono } from 'next/font/google';
import './globals.css';

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-geist-sans',
});

const jetbrainsMono = JetBrains_Mono({
  subsets: ['latin'],
  variable: '--font-geist-mono',
});

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || 'https://yourdomain.com'),
  title: {
    default: 'Blog | Your Name',
    template: '%s | Blog',
  },
  description: 'A personal blog about software development, architecture, and technology.',
  keywords: ['blog', 'software development', 'programming', 'web development'],
  authors: [{ name: 'Your Name', url: 'https://yourdomain.com' }],
  creator: 'Your Name',
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: '/',
    siteName: 'Blog',
    title: 'Blog | Your Name',
    description: 'A personal blog about software development, architecture, and technology.',
    images: [
      {
        url: '/og.png',
        width: 1200,
        height: 630,
        alt: 'Blog',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Blog | Your Name',
    description: 'A personal blog about software development, architecture, and technology.',
    images: ['/og.png'],
    creator: '@yourhandle',
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  verification: {
    google: 'your-google-verification-code',
    yandex: 'your-yandex-verification-code',
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning className={`${inter.variable} ${jetbrainsMono.variable}`}>
      <body>{children}</body>
    </html>
  );
}
```

## Dynamic Post Metadata Helper

Create `lib/metadata.ts`:

```typescript
import { Metadata } from 'next';

interface GenerateMetadataProps {
  title: string;
  description: string;
  image?: string;
  publishedTime?: string;
  modifiedTime?: string;
  authors?: string[];
  type?: 'article' | 'website';
}

export function generateMetadata({
  title,
  description,
  image = '/og.png',
  publishedTime,
  modifiedTime,
  authors = ['Your Name'],
  type = 'article',
}: GenerateMetadataProps): Metadata {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://yourdomain.com';
  const imageUrl = image.startsWith('http') ? image : `${baseUrl}${image}`;

  return {
    title,
    description,
    openGraph: {
      type,
      title,
      description,
      publishedTime,
      modifiedTime,
      authors,
      images: [
        {
          url: imageUrl,
          width: 1200,
          height: 630,
          alt: title,
        },
      ],
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: [imageUrl],
    },
  };
}
```

## Usage in Blog Post Page

```typescript
import { generateMetadata as generatePostMetadata } from '@/lib/metadata';

export async function generateMetadata({ params }: PostPageProps): Promise<Metadata> {
  const payload = await getPayloadClient();
  const post = await payload.find({
    collection: 'posts',
    where: { slug: { equals: params.slug } },
    depth: 1,
  });

  if (!post.docs[0]) {
    return {
      title: 'Post Not Found',
    };
  }

  const postData = post.docs[0];

  return generatePostMetadata({
    title: postData.title,
    description: postData.excerpt,
    image: postData.coverImage?.url,
    publishedTime: postData.publishedAt,
    modifiedTime: postData.updatedAt,
    authors: [postData.author?.name || 'Your Name'],
    type: 'article',
  });
}
```

## Schema.org JSON-LD

### Article Schema

```typescript
// In app/blog/[slug]/page.tsx
const articleJsonLd = {
  '@context': 'https://schema.org',
  '@type': 'BlogPosting',
  headline: postData.title,
  description: postData.excerpt,
  image: postData.coverImage?.url,
  datePublished: postData.publishedAt,
  dateModified: postData.updatedAt,
  author: {
    '@type': 'Person',
    name: postData.author?.name || 'Your Name',
    url: 'https://yourdomain.com/about',
  },
  publisher: {
    '@type': 'Organization',
    name: 'Blog',
    url: 'https://yourdomain.com',
    logo: {
      '@type': 'ImageObject',
      url: 'https://yourdomain.com/logo.png',
    },
  },
  mainEntityOfPage: {
    '@type': 'WebPage',
    '@id': `https://yourdomain.com/blog/${postData.slug}`,
  },
};
```

### Breadcrumb Schema

```typescript
const breadcrumbJsonLd = {
  '@context': 'https://schema.org',
  '@type': 'BreadcrumbList',
  itemListElement: [
    {
      '@type': 'ListItem',
      position: 1,
      name: 'Home',
      item: 'https://yourdomain.com',
    },
    {
      '@type': 'ListItem',
      position: 2,
      name: 'Blog',
      item: 'https://yourdomain.com/blog',
    },
    {
      '@type': 'ListItem',
      position: 3,
      name: postData.title,
      item: `https://yourdomain.com/blog/${postData.slug}`,
    },
  ],
};
```

### WebSite Schema

Add to root layout:

```typescript
const websiteJsonLd = {
  '@context': 'https://schema.org',
  '@type': 'WebSite',
  name: 'Blog',
  url: 'https://yourdomain.com',
  description: 'A personal blog about software development',
  potentialAction: {
    '@type': 'SearchAction',
    target: {
      '@type': 'EntryPoint',
      urlTemplate: 'https://yourdomain.com/search?q={search_term_string}',
    },
    'query-input': {
      '@type': 'PropertyValueSpecification',
      valueRequired: true,
      valueName: 'search_term_string',
    },
  },
};
```

### Person Schema (Author)

```typescript
const personJsonLd = {
  '@context': 'https://schema.org',
  '@type': 'Person',
  name: 'Your Name',
  url: 'https://yourdomain.com',
  jobTitle: 'Software Developer',
  sameAs: [
    'https://github.com/yourusername',
    'https://twitter.com/yourusername',
    'https://linkedin.com/in/yourusername',
  ],
};
```

## Adding JSON-LD to Pages

```typescript
export default function PostPage({ params }: PostPageProps) {
  // ... fetch post data

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(articleJsonLd) }}
      />

      <article>
        {/* Post content */}
      </article>
    </>
  );
}
```

## Robots.txt

Create `app/robots.ts`:

```typescript
import { MetadataRoute } from 'next';

export default function robots(): MetadataRoute.Robots {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://yourdomain.com';

  return {
    rules: [
      {
        userAgent: '*',
        allow: '/',
        disallow: ['/admin', '/api'],
      },
    ],
    sitemap: `${baseUrl}/sitemap.xml`,
  };
}
```

## Canonical URLs

Add canonical URL to page metadata:

```typescript
export async function generateMetadata({ params }: PostPageProps): Promise<Metadata> {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://yourdomain.com';
  const post = await fetchPost(params.slug);

  return {
    ...otherMetadata,
    alternates: {
      canonical: `${baseUrl}/blog/${post.slug}`,
    },
  };
}
```

## Meta Tags Verification

Add verification tags for search engines:

```typescript
// In root layout metadata
verification: {
  google: 'your-google-search-console-verification-code',
  yandex: 'your-yandex-verification-code',
  bing: 'your-bing-webmaster-tools-verification-code',
},
```

## Favicon

Add favicon files to `app/` directory:
- `favicon.ico`
- `icon.png` (512x512)
- `apple-icon.png` (180x180)

Next.js will automatically use these.

## Next Steps

- [ ] Implement sitemap generation
- [ ] Implement RSS feed
- [ ] Add Open Graph image generator
