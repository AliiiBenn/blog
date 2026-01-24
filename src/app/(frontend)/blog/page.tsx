import Image from 'next/image'
import Link from 'next/link'
import type { Metadata } from 'next'
import { getPosts, getRecentPosts } from '@/app/actions/posts'
import { PostGrid } from '@/components/posts/post-grid'
import { Button } from '@/components/ui/button'
import { ArrowRight } from 'lucide-react'

export const metadata: Metadata = {
  title: 'Blog',
  description: 'Explore our latest articles on web development, design, and technology.',
}

export default async function BlogPage(
  props: {
    searchParams: Promise<{ category?: string; tag?: string; page?: string }>
  }
) {
  const searchParams = await props.searchParams
  const category = searchParams.category
  const tag = searchParams.tag
  const page = parseInt(searchParams.page || '1', 10)

  const posts = await getPosts({
    category,
    tag,
    limit: 12,
    page,
  })

  const recentPosts = await getRecentPosts(3)

  return (
    <div className="container py-12">
      <header className="mb-12">
        <h1 className="mb-4 text-4xl font-bold sm:text-5xl">Blog</h1>
        <p className="text-lg text-muted-foreground">
          Exploring {posts.length} articles on technology, design, and development
        </p>
      </header>

      <div className="grid gap-12 lg:grid-cols-[1fr_300px]">
        <div>
          <PostGrid posts={posts} />

          {posts.length === 12 && (
            <div className="mt-8 flex justify-center">
              <Button variant="outline" size="lg">
                Load More
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </div>
          )}
        </div>

        <aside className="space-y-8">
          <section>
            <h2 className="mb-4 text-xl font-semibold">Recent Posts</h2>
            <div className="space-y-4">
              {recentPosts.map((post) => {
                const imageData =
                  typeof post.featuredImage === 'object' && post.featuredImage !== null
                    ? post.featuredImage
                    : null

                return (
                  <Link
                    key={post.id}
                    href={`/blog/${post.slug}`}
                    className="group flex gap-3"
                  >
                    {imageData?.url && (
                      <div className="relative size-20 flex-shrink-0 overflow-hidden rounded-md bg-muted">
                        <Image
                          src={imageData.url}
                          alt={imageData.alt || post.title}
                          fill
                          className="object-cover transition-transform group-hover:scale-105"
                          sizes="80px"
                        />
                      </div>
                    )}
                    <div className="flex-1">
                      <h3 className="mb-1 text-sm font-medium line-clamp-2 group-hover:text-primary transition-colors">
                        {post.title}
                      </h3>
                      <p className="text-xs text-muted-foreground">
                        {post.readingTime} min read
                      </p>
                    </div>
                  </Link>
                )
              })}
            </div>
          </section>

          <section className="rounded-lg border bg-card p-6">
            <h2 className="mb-4 text-xl font-semibold">Categories</h2>
            <p className="mb-4 text-sm text-muted-foreground">
              Browse articles by topic
            </p>
            <Button variant="outline" className="w-full" asChild>
              <Link href="/#categories">View All Categories</Link>
            </Button>
          </section>
        </aside>
      </div>
    </div>
  )
}
