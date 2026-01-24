import Link from 'next/link'
import type { Post } from '@/payload-types'
import { format } from 'date-fns'
import { Calendar, Clock, Share2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { TagBadge } from '@/components/tags/tag-badge'

interface PostHeroProps {
  post: Post
}

export const PostHero = ({ post }: PostHeroProps) => {
  const {
    title,
    excerpt,
    publishedDate,
    readingTime,
    category,
    tags,
  } = post

  const categoryData = typeof category === 'object' && category !== null ? category : null
  const tagsData = Array.isArray(tags) ? tags : []

  return (
    <header className="mb-8">
      <div className="mb-4 flex flex-wrap items-center gap-3">
        {categoryData && (
          <Link
            href={`/category/${categoryData.slug}`}
            className="inline-flex items-center rounded-full bg-primary/10 px-4 py-1.5 text-sm font-medium text-primary transition-colors hover:bg-primary/20"
          >
            {categoryData.name}
          </Link>
        )}
        <div className="flex items-center gap-4 text-sm text-muted-foreground">
          {publishedDate && (
            <span className="flex items-center gap-1.5">
              <Calendar className="h-4 w-4" />
              {format(new Date(publishedDate), 'MMMM d, yyyy')}
            </span>
          )}
          <span className="flex items-center gap-1.5">
            <Clock className="h-4 w-4" />
            {readingTime} min read
          </span>
        </div>
      </div>

      <h1 className="mb-4 text-4xl font-bold leading-tight sm:text-5xl">
        {title}
      </h1>

      {excerpt && (
        <p className="mb-6 max-w-3xl text-lg text-muted-foreground">
          {excerpt}
        </p>
      )}

      <div className="flex items-center justify-between border-y py-4">
        {tagsData.length > 0 && (
          <div className="flex flex-wrap gap-2">
            {tagsData.map((tag) => {
              const tagData = typeof tag === 'object' && tag !== null ? tag : null
              if (!tagData) return null

              return <TagBadge key={tagData.id} tag={tagData} />
            })}
          </div>
        )}

        <Button variant="ghost" size="sm" className="gap-2">
          <Share2 className="h-4 w-4" />
          Share
        </Button>
      </div>
    </header>
  )
}
