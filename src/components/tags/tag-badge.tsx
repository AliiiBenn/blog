import Link from 'next/link'
import type { Tag } from '@/payload-types'

interface TagBadgeProps {
  tag: Tag
}

export const TagBadge = ({ tag }: TagBadgeProps) => {
  return (
    <Link
      href={`/tag/${tag.slug}`}
      className="inline-flex items-center rounded-full bg-secondary px-2.5 py-1 text-xs font-medium text-secondary-foreground transition-colors hover:bg-secondary/80"
    >
      #{tag.name}
    </Link>
  )
}
