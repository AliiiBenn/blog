import Image from 'next/image'
import Link from 'next/link'
import type { Metadata } from 'next'
import { getPosts, getRecentPosts } from '@/app/actions/posts'
import { PostGrid } from '@/components/posts/post-grid'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Kbd } from '@/components/ui/kbd'
import { ArrowRight, FileText, FolderOpen, ChevronRight } from 'lucide-react'

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
    <div className="bg-background">
      {/* Blog Header - Terminal Style */}
      <section className="bg-background">
        <div className="mx-auto max-w-5xl border-x border-border px-4 py-12 sm:px-6 lg:px-8">
          {/* Terminal Prompt */}
          <div className="mb-6 font-mono text-sm">
            <div className="flex items-center gap-2 text-muted-foreground">
              <Kbd className="bg-muted">$</Kbd>
              <span>cd ~/blog</span>
            </div>
          </div>

          <header className="mb-8">
            <div className="mb-4 flex items-center gap-3 border-b border-border pb-4">
              <FileText className="h-5 w-5 text-muted-foreground" />
              <div className="flex-1 font-mono text-sm text-muted-foreground">
                ~/blog/
              </div>
            </div>
            <h1 className="mb-4 font-mono text-4xl font-bold sm:text-5xl">
              <span className="text-muted-foreground">{'>'}</span>
              <span className="ml-2 text-foreground">ls -la</span>
            </h1>
            <p className="font-mono text-sm text-muted-foreground">
              # Exploring {posts.length} articles on technology, design, and development
            </p>
          </header>
        </div>
      </section>

      {/* Main Content */}
      <section className="bg-background">
        <div className="mx-auto max-w-5xl border-x border-t border-b border-border px-4 py-12 sm:px-6 lg:px-8">
          <div className="grid gap-12 lg:grid-cols-[1fr_300px]">
            <div>
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

            <aside className="space-y-8">
              {/* Recent Posts - Terminal Style */}
              <section>
                <div className="mb-4 flex items-center gap-3 border-b border-border pb-4">
                  <FileText className="h-5 w-5 text-muted-foreground" />
                  <div className="flex-1 font-mono text-sm text-muted-foreground">
                    recent.log
                  </div>
                </div>
                <h2 className="mb-4 font-mono text-xl font-bold">
                  <span className="text-muted-foreground">{'>'}</span>
                  <span className="ml-2">Recent Posts</span>
                </h2>
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
                        className="group flex gap-3 border border-border bg-muted/20 p-3 hover:bg-muted/30 transition-colors"
                      >
                        {imageData?.url && (
                          <div className="relative size-20 flex-shrink-0 overflow-hidden rounded-md border border-border bg-background">
                            <Image
                              src={imageData.url}
                              alt={imageData.alt || post.title}
                              fill
                              className="object-cover transition-transform group-hover:scale-105"
                              sizes="80px"
                            />
                          </div>
                        )}
                        <div className="flex-1 min-w-0">
                          <div className="mb-1 font-mono text-xs text-muted-foreground">
                            <ChevronRight className="inline h-3 w-3" />
                            <span className="ml-1">{post.readingTime} min read</span>
                          </div>
                          <h3 className="mb-1 text-sm font-medium line-clamp-2 group-hover:text-foreground transition-colors">
                            {post.title}
                          </h3>
                        </div>
                      </Link>
                    )
                  })}
                </div>
              </section>

              {/* Categories - Terminal Style */}
              <section className="border-2 border-border bg-background">
                <div className="border-b border-border bg-muted/30 px-3 py-2 font-mono text-xs text-muted-foreground">
                  <div className="flex items-center gap-2">
                    <FolderOpen className="h-3 w-3" />
                    <span>categories.sh</span>
                  </div>
                </div>
                <div className="p-4">
                  <h2 className="mb-2 font-mono text-lg font-bold">
                    <span className="text-muted-foreground">{'>'}</span>
                    <span className="ml-2">Categories</span>
                  </h2>
                  <p className="mb-4 font-mono text-xs text-muted-foreground">
                    # Browse articles by topic
                  </p>
                  <Button variant="outline" className="w-full font-mono text-sm" asChild>
                    <Link href="/#categories">
                      ./view_categories.sh
                    </Link>
                  </Button>
                </div>
              </section>
            </aside>
          </div>
        </div>
      </section>
    </div>
  )
}
