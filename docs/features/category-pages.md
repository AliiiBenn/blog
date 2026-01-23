# Category Pages

## Overview

Create category pages at `/category/[slug]` that display all posts within a specific category.

**Note**: Since the blog listing uses query parameters (`/blog?category=slug`), these pages provide cleaner URLs and SEO benefits.

## Page Implementation

Create `app/category/[slug]/page.tsx`:

```typescript
import { notFound } from 'next/navigation';
import { Metadata } from 'next';
import { Suspense } from 'react';
import { CategoryHeader } from '@/components/blog/category-header';
import { ArticleList } from '@/components/blog/article-list';
import { Pagination } from '@/components/blog/pagination';
import { getPayloadClient } from '@/lib/payload-client';

interface CategoryPageProps {
  params: {
    slug: string;
  };
  searchParams: {
    page?: string;
  };
}

export async function generateMetadata({ params }: CategoryPageProps): Promise<Metadata> {
  const payload = await getPayloadClient();

  const category = await payload.find({
    collection: 'categories',
    where: {
      slug: {
        equals: params.slug,
      },
    },
    limit: 1,
  });

  if (!category.docs[0]) {
    return {
      title: 'Category Not Found',
    };
  }

  return {
    title: `${category.docs[0].name} | Category`,
    description: category.docs[0].description || `All posts in ${category.docs[0].name}`,
    openGraph: {
      title: `${category.docs[0].name} | Category`,
      description: category.docs[0].description || `All posts in ${category.docs[0].name}`,
      type: 'website',
    },
  };
}

export default async function CategoryPage({
  params,
  searchParams,
}: CategoryPageProps) {
  const payload = await getPayloadClient();
  const page = parseInt(searchParams.page || '1');
  const pageSize = 12;

  // Fetch category
  const categoryData = await payload.find({
    collection: 'categories',
    where: {
      slug: {
        equals: params.slug,
      },
    },
    limit: 1,
  });

  if (!categoryData.docs[0]) {
    notFound();
  }

  const category = categoryData.docs[0];

  // Fetch posts in this category
  const posts = await payload.find({
    collection: 'posts',
    where: {
      and: [
        {
          status: {
            equals: 'published',
          },
        },
        {
          category: {
            equals: category.id,
          },
        },
      ],
    },
    sort: '-publishedAt',
    limit: pageSize,
    page,
    depth: 2,
  });

  const totalPages = Math.ceil(posts.totalDocs / pageSize);

  return (
    <div className="container py-12">
      <CategoryHeader category={category} postsCount={posts.totalDocs} />

      <Suspense fallback={<div>Loading posts...</div>}>
        <div className="space-y-8">
          <ArticleList posts={posts.docs} />

          {totalPages > 1 && (
            <Pagination
              currentPage={page}
              totalPages={totalPages}
              category={params.slug}
            />
          )}
        </div>
      </Suspense>
    </div>
  );
}
```

## Category Header Component

Create `components/blog/category-header.tsx`:

```typescript
import Link from 'next/link';

interface CategoryHeaderProps {
  category: {
    name: string;
    slug: string;
    description?: string;
    icon?: string;
  };
  postsCount: number;
}

export function CategoryHeader({ category, postsCount }: CategoryHeaderProps) {
  return (
    <div className="mb-8">
      {/* Breadcrumb */}
      <nav className="flex items-center space-x-2 text-sm text-muted-foreground mb-4 font-mono">
        <Link href="/" className="hover:text-primary transition-colors">
          ~/home
        </Link>
        <span>/</span>
        <Link href="/blog" className="hover:text-primary transition-colors">
          blog
        </Link>
        <span>/</span>
        <span className="text-foreground">{category.name}</span>
      </nav>

      {/* Header */}
      <div className="flex items-start gap-4">
        {category.icon && (
          <div className="text-6xl">{category.icon}</div>
        )}
        <div>
          <h1 className="text-4xl font-bold font-mono">{category.name}</h1>
          {category.description && (
            <p className="mt-2 text-lg text-muted-foreground">
              {category.description}
            </p>
          )}
          <p className="mt-4 text-sm text-muted-foreground font-mono">
            {postsCount} post{postsCount !== 1 ? 's' : ''} in this category
          </p>
        </div>
      </div>
    </div>
  );
}
```

## Generate Static Params (Optional)

For static generation:

```typescript
export async function generateStaticParams() {
  const payload = await getPayloadClient();

  const categories = await payload.find({
    collection: 'categories',
    limit: 1000,
    depth: 0,
  });

  return categories.docs.map((category) => ({
    slug: category.slug,
  }));
}
```

Add this to `app/category/[slug]/page.tsx`.

## Category Page Layout

Create `app/category/[slug]/layout.tsx`:

```typescript
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Category',
  description: 'Browse posts by category',
};

export default function CategoryLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
```

## Next Steps

- [ ] Implement about page
- [ ] Implement search page
- [ ] Add category filtering in blog listing
