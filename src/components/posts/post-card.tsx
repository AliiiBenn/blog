import type { Post } from '@/payload-types'

interface PostCardProps {
  post: Post
}

export function PostCard({ post: _post }: PostCardProps) {
  return <div>Post Card</div>
}
