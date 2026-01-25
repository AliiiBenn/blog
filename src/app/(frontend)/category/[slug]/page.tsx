import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { getCategoryBySlug } from '@/app/actions/categories'
import { getPosts } from '@/app/actions/posts'
import { PostGrid } from '@/components/posts/post-grid'
import { Button } from '@/components/ui/button'
import { ArrowRight, FileText } from 'lucide-react'

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

  return (
    <div className="bg-background">
      {/* Category Header - Terminal Style */}
      <section className="bg-background">
        <div className="mx-auto max-w-5xl border-x border-border">
          {/* Section Header */}
          <div>
            <div className="flex items-center gap-3 border-b border-border bg-muted/20 px-3 py-2">
              <FileText className="h-4 w-4 text-muted-foreground" />
              <div className="flex-1 font-mono text-xs text-muted-foreground">
                ~/category/{slug}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Main Content */}
      <section className="bg-background">
        <div className="mx-auto max-w-5xl border-x border-t border-b border-border">
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
