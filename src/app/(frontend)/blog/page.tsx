import type { Metadata } from 'next'
import { getPosts } from '@/app/actions/posts'
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

  return (
    <div className="bg-background py-16 sm:py-20 lg:py-24 px-3">
      {/* Main Content */}
      <section className="bg-background">
        <div className="mx-auto max-w-5xl border-x border-t border-b border-border">
          <PostGrid posts={posts} />

          {posts.length === 12 && (
            <div className="mt-8 flex justify-center">
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
