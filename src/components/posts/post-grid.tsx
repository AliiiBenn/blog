import type { Post } from '@/payload-types'

interface PostGridProps {
  posts: Post[]
}

export function PostGrid({ posts: _posts }: PostGridProps) {
  return <div>Post Grid</div>
}
