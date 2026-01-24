import type { Tag } from '@/payload-types'

interface TagCloudProps {
  tags: Tag[]
}

export function TagCloud({ tags: _tags }: TagCloudProps) {
  return <div>Tag Cloud</div>
}
