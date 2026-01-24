import Link from 'next/link'
import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import Image from 'next/image'
import { getCategoryBySlug } from '@/app/actions/categories'
import { getPosts } from '@/app/actions/posts'
import { PostGrid } from '@/components/posts/post-grid'
import { Button } from '@/components/ui/button'
import { ArrowLeft } from 'lucide-react'

interface CategoryPageProps {
  params: Promise<{ slug: string }>
}

export async function generateMetadata({ params }: CategoryPageProps): Promise<Metadata> {
  const { slug } = await params
  const category = await getCategoryBySlug(slug)

  if (!category) {
    return {
      title: 'Category Not Found',
    }
  }

  return {
    title: `${category.name} | Blog`,
    description: category.metaDescription || category.description,
  }
}

export default async function CategoryPage({ params }: CategoryPageProps) {
  const { slug } = await params
  const category = await getCategoryBySlug(slug)

  if (!category) {
    notFound()
  }

  const posts = await getPosts({ category: slug, limit: 12 })
  const imageData = typeof category.image === 'object' && category.image !== null ? category.image : null
  const iconData = typeof category.icon === 'object' && category.icon !== null ? category.icon : null

  return (
    <div className="mx-auto max-w-5xl px-4 py-12 sm:px-6 lg:px-8">
      <div className="mb-8">
        <Link
          href="/"
          className="inline-flex items-center text-sm text-muted-foreground hover:text-foreground transition-colors"
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Home
        </Link>
      </div>

      {/* Category Header */}
      <header className="mb-12">
        <div className="flex items-start gap-6">
          {iconData?.url && (
            <div className="relative size-24 flex-shrink-0 overflow-hidden rounded-full bg-muted">
              <Image
                src={iconData.url}
                alt={iconData.alt || category.name}
                fill
                className="object-cover"
                sizes="96px"
              />
            </div>
          )}

          <div className="flex-1">
            <h1 className="mb-4 text-4xl font-bold sm:text-5xl">{category.name}</h1>

            {category.description && (
              <p className="mb-4 max-w-2xl text-lg text-muted-foreground">
                {category.description}
              </p>
            )}

            <p className="text-sm text-muted-foreground">
              {posts.length} {posts.length === 1 ? 'post' : 'posts'} in this category
            </p>
          </div>
        </div>

        {imageData?.url && (
          <div className="relative mt-8 aspect-[2.5/1] overflow-hidden rounded-lg bg-muted">
            <Image
              src={imageData.url}
              alt={imageData.alt || category.name}
              fill
              className="object-cover"
              sizes="(max-width: 768px) 100vw, 1200px"
            />
          </div>
        )}
      </header>

      {/* Posts Grid */}
      <section>
        <h2 className="mb-6 text-2xl font-bold">Articles in {category.name}</h2>
        <PostGrid posts={posts} />

        {posts.length === 12 && (
          <div className="mt-8 flex justify-center">
            <Button variant="outline" size="lg">
              Load More Articles
            </Button>
          </div>
        )}
      </section>
    </div>
  )
}
