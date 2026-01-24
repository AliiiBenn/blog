import Image from 'next/image'
import Link from 'next/link'
import type { Metadata } from 'next'
import type { Category } from '@/payload-types'
import { getRecentPosts } from '@/app/actions/posts'
import { getCategories, getFeaturedCategories } from '@/app/actions/categories'
import { PostGrid } from '@/components/posts/post-grid'
import { CategoryCard } from '@/components/categories/category-card'
import { Button } from '@/components/ui/button'
import { ArrowRight } from 'lucide-react'

export const metadata: Metadata = {
  title: 'Home',
  description: 'A modern blog built with Payload CMS and Next.js',
}

export default async function HomePage() {
  const [featuredCategories, allCategories] = await Promise.all([
    getFeaturedCategories(),
    getCategories(),
  ])
  const recentPosts = await getRecentPosts(6)

  const categories = featuredCategories.length > 0 ? featuredCategories : allCategories.slice(0, 6)

  // Calculate post count per category
  const categoriesWithCount = await Promise.all(
    categories.map(async (category: Category) => {
      const { getPosts } = await import('@/app/actions/posts')
      const categoryPosts = await getPosts({ category: category.slug, limit: 100 })
      return {
        category,
        count: categoryPosts.length,
      }
    }),
  )

  return (
    <div className="bg-background">
      {/* Hero Section */}
      <section className="border-b bg-background py-24">
        <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col items-center gap-12 lg:flex-row lg:gap-16">
            <div className="flex-1 text-center lg:text-left">
              <h1 className="mb-6 text-5xl font-bold tracking-tight sm:text-6xl">
                Welcome to My Blog
              </h1>
              <p className="mb-8 text-lg text-muted-foreground sm:text-xl">
                Exploring the intersection of technology, design, and human experience
                through in-depth articles.
              </p>
              <div className="flex flex-wrap justify-center gap-4 lg:justify-start">
                <Button size="lg" asChild>
                  <Link href="/blog">
                    Browse Articles
                    <ArrowRight className="ml-2 h-5 w-5" />
                  </Link>
                </Button>
                <Button size="lg" variant="outline" asChild>
                  <Link href="#categories">Explore Categories</Link>
                </Button>
              </div>
            </div>

            <div className="relative size-64 flex-shrink-0 overflow-hidden rounded-full border-4 border-border lg:size-80">
              <Image
                src="/me.png"
                alt="Author"
                fill
                className="object-cover"
                priority
                sizes="320px"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Featured Categories */}
      <section id="categories" className="border-x border-border bg-background py-16">
        <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
          <div className="mb-8 text-center">
            <h2 className="mb-3 text-3xl font-bold">Explore by Category</h2>
            <p className="text-muted-foreground">
              Browse articles organized by topic
            </p>
          </div>
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {categoriesWithCount.map(({ category, count }: { category: Category; count: number }) => (
              <CategoryCard key={category.id} category={category} postCount={count} />
            ))}
          </div>
        </div>
      </section>

      {/* Latest Posts */}
      <section className="border-x border-border bg-background py-16">
        <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
          <div className="mb-8 flex items-center justify-between">
            <div>
              <h2 className="mb-3 text-3xl font-bold">Latest Articles</h2>
              <p className="text-muted-foreground">
                Fresh insights and tutorials
              </p>
            </div>
            <Button variant="outline" asChild>
              <Link href="/blog">
                View All
                <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
          </div>
          <PostGrid posts={recentPosts} />
        </div>
      </section>

      {/* Newsletter CTA (future feature) */}
      <section className="border-x border-t border-border bg-background py-16">
        <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-2xl text-center">
            <h2 className="mb-4 text-2xl font-bold">Stay Updated</h2>
            <p className="mb-6 text-muted-foreground">
              Get the latest articles delivered straight to your inbox.
            </p>
            <Button size="lg" disabled>
              Subscribe to Newsletter
              <span className="ml-2 text-xs">(Coming Soon)</span>
            </Button>
          </div>
        </div>
      </section>
    </div>
  )
}
