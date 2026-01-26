import Link from 'next/link'
import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import Image from 'next/image'
import { getPostBySlug, getRelatedPosts } from '@/app/actions/posts'
import { PostGrid } from '@/components/posts/post-grid'
import { Badge } from '@/components/ui/badge'
import { RichText } from '@/components/richtext'
import { CopyUrlButton } from '@/components/blog/copy-url-button'
import { Calendar, Clock, ChevronRight, FileText } from 'lucide-react'
import { format } from 'date-fns'
import type { SerializedEditorState } from '@payloadcms/richtext-lexical/lexical'

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

  const coverImageData =
    typeof post.coverImage === 'object' && post.coverImage !== null ? post.coverImage : null
  const featuredImageData =
    typeof post.featuredImage === 'object' && post.featuredImage !== null
      ? post.featuredImage
      : null
  const imageUrl = (coverImageData || featuredImageData)?.url || null
  const imageAlt = (coverImageData || featuredImageData)?.alt || post.title

  return (
    <div className="bg-background py-24">
      {/* Header - Terminal Style */}
      <section className="bg-background">
        <div className="mx-auto max-w-5xl border-x border-t border-border">
          {/* Section Header */}
          <div className="flex items-center gap-3 border-b border-border bg-muted/20 px-3 py-2">
            <FileText className="h-4 w-4 text-muted-foreground" />
            <div className="flex-1 font-mono text-xs text-muted-foreground truncate">
              ~/blog/{slug}
            </div>
          </div>
        </div>
      </section>

      {/* Main Content */}
      <section className="bg-background">
        <div className="mx-auto max-w-5xl border-x border-t border-b border-border">
          <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
          {/* Post Header */}
          <header className="mb-8">
            {/* Category */}
            {categoryData && (
              <div className="mb-6">
                <Link
                  href={`/category/${categoryData.slug}`}
                  className="inline-flex items-center rounded-sm bg-muted/50 px-2 py-1 text-xs transition-colors hover:bg-muted font-mono"
                >
                  <ChevronRight className="h-3 w-3" />
                  <span className="ml-1">{categoryData.name}</span>
                </Link>
              </div>
            )}

            {/* Title with actions */}
            <div className="relative mb-6">
              {/* Copy URL button */}
              <CopyUrlButton className="absolute -top-8 right-0" />

              <h1 className="pr-20 text-3xl font-bold sm:text-4xl lg:text-5xl">
                <span className="break-words">{post.title}</span>
              </h1>

              {/* Bottom info - reading time left, date right */}
              <div className="flex items-center justify-between text-xs font-mono text-muted-foreground mt-2">
                <div className="flex items-center gap-1.5">
                  <Clock className="h-3 w-3" />
                  {post.readingTime && <span>{post.readingTime}m read</span>}
                </div>
                {post.publishedDate && (
                  <div className="flex items-center gap-1.5">
                    <Calendar className="h-3 w-3" />
                    {format(new Date(post.publishedDate), 'MMM d, yyyy')}
                  </div>
                )}
              </div>
            </div>

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
          </header>

          {/* Separator */}
          <div className="border-b border-border mb-12" />

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
            {post.content && typeof post.content === 'object' ? (
              <RichText data={post.content as SerializedEditorState} className="max-w-none" />
            ) : post.excerpt ? (
              <div className="font-mono text-sm whitespace-pre-wrap text-foreground break-words">
                {post.excerpt}
              </div>
            ) : null}
          </article>
          </div>

          {/* Related Posts */}
          {relatedPosts.length > 0 && (
            <section className="border-t border-border">
              {/* Section Header */}
              <div>
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
        </div>
      </section>
    </div>
  )
}
