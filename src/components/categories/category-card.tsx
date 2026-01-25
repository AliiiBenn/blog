import Image from 'next/image'
import Link from 'next/link'
import type { Category } from '@/payload-types'
import { FolderOpen, ChevronRight } from 'lucide-react'
import { Badge } from '@/components/ui/badge'

interface CategoryCardProps {
  category: Category
  postCount?: number
}

export const CategoryCard = ({ category, postCount = 0 }: CategoryCardProps) => {
  const { name, slug, description, icon } = category
  const iconData = typeof icon === 'object' && icon !== null ? icon : null
  const iconUrl = iconData?.url || null
  const iconAlt = iconData?.alt || name

  return (
    <Link
      href={`/category/${slug}`}
      className="group flex flex-col overflow-hidden border-r border-b border-border bg-background transition-all hover:border-muted-foreground/40"
    >
      {/* Terminal-style header */}
      <div className="border-b border-border bg-muted/20 px-3 py-2 font-mono text-xs text-muted-foreground">
        <div className="flex items-center gap-2">
          <FolderOpen className="h-3 w-3" />
          <span>category_{slug.slice(0, 10)}...</span>
        </div>
      </div>

      {/* Content */}
      <div className="flex flex-1 flex-col p-4">
        {/* Icon */}
        {iconUrl ? (
          <div className="relative mx-auto mb-4 size-16 overflow-hidden rounded-full border-2 border-border bg-background">
            <Image
              src={iconUrl}
              alt={iconAlt}
              fill
              className="object-cover"
              sizes="64px"
            />
          </div>
        ) : (
          <div className="mx-auto mb-4 flex size-16 items-center justify-center rounded-full border-2 border-border bg-muted/30 text-foreground font-mono text-lg font-bold">
            {name.charAt(0)}
          </div>
        )}

        {/* Name */}
        <h3 className="mb-2 text-center font-mono text-lg font-semibold group-hover:text-foreground transition-colors text-foreground">
          {'>'} {name}
        </h3>

        {/* Description */}
        {description && (
          <p className="mb-4 flex-1 text-center font-mono text-sm text-muted-foreground line-clamp-2">
            {/* {description} */}
          </p>
        )}

        {/* Post count badge */}
        <div className="flex justify-center">
          <Badge variant="outline" className="font-mono text-xs border-border">
            {postCount} {postCount === 1 ? 'post' : 'posts'}
          </Badge>
        </div>
      </div>

      {/* Terminal-style footer */}
      <div className="bg-muted/20 px-3 py-2 font-mono text-xs text-muted-foreground">
        <div className="flex items-center justify-between">
          <span>cd {slug}/</span>
          <ChevronRight className="h-3 w-3" />
        </div>
      </div>
    </Link>
  )
}
