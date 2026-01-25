import Image from 'next/image'
import Link from 'next/link'
import type { Metadata } from 'next'
import type { Category } from '@/payload-types'
import { getRecentPosts } from '@/app/actions/posts'
import { getCategories, getFeaturedCategories } from '@/app/actions/categories'
import { PostGrid } from '@/components/posts/post-grid'
import { CategoryCard } from '@/components/categories/category-card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Kbd } from '@/components/ui/kbd'
import { ArrowRight, Terminal, ChevronRight, FolderOpen, FileText } from 'lucide-react'

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
      {/* Hero Section - Terminal Style */}
      <section className="bg-background">
        {/* Terminal Window Header */}
        <div className="mx-auto max-w-5xl border-x border-border px-4 py-4 sm:px-6 lg:px-8">
          <div className="mb-6 flex items-center gap-2 border-b border-border pb-4">
            <div className="flex gap-1.5">
              <div className="h-3 w-3 rounded-full bg-muted-foreground/60" />
              <div className="h-3 w-3 rounded-full bg-muted-foreground/40" />
              <div className="h-3 w-3 rounded-full bg-muted-foreground/20" />
            </div>
            <div className="ml-4 flex-1 border border-border bg-muted/30 px-3 py-1 font-mono text-xs text-muted-foreground">
              ~/blog/home
            </div>
          </div>

          {/* Terminal Prompt Header */}
          <div className="mb-8 font-mono text-sm">
            <div className="flex items-center gap-2 text-muted-foreground">
              <Kbd className="bg-muted">$</Kbd>
              <span>user@blog</span>
              <span className="text-foreground">:</span>
              <span className="text-foreground">~</span>
              <span className="text-foreground">./welcome.sh</span>
            </div>
          </div>

          <div>
            <div className="flex flex-col items-center gap-8 lg:flex-row lg:gap-12">
              <div className="flex-1">
                {/* Title with terminal decorations */}
                <div className="mb-6">
                  <div className="mb-4 font-mono text-xs text-muted-foreground">
                    <Badge variant="outline" className="font-mono">v1.0.0</Badge>
                    <span className="ml-2">// WELCOME_MESSAGE</span>
                  </div>
                  <h1 className="font-mono text-4xl font-bold tracking-tight sm:text-5xl">
                    <span className="text-muted-foreground">{'>'}</span>
                    <span className="ml-2 text-foreground">Hello_World</span>
                    <span className="animate-pulse">_</span>
                  </h1>
                </div>

                <p className="mb-2 font-mono text-sm text-muted-foreground">
                  <span>const</span>
                  <span className="text-foreground"> description = </span>
                  <span className="text-foreground">"Exploring the intersection of technology, design, and human experience"</span>
                </p>
                <p className="mb-8 font-mono text-sm text-muted-foreground">
                  <span>through</span>
                  <span className="text-foreground"> in-depth</span>
                  <span className="text-foreground">[articles]</span>
                  <span className="text-foreground">;</span>
                </p>

                <div className="flex flex-wrap justify-center gap-4 lg:justify-start">
                  <Button size="lg" className="font-mono" asChild>
                    <Link href="/blog">
                      <Terminal className="mr-2 h-4 w-4" />
                      ./browse_articles.sh
                      <ArrowRight className="ml-2 h-5 w-5" />
                    </Link>
                  </Button>
                  <Button size="lg" variant="outline" className="font-mono" asChild>
                    <Link href="#categories">
                      <FolderOpen className="mr-2 h-4 w-4" />
                      ls categories/
                    </Link>
                  </Button>
                </div>
              </div>

              {/* Terminal-style profile */}
              <div className="flex-shrink-0">
                <div className="relative overflow-hidden border-2 border-border bg-background">
                  <div className="border-b border-border bg-muted/50 px-3 py-2 font-mono text-xs text-muted-foreground">
                    <div className="flex items-center gap-2">
                      <Terminal className="h-3 w-3" />
                      <span>whoami</span>
                    </div>
                  </div>
                  <div className="p-6">
                    <div className="relative mx-auto size-48 overflow-hidden rounded-full border-2 border-border lg:size-56">
                      <Image
                        src="/me.png"
                        alt="Author"
                        fill
                        className="object-cover"
                        priority
                        sizes="256px"
                      />
                    </div>
                    <div className="mt-4 font-mono text-xs">
                      <div className="flex items-center gap-2 text-muted-foreground">
                        <ChevronRight className="h-3 w-3" />
                        <span>role:</span>
                        <span className="text-foreground">"Developer"</span>
                      </div>
                      <div className="mt-1 flex items-center gap-2 text-muted-foreground">
                        <ChevronRight className="h-3 w-3" />
                        <span>status:</span>
                        <Badge variant="secondary" className="text-[10px]">ONLINE</Badge>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Categories - Terminal Style */}
      <section id="categories" className="mx-auto max-w-5xl border-x border-t border-border bg-background px-4 py-12 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="mb-8">
          <div className="mb-4 flex items-center gap-3 border-b border-border pb-4">
            <FolderOpen className="h-5 w-5 text-muted-foreground" />
            <div className="flex-1 font-mono text-sm text-muted-foreground">
              ~/categories/
            </div>
          </div>
          <h2 className="mb-2 font-mono text-2xl font-bold">
            <span className="text-muted-foreground">{'>'}</span>
            <span className="ml-2">ls -la</span>
          </h2>
          <p className="font-mono text-sm text-muted-foreground">
            # Browse articles organized by topic
          </p>
        </div>
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {categoriesWithCount.map(({ category, count }: { category: Category; count: number }) => (
            <CategoryCard key={category.id} category={category} postCount={count} />
          ))}
        </div>
      </section>

      {/* Latest Posts - Terminal Style */}
      <section className="mx-auto max-w-5xl border-x border-t border-border bg-background px-4 py-12 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="mb-8 flex items-center justify-between">
          <div>
            <div className="mb-4 flex items-center gap-3 border-b border-border pb-4">
              <FileText className="h-5 w-5 text-muted-foreground" />
              <div className="flex-1 font-mono text-sm text-muted-foreground">
                ~/posts/
              </div>
            </div>
            <h2 className="mb-2 font-mono text-2xl font-bold">
              <span className="text-muted-foreground">{'>'}</span>
              <span className="ml-2">cat latest.log</span>
            </h2>
            <p className="font-mono text-sm text-muted-foreground">
              # Fresh insights and tutorials
            </p>
          </div>
          <Button variant="outline" className="font-mono" asChild>
            <Link href="/blog">
              ./view_all.sh
              <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
          </Button>
        </div>
        <PostGrid posts={recentPosts} />
      </section>

      {/* Newsletter CTA - Terminal Style */}
      <section className="mx-auto max-w-5xl border-x border-t border-b border-border bg-background px-4 py-12 sm:px-6 lg:px-8">
        <div className="border-2 border-dashed border-border bg-muted/20 p-8">
          <div className="mx-auto max-w-2xl text-center">
            {/* Terminal prompt */}
            <div className="mb-4 font-mono text-xs">
              <div className="inline-flex items-center gap-2 rounded-t-lg border border-border bg-muted px-3 py-2">
                <Kbd className="bg-background">$</Kbd>
                <span className="text-muted-foreground">curl --subscribe newsletter</span>
                <span className="animate-pulse">_</span>
              </div>
            </div>
            <h2 className="mb-4 font-mono text-xl font-bold">
              <span className="text-muted-foreground">TODO:</span>
              <span className="ml-2 text-foreground">Stay Updated</span>
            </h2>
            <p className="mb-6 font-mono text-sm text-muted-foreground">
              /* Get the latest articles delivered straight to your inbox */
            </p>
            <Button size="lg" disabled className="font-mono">
              <span className="text-muted-foreground">[ ]</span>
              <span className="ml-2">Subscribe to Newsletter</span>
              <Badge variant="secondary" className="ml-2 text-xs">WIP</Badge>
            </Button>
          </div>
        </div>
      </section>
    </div>
  )
}
