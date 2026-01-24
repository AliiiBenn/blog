import Link from 'next/link'
import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import Image from 'next/image'
import { getPostBySlug, getRelatedPosts, getRecentPosts } from '@/app/actions/posts'
import { PostHero } from '@/components/posts/post-hero'
import { PostGrid } from '@/components/posts/post-grid'
import { Button } from '@/components/ui/button'
import { ArrowLeft, ArrowRight } from 'lucide-react'

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
    <div className="container py-12">
      <div className="mb-8">
        <Link
          href="/blog"
          className="inline-flex items-center text-sm text-muted-foreground hover:text-foreground transition-colors"
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Blog
        </Link>
      </div>

      <PostHero post={post} />

      <article className="mb-16">
        {imageUrl && (
          <div className="relative mb-12 aspect-[2/1] overflow-hidden rounded-lg bg-muted">
            <Image
              src={imageUrl}
              alt={imageAlt}
              fill
              className="object-cover"
              priority
              sizes="(max-width: 768px) 100vw, 1200px"
            />
          </div>
        )}

        <div className="prose prose-lg max-w-none">
          {/* Content will be rendered here from Payload rich text */}
          {/* For now, displaying excerpt as placeholder */}
          {post.excerpt && (
            <div className="whitespace-pre-wrap text-foreground">{post.excerpt}</div>
          )}
        </div>
      </article>

      {relatedPosts.length > 0 && (
        <section className="border-t pt-12">
          <h2 className="mb-6 text-2xl font-bold">Related Posts</h2>
          <PostGrid posts={relatedPosts} />
        </section>
      )}

      <section className="border-t pt-12">
        <div className="mb-6 flex items-center justify-between">
          <h2 className="text-2xl font-bold">Recent Posts</h2>
          <Button variant="outline" asChild>
            <Link href="/blog">
              View All
              <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
          </Button>
        </div>
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {recentPosts.map((post) => (
            <Link
              key={post.id}
              href={`/blog/${post.slug}`}
              className="group"
            >
              <h3 className="mb-2 text-lg font-semibold group-hover:text-primary transition-colors line-clamp-2">
                {post.title}
              </h3>
              <p className="text-sm text-muted-foreground">{post.readingTime} min read</p>
            </Link>
          ))}
        </div>
      </section>
    </div>
  )
}
