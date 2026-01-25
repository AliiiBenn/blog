import Image from 'next/image'
import Link from 'next/link'
import type { Post } from '@/payload-types'
import { format } from 'date-fns'
import { Calendar, Clock, ChevronRight, FileText } from 'lucide-react'
import { Badge } from '@/components/ui/badge'

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
    <div className="group flex flex-col overflow-hidden border-r border-b border-border bg-background transition-all hover:border-muted-foreground/40">
      {/* Terminal-style header */}
      <div className="border-b border-border bg-muted/20 px-3 py-2 font-mono text-xs text-muted-foreground">
        <div className="flex items-center gap-2">
          <FileText className="h-3 w-3" />
          <span>post_{slug.slice(0, 15)}...</span>
        </div>
      </div>

      {/* Image */}
      {imageUrl && (
        <Link href={`/blog/${slug}`} className="relative aspect-video overflow-hidden bg-muted">
          <Image
            src={imageUrl}
            alt={imageAlt}
            fill
            className="object-cover transition-transform duration-300 group-hover:scale-105"
            priority={priority}
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          />
        </Link>
      )}

      {/* Content */}
      <div className="flex flex-1 flex-col border-b border-border p-4">
        {/* Metadata row */}
        <div className="mb-3 flex items-center gap-2 font-mono text-xs">
          {categoryData && (
            <Link
              href={`/category/${categoryData.slug}`}
              className="inline-flex items-center rounded-sm bg-muted/50 px-2 py-1 text-xs transition-colors hover:bg-muted"
            >
              <ChevronRight className="h-3 w-3" />
              <span className="ml-1">{categoryData.name}</span>
            </Link>
          )}
          <div className="flex items-center gap-3 text-muted-foreground">
            <span className="flex items-center gap-1">
              <Clock className="h-3 w-3" />
              {readingTime}m
            </span>
          </div>
        </div>

        {/* Title */}
        <Link href={`/blog/${slug}`} className="mb-2">
          <h3 className="font-mono text-lg font-semibold line-clamp-2 group-hover:text-foreground transition-colors text-foreground">
            {'>'} {title}
          </h3>
        </Link>

        {/* Excerpt */}
        {excerpt && (
          <p className="mb-4 flex-1 font-mono text-sm text-muted-foreground line-clamp-3">
            {excerpt}
          </p>
        )}

        {/* Footer */}
        <div className="mt-auto flex items-center justify-between">
          <div className="flex items-center gap-2 font-mono text-xs text-muted-foreground">
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
                  <Badge
                    key={tagData.id}
                    variant="outline"
                    className="font-mono text-[10px] border-border"
                  >
                    {tagData.name}
                  </Badge>
                )
              })}
            </div>
          )}
        </div>
      </div>

      {/* Terminal-style footer */}
      <div className="bg-muted/20 px-3 py-2 font-mono text-xs text-muted-foreground">
        <div className="flex items-center justify-between">
          <span>./read_more.sh</span>
          <ChevronRight className="h-3 w-3" />
        </div>
      </div>
    </div>
  )
}
