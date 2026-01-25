# Getting Started with Next.js 15 and Payload CMS 3.0

In this comprehensive guide, we'll explore how to build a modern blog using Next.js 15 and Payload CMS 3.0. This powerful combination gives you the best of both worlds: a blazing-fast frontend with a flexible, type-safe headless CMS.

## Why This Stack?

**Next.js 15** brings us:
- Improved performance with Turbopack
- Better React Server Components support
- Enhanced TypeScript integration
- Built-in optimizations for SEO

**Payload CMS 3.0** offers:
- Database-agnostic architecture
- Type-safe frontend auto-generation
- Powerful blocks and globals system
- Excellent developer experience

## Prerequisites

Before we begin, make sure you have:

- Node.js 20+ installed
- PostgreSQL 14+ or MongoDB running
- Basic knowledge of TypeScript and React
- Familiarity with Next.js App Router

## Project Setup

Let's start by creating a new Next.js project:

```bash
npx create-next-app@latest my-blog --typescript --tailwind --eslint
cd my-blog
```

Install Payload CMS and required dependencies:

```bash
pnpm add payload @payloadcms/bundler-webpack @payloadcms/bundler-vite @payloadcms/db-postgres @payloadcms/db-mongodb
pnpm add @payloadcms/richtext-lexical
```

## Database Configuration

First, set up your environment variables:

```env
# .env
DATABASE_URI=postgresql://user:password@localhost:5432/my_blog
PAYLOAD_SECRET=your-secret-key-here
```

For PostgreSQL, install the pg package:

```bash
pnpm add pg
```

## Payload CMS Configuration

Create the Payload configuration file at `payload/payload.config.ts`:

```typescript
import { buildConfig } from 'payload'
import { postgresAdapter } from '@payloadcms/db-postgres'
import { postgresCursor } from '@payloadcms/db-postgres'
import { slate } from '@payloadcms/richtext-slate'

export default buildConfig({
  editor: slate,
  db: postgresAdapter({
    pool: {
      connectionString: process.env.DATABASE_URI,
    },
  }),
  collections: [
    // We'll add collections here
  ],
  globals: [
    // We'll add globals here
  ],
})
```

## Creating Collections

Let's create a Posts collection:

```typescript
// src/collections/Posts.ts
import { CollectionConfig } from 'payload'

export const Posts: CollectionConfig = {
  slug: 'posts',
  admin: {
    useAsTitle: 'title',
  },
  fields: [
    {
      name: 'title',
      type: 'text',
      required: true,
    },
    {
      name: 'content',
      type: 'richText',
      required: true,
    },
    {
      name: 'excerpt',
      type: 'text',
    },
    {
      name: 'publishedDate',
      type: 'date',
      defaultValue: () => new Date(),
    },
    {
      name: 'readingTime',
      type: 'number',
      admin: {
        description: 'Reading time in minutes',
      },
    },
  ],
}
```

## Creating API Routes

Create the API route to fetch posts:

```typescript
// src/app/api/posts/route.ts
import { NextResponse } from 'next/server'
import { payload } from '@/payload'

export async function GET(request: Request) {
  const posts = await payload.find({
    collection: 'posts',
    limit: 10,
  })

  return NextResponse.json(posts)
}
```

## Server Actions for Better Performance

Using server actions is more efficient than API routes:

```typescript
// src/app/actions/posts.ts
'use server'

import { payload } from '@/payload'

export async function getPosts(options: {
  limit?: number
  page?: number
  category?: string
}) {
  const { limit = 10, page = 1, category } = options

  const posts = await payload.find({
    collection: 'posts',
    limit,
    page,
    where: category
      ? {
          'category.name': {
            equals: category,
          },
        }
      : undefined,
    sort: '-publishedDate',
  })

  return posts.docs
}
```

## Building the Blog Page

Create the main blog page:

```typescript
// src/app/blog/page.tsx
import { getPosts } from '@/app/actions/posts'
import { PostCard } from '@/components/posts/post-card'

export default async function BlogPage() {
  const posts = await getPosts({ limit: 12 })

  return (
    <div>
      <h1>Blog</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {posts.map((post) => (
          <PostCard key={post.id} post={post} />
        ))}
      </div>
    </div>
  )
}
```

## Creating Dynamic Routes

For individual blog posts:

```typescript
// src/app/blog/[slug]/page.tsx
import { notFound } from 'next/navigation'
import { payload } from '@/payload'

export default async function BlogPost({ params }: {
  params: Promise<{ slug: string }>
}) {
  const { slug } = await params
  const post = await payload.find({
    collection: 'posts',
    where: {
      slug: {
        equals: slug,
      },
    },
  })

  if (!post.docs[0]) {
    notFound()
  }

  return (
    <article>
      <h1>{post.docs[0].title}</h1>
      <div dangerouslySetInnerHTML={{
        __html: post.docs[0].content
      }} />
    </article>
  )
}
```

## Adding Search Functionality

Implement a simple search feature:

```typescript
// src/app/actions/search.ts
'use server'

import { payload } from '@/payload'

export async function searchPosts(query: string) {
  const posts = await payload.find({
    collection: 'posts',
    where: {
      or: [
        {
          title: {
            like: query,
          },
        },
        {
          content: {
            like: query,
          },
        },
      ],
    },
  })

  return posts.docs
}
```

## Deploying to Vercel

Deploying is straightforward:

1. Push your code to GitHub
2. Import your project in Vercel
3. Add environment variables
4. Deploy!

```bash
# Add to package.json scripts
"build": "payload generate:types && next build"
```

## Best Practices

### 1. Always Generate Types

Run this command before building:

```bash
pnpm payload generate:types
```

This creates TypeScript types from your Payload configuration.

### 2. Use Server Components

Leverage Next.js 15 Server Components for better performance:

```typescript
// This runs on the server by default
export default async function Page() {
  const data = await fetchData()
  return <ClientComponent data={data} />
}
```

### 3. Optimize Images

Use Next.js Image component:

```typescript
import Image from 'next/image'

<Image
  src={post.featuredImage.url}
  alt={post.title}
  width={800}
  height={450}
  priority={isFirstPost}
/>
```

### 4. Implement Caching

Use Next.js revalidate for better performance:

```typescript
export const revalidate = 3600 // Revalidate every hour
```

## Troubleshooting

### Issue: "Module not found" errors

**Solution:** Make sure to run `pnpm payload generate:types` after changing collections.

### Issue: Database connection errors

**Solution:** Verify your `DATABASE_URI` is correct and the database is running.

### Issue: Slow build times

**Solution:** Use Turbopack for faster builds:

```bash
next dev --turbo
```

## Conclusion

Next.js 15 and Payload CMS 3.0 make for an excellent combination. You get a type-safe, performant blog with minimal configuration and maximum flexibility.

This stack allows you to focus on creating great content while handling all the technical complexity behind the scenes.

## Resources

- [Next.js Documentation](https://nextjs.org/docs)
- [Payload CMS Documentation](https://payloadcms.com/docs)
- [PostgreSQL Documentation](https://www.postgresql.org/docs)

Happy coding! 🚀
