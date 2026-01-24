import Link from 'next/link'
import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import Image from 'next/image'
import { getTagBySlug } from '@/app/actions/tags'
import { getPosts } from '@/app/actions/posts'
import { format } from 'date-fns'
import { Calendar, Clock, ArrowLeft } from 'lucide-react'
import { Button } from '@/components/ui/button'

interface TagPageProps {
  params: Promise<{ slug: string }>
}

export async function generateMetadata({ params }: TagPageProps): Promise<Metadata> {
  const { slug } = await params
  const tag = await getTagBySlug(slug)

  if (!tag) {
    return {
      title: 'Tag Not Found',
    }
  }

  return {
    title: `#${tag.name} | Blog`,
    description: tag.metaDescription || tag.description || `Articles tagged with "${tag.name}"`,
  }
}

export default async function TagPage({ params }: TagPageProps) {
  const { slug } = await params
  const tag = await getTagBySlug(slug)

  if (!tag) {
    notFound()
  }

  const posts = await getPosts({ tag: slug, limit: 10 })

  return (
    <div className="container py-12">
      <div className="mb-8">
        <Link
          href="/"
          className="inline-flex items-center text-sm text-muted-foreground hover:text-foreground transition-colors"
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Home
        </Link>
      </div>

      {/* Tag Header */}
      <header className="mb-12">
        <h1 className="mb-4 text-4xl font-bold sm:text-5xl">
          #{tag.name}
        </h1>

        {tag.description && (
          <p className="mb-4 max-w-2xl text-lg text-muted-foreground">
            {tag.description}
          </p>
        )}

        <p className="text-sm text-muted-foreground">
          {posts.length} {posts.length === 1 ? 'article' : 'articles'} tagged with &quot;{tag.name}&quot;
        </p>
      </header>

      {/* Posts List (vertical layout) */}
      <section className="space-y-6">
        {posts.length === 0 ? (
          <div className="flex min-h-[300px] items-center justify-center rounded-lg border bg-card p-12">
            <p className="text-muted-foreground">No posts found with this tag.</p>
          </div>
        ) : (
          posts.map((post) => {
            const imageData =
              typeof post.featuredImage === 'object' && post.featuredImage !== null
                ? post.featuredImage
                : null
            const categoryData =
              typeof post.category === 'object' && post.category !== null
                ? post.category
                : null

            return (
              <Link
                key={post.id}
                href={`/blog/${post.slug}`}
                className="group grid gap-4 sm:grid-cols-[300px_1fr] sm:items-center rounded-lg border bg-card p-4 transition-all hover:shadow-lg"
              >
                {imageData?.url && (
                  <div className="relative aspect-video overflow-hidden rounded-md bg-muted sm:aspect-square sm:size-20">
                    <Image
                      src={imageData.url}
                      alt={imageData.alt || post.title}
                      fill
                      className="object-cover transition-transform group-hover:scale-105"
                      sizes="(max-width: 640px) 100vw, 300px"
                    />
                  </div>
                )}

                <div className="flex flex-1 flex-col">
                  <div className="mb-2 flex items-center gap-3">
                    {categoryData && (
                      <Link
                        href={`/category/${categoryData.slug}`}
                        className="inline-flex items-center rounded-full bg-primary/10 px-3 py-1 text-xs font-medium text-primary transition-colors hover:bg-primary/20"
                        onClick={(e) => e.stopPropagation()}
                      >
                        {categoryData.name}
                      </Link>
                    )}
                    <div className="flex items-center gap-3 text-xs text-muted-foreground">
                      {post.publishedDate && (
                        <span className="flex items-center gap-1">
                          <Calendar className="h-3 w-3" />
                          {format(new Date(post.publishedDate), 'MMM d, yyyy')}
                        </span>
                      )}
                      <span className="flex items-center gap-1">
                        <Clock className="h-3 w-3" />
                        {post.readingTime} min read
                      </span>
                    </div>
                  </div>

                  <h3 className="mb-2 text-xl font-semibold group-hover:text-primary transition-colors">
                    {post.title}
                  </h3>

                  {post.excerpt && (
                    <p className="mb-4 flex-1 text-sm text-muted-foreground line-clamp-2">
                      {post.excerpt}
                    </p>
                  )}

                  <div className="mt-auto flex items-center gap-2 text-xs text-muted-foreground">
                    {Array.isArray(post.tags) &&
                      post.tags.slice(0, 2).map((tag) => {
                        const tagData = typeof tag === 'object' && tag !== null ? tag : null
                        if (!tagData) return null

                        return (
                          <span
                            key={tagData.id}
                            className="inline-flex items-center rounded-full bg-secondary px-2 py-0.5"
                          >
                            #{tagData.name}
                          </span>
                        )
                      })}
                  </div>
                </div>
              </Link>
            )
          })
        )}
      </section>

      {posts.length === 10 && (
        <div className="mt-8 flex justify-center">
          <Button variant="outline" size="lg">
            Load More Articles
          </Button>
        </div>
      )}
    </div>
  )
}
