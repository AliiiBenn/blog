import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { getCategoryBySlug } from '@/app/actions/categories'
import { getPosts } from '@/app/actions/posts'
import { getCategories } from '@/app/actions/categories'
import { PostGrid } from '@/components/posts/post-grid'
import { Button } from '@/components/ui/button'
import { ArrowRight } from 'lucide-react'
import Link from 'next/link'

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
  const categories = await getCategories()

  return (
    <div className="bg-background py-16 sm:py-20 lg:py-24 px-3">
      {/* Main Content */}
      <section className="bg-background">
        <div className="mx-auto max-w-5xl border-x border-t border-b border-border">
          {/* Categories Filter */}
          {categories.length > 0 && (
            <div className="border-b border-border bg-muted/20">
              <div className="flex gap-0 overflow-x-auto">
                <Link href="/blog">
                  <Button
                    variant="outline"
                    size="sm"
                    className="font-mono text-xs whitespace-nowrap rounded-none h-auto px-4 py-2"
                  >
                    All
                  </Button>
                </Link>
                {categories.map((cat) => (
                  <Link key={cat.id} href={`/category/${cat.slug}`}>
                    <Button
                      variant={slug === cat.slug ? "default" : "outline"}
                      size="sm"
                      className="font-mono text-xs whitespace-nowrap rounded-none h-auto px-4 py-2"
                    >
                      {cat.name}
                    </Button>
                  </Link>
                ))}
              </div>
            </div>
          )}

          <PostGrid posts={posts} />

          {posts.length === 12 && (
            <div className="mt-8 flex justify-center px-4 pb-12">
              <Button variant="outline" size="default" className="font-mono w-full sm:w-auto">
                ./load_more.sh
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </div>
          )}
        </div>
      </section>
    </div>
  )
}
