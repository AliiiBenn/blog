import Link from 'next/link'
import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import Image from 'next/image'
import { getPostBySlug, getRelatedPosts, getRecentPosts } from '@/app/actions/posts'
import { PostGrid } from '@/components/posts/post-grid'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Kbd } from '@/components/ui/kbd'
import { ArrowRight, Calendar, Clock, ChevronRight, FileText, Share2 } from 'lucide-react'
import { format } from 'date-fns'

interface PostPageProps {
  params: Promise<{ slug: string }>
}

export async function generateMetadata({ params }: PostPageProps): Promise<Metadata> {
  const { slug } = await params
  const post = await getPostBySlug(slug)

  if (!post) {
    return {
      title: 'Post Not Found',
    }
  }

  return {
    title: post.metaTitle || post.title,
    description: post.metaDescription || post.excerpt || '',
    openGraph: {
      title: post.title,
      description: post.excerpt || '',
      type: 'article',
      publishedTime: post.publishedDate || undefined,
    },
  }
}

export default async function PostPage({ params }: PostPageProps) {
  const { slug } = await params
  const post = await getPostBySlug(slug)

  if (!post) {
    notFound()
  }

  const categoryData = typeof post.category === 'object' && post.category !== null ? post.category : null
  const tagsData = Array.isArray(post.tags) ? post.tags : []
  const relatedPosts = await getRelatedPosts(String(post.id), categoryData?.slug || '', 3)
  const recentPosts = await getRecentPosts(3)

  const coverImageData =
    typeof post.coverImage === 'object' && post.coverImage !== null ? post.coverImage : null
  const featuredImageData =
    typeof post.featuredImage === 'object' && post.featuredImage !== null
      ? post.featuredImage
      : null
  const imageUrl = (coverImageData || featuredImageData)?.url || null
  const imageAlt = (coverImageData || featuredImageData)?.alt || post.title

  return (
    <div className="bg-background">
      {/* Header - Terminal Style */}
      <section className="bg-background">
        <div className="mx-auto max-w-5xl border-x border-border">
          {/* Section Header */}
          <div>
            <div className="flex items-center gap-3 border-b border-border bg-muted/20 px-3 py-2">
              <FileText className="h-4 w-4 text-muted-foreground" />
              <div className="flex-1 font-mono text-xs text-muted-foreground truncate">
                ~/blog/{slug}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Main Content */}
      <section className="bg-background">
        <div className="mx-auto max-w-5xl border-x border-t border-b border-border px-4 py-12 sm:px-6 lg:px-8">
          {/* Back Button */}
          <div className="mb-8">
            <Link
              href="/blog"
              className="inline-flex items-center font-mono text-sm text-muted-foreground hover:text-foreground transition-colors"
            >
              <Kbd className="bg-muted mr-2">$</Kbd>
              <span>cd ..</span>
            </Link>
          </div>

          {/* Post Header */}
          <header className="mb-8">
            {/* Metadata */}
            <div className="mb-6 flex flex-wrap items-center gap-3 font-mono text-xs">
              {categoryData && (
                <Link
                  href={`/category/${categoryData.slug}`}
                  className="inline-flex items-center rounded-sm bg-muted/50 px-2 py-1 text-xs transition-colors hover:bg-muted"
                >
                  <ChevronRight className="h-3 w-3" />
                  <span className="ml-1">{categoryData.name}</span>
                </Link>
              )}
              {post.publishedDate && (
                <span className="flex items-center gap-1.5 text-muted-foreground">
                  <Calendar className="h-3 w-3" />
                  {format(new Date(post.publishedDate), 'MMM d, yyyy')}
                </span>
              )}
              {post.readingTime && (
                <span className="flex items-center gap-1.5 text-muted-foreground">
                  <Clock className="h-3 w-3" />
                  {post.readingTime}m read
                </span>
              )}
            </div>

            {/* Title */}
            <h1 className="mb-6 font-mono text-3xl font-bold sm:text-4xl lg:text-5xl">
              <span className="text-muted-foreground">{'>'}</span>
              <span className="ml-2 break-words">{post.title}</span>
            </h1>

            {/* Excerpt */}
            {post.excerpt && (
              <p className="mb-6 max-w-3xl font-mono text-sm text-muted-foreground break-words">
                {post.excerpt}
              </p>
            )}

            {/* Tags */}
            {tagsData.length > 0 && (
              <div className="mb-6 flex flex-wrap gap-2">
                {tagsData.map((tag) => {
                  const tagData = typeof tag === 'object' && tag !== null ? tag : null
                  if (!tagData) return null

                  return (
                    <Badge
                      key={tagData.id}
                      variant="outline"
                      className="font-mono text-xs border-border"
                    >
                      #{tagData.name}
                    </Badge>
                  )
                })}
              </div>
            )}

            {/* Share Button */}
            <div className="flex items-center gap-4">
              <Button variant="outline" size="sm" className="font-mono gap-2">
                <Share2 className="h-4 w-4" />
                <span>Share</span>
              </Button>
            </div>
          </header>

          {/* Cover Image */}
          {imageUrl && (
            <div className="mb-12 overflow-hidden rounded-lg border-2 border-border bg-background">
              <div className="relative aspect-[2/1] sm:aspect-[2.5/1]">
                <Image
                  src={imageUrl}
                  alt={imageAlt}
                  fill
                  className="object-cover"
                  priority
                  sizes="(max-width: 640px) 100vw, (max-width: 1024px) 100vw, 1200px"
                />
              </div>
            </div>
          )}

          {/* Article Content */}
          <article className="mb-16">
            <div className="prose prose-sm sm:prose-base max-w-none dark:prose-invert font-mono">
              {/* Content will be rendered here from Payload rich text */}
              {/* For now, displaying excerpt as placeholder */}
              {post.excerpt && (
                <div className="whitespace-pre-wrap text-foreground break-words">{post.excerpt}</div>
              )}
            </div>
          </article>

          {/* Related Posts */}
          {relatedPosts.length > 0 && (
            <section className="border-t border-border pt-12">
              {/* Section Header */}
              <div className="mb-6">
                <div className="flex items-center gap-3 border-b border-border bg-muted/20 px-3 py-2">
                  <FileText className="h-4 w-4 text-muted-foreground" />
                  <div className="flex-1 font-mono text-xs text-muted-foreground">
                    ./related_posts.sh
                  </div>
                </div>
              </div>
              <PostGrid posts={relatedPosts} />
            </section>
          )}

          {/* Recent Posts */}
          <section className="border-t border-border pt-12">
            <div className="mb-6 flex items-center justify-between">
              <div className="flex items-center gap-3 border-b border-border bg-muted/20 px-3 py-2">
                <FileText className="h-4 w-4 text-muted-foreground" />
                <div className="flex-1 font-mono text-xs text-muted-foreground">
                  ./recent_posts.sh
                </div>
              </div>
              <Button variant="outline" size="default" className="font-mono hidden sm:flex" asChild>
                <Link href="/blog">
                  ./view_all.sh
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
            </div>
            <div className="grid sm:grid-cols-2 lg:grid-cols-3">
              {recentPosts.map((recentPost) => (
                <Link
                  key={recentPost.id}
                  href={`/blog/${recentPost.slug}`}
                  className="group flex flex-col gap-2 border border-r border-b border-border bg-muted/20 p-4 hover:bg-muted/30 transition-colors"
                >
                  <h3 className="font-mono text-sm font-semibold line-clamp-2 group-hover:text-foreground transition-colors">
                    <span className="text-muted-foreground">{'>'}</span>
                    <span className="ml-1 break-words">{recentPost.title}</span>
                  </h3>
                  <p className="font-mono text-xs text-muted-foreground">
                    {recentPost.readingTime}m read
                  </p>
                </Link>
              ))}
            </div>
          </section>
        </div>
      </section>
    </div>
  )
}
