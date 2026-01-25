import Link from 'next/link'
import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import Image from 'next/image'
import { getCategoryBySlug } from '@/app/actions/categories'
import { getPosts } from '@/app/actions/posts'
import { PostGrid } from '@/components/posts/post-grid'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Kbd } from '@/components/ui/kbd'
import { ArrowRight, FolderOpen, FileText, ChevronRight } from 'lucide-react'

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
    <div className="bg-background">
      {/* Category Header - Terminal Style */}
      <section className="bg-background">
        <div className="mx-auto max-w-5xl border-x border-border px-4 py-12 sm:px-6 lg:px-8">
          {/* Back Button */}
          <div className="mb-6">
            <Link
              href="/"
              className="inline-flex items-center font-mono text-sm text-muted-foreground hover:text-foreground transition-colors"
            >
              <Kbd className="bg-muted mr-2">$</Kbd>
              <span>cd ..</span>
            </Link>
          </div>

          {/* Terminal Prompt */}
          <div className="mb-6 font-mono text-sm">
            <div className="flex items-center gap-2 text-muted-foreground">
              <Kbd className="bg-muted">$</Kbd>
              <span>cd ~/categories/{slug}</span>
            </div>
          </div>

          {/* Category Header */}
          <header className="mb-8">
            <div className="mb-4 flex items-center gap-3 border-b border-border pb-4">
              <FolderOpen className="h-5 w-5 text-muted-foreground" />
              <div className="flex-1 font-mono text-sm text-muted-foreground">
                ~/categories/{slug}/
              </div>
              <Badge variant="outline" className="font-mono text-xs">
                {posts.length} posts
              </Badge>
            </div>

            <div className="flex items-start gap-6">
              {iconData?.url && (
                <div className="relative size-24 flex-shrink-0 overflow-hidden rounded-full border-2 border-border bg-background">
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
                <h1 className="mb-4 font-mono text-4xl font-bold sm:text-5xl">
                  <span className="text-muted-foreground">{'>'}</span>
                  <span className="ml-2 text-foreground">{category.name}</span>
                </h1>

                {category.description && (
                  <p className="mb-4 max-w-2xl font-mono text-sm text-muted-foreground">
                    {/* {category.description} */}
                  </p>
                )}

                <p className="font-mono text-xs text-muted-foreground">
                  <ChevronRight className="inline h-3 w-3" />
                  <span className="ml-1">{posts.length} {posts.length === 1 ? 'post' : 'posts'} in this category</span>
                </p>
              </div>
            </div>

            {imageData?.url && (
              <div className="relative mt-8 aspect-[2.5/1] overflow-hidden rounded-lg border-2 border-border bg-background">
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
        </div>
      </section>

      {/* Posts Grid - Terminal Style */}
      <section className="bg-background">
        <div className="mx-auto max-w-5xl border-x border-t border-b border-border px-4 py-12 sm:px-6 lg:px-8">
          <div className="mb-6 flex items-center gap-3 border-b border-border pb-4">
            <FileText className="h-5 w-5 text-muted-foreground" />
            <div className="flex-1 font-mono text-sm text-muted-foreground">
              ls articles/
            </div>
          </div>
          <h2 className="mb-6 font-mono text-2xl font-bold">
            <span className="text-muted-foreground">{'>'}</span>
            <span className="ml-2">cat {category.name}_articles.txt</span>
          </h2>
          <PostGrid posts={posts} />

          {posts.length === 12 && (
            <div className="mt-8 flex justify-center">
              <Button variant="outline" size="lg" className="font-mono">
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
