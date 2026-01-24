import Image from 'next/image'
import Link from 'next/link'
import type { Post } from '@/payload-types'
import { format } from 'date-fns'
import { Calendar, Clock } from 'lucide-react'

interface PostCardProps {
  post: Post
  priority?: boolean
}

export const PostCard = ({ post, priority = false }: PostCardProps) => {
  const {
    title,
    slug,
    excerpt,
    publishedDate,
    readingTime,
    category,
    tags,
    featuredImage,
  } = post

  const categoryData = typeof category === 'object' && category !== null ? category : null
  const tagsData = Array.isArray(tags) ? tags.slice(0, 3) : []
  const imageData = typeof featuredImage === 'object' && featuredImage !== null ? featuredImage : null
  const imageUrl = imageData?.url || null
  const imageAlt = imageData?.alt || title

  return (
    <Link
      href={`/blog/${slug}`}
      className="group flex flex-col overflow-hidden rounded-lg border bg-card transition-all hover:shadow-lg"
    >
      <div className="relative aspect-video overflow-hidden bg-muted">
        {imageUrl ? (
          <Image
            src={imageUrl}
            alt={imageAlt}
            fill
            className="object-cover transition-transform duration-300 group-hover:scale-105"
            priority={priority}
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          />
        ) : (
          <div className="flex h-full items-center justify-center text-muted-foreground">
            No image
          </div>
        )}
      </div>

      <div className="flex flex-1 flex-col p-4">
        <div className="mb-3 flex items-center gap-2">
          {categoryData && (
            <Link
              href={`/category/${categoryData.slug}`}
              className="inline-flex items-center rounded-full bg-primary/10 px-3 py-1 text-xs font-medium text-primary transition-colors hover:bg-primary/20"
              onClick={(e) => e.stopPropagation()}
            >
              {categoryData.name}
            </Link>
          )}
          <div className="flex items-center gap-3 text-xs text-muted-foreground">
            <span className="flex items-center gap-1">
              <Clock className="h-3 w-3" />
              {readingTime} min read
            </span>
          </div>
        </div>

        <h3 className="mb-2 text-xl font-semibold line-clamp-2 group-hover:text-primary transition-colors">
          {title}
        </h3>

        {excerpt && (
          <p className="mb-4 flex-1 text-sm text-muted-foreground line-clamp-3">
            {excerpt}
          </p>
        )}

        <div className="mt-auto flex items-center justify-between">
          <div className="flex items-center gap-2 text-xs text-muted-foreground">
            {publishedDate && (
              <span className="flex items-center gap-1">
                <Calendar className="h-3 w-3" />
                {format(new Date(publishedDate), 'MMM d, yyyy')}
              </span>
            )}
          </div>

          {tagsData.length > 0 && (
            <div className="flex gap-1">
              {tagsData.map((tag) => {
                const tagData = typeof tag === 'object' && tag !== null ? tag : null
                if (!tagData) return null

                return (
                  <span
                    key={tagData.id}
                    className="inline-flex items-center rounded-full bg-secondary px-2 py-0.5 text-xs text-secondary-foreground"
                  >
                    {tagData.name}
                  </span>
                )
              })}
            </div>
          )}
        </div>
      </div>
    </Link>
  )
}
