import Image from 'next/image'
import Link from 'next/link'
import type { Post } from '@/payload-types'
import { format } from 'date-fns'
import { Badge } from '@/components/ui/badge'
import { Avatar, AvatarImage } from '@/components/ui/avatar'

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
    <Link href={`/blog/${slug}`} className="group flex flex-col overflow-hidden sm:border-x border-b border-border bg-background transition-all">
      {/* Image */}
      {imageUrl && (
        <div className="relative aspect-video overflow-hidden bg-muted">
          <Image
            src={imageUrl}
            alt={imageAlt}
            fill
            className="object-cover transition-transform duration-300 group-hover:scale-105"
            priority={priority}
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
          />
        </div>
      )}

      {/* Content */}
      <div className="flex flex-1 flex-col p-8">
        {/* Metadata row */}
        <div className="mb-3 flex items-center justify-between text-xs">
          {categoryData && (
            <span className="text-muted-foreground group-hover:text-foreground transition-colors">
              {categoryData.name}
            </span>
          )}
          {publishedDate && (
            <span className="text-muted-foreground group-hover:text-foreground transition-colors">
              {format(new Date(publishedDate), 'MMM d, yyyy')}
            </span>
          )}
        </div>

        {/* Title */}
        <div className="mb-4">
          <h3 className="text-lg sm:text-xl font-semibold line-clamp-2 group-hover:text-foreground transition-colors text-foreground">
            <span className="break-words">{title}</span>
          </h3>
        </div>

        {/* Description */}
        <p className="mb-3 text-sm text-muted-foreground group-hover:text-foreground transition-colors line-clamp-3">
          Discover the latest insights and best practices in modern web development. Learn how to build scalable applications with cutting-edge technologies and master essential techniques used by professional developers worldwide.
        </p>

        {/* Excerpt */}
        {excerpt && (
          <p className="mb-4 flex-1 text-xs sm:text-sm text-muted-foreground group-hover:text-foreground transition-colors line-clamp-3">
            {excerpt}
          </p>
        )}

        {/* Footer - Tags */}
        {tagsData.length > 0 && (
          <div className="mt-auto flex gap-1 flex-wrap">
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

        {/* Author Footer */}
        <div className="mt-4 flex items-center gap-2">
          <Avatar size="sm">
            <AvatarImage src="/me.png" alt="David Pereira" />
          </Avatar>
          <span className="text-[13px] text-muted-foreground group-hover:text-foreground transition-colors">David Pereira</span>
        </div>
      </div>
    </Link>
  )
}
