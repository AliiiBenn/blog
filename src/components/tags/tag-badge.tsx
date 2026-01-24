import type { Tag } from '@/payload-types'

interface TagBadgeProps {
  tag: Tag
}

export function TagBadge({ tag: _tag }: TagBadgeProps) {
  return <div>Tag Badge</div>
}
