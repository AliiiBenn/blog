import type { Post } from '@/payload-types'

interface PostListProps {
  posts: Post[]
}

export function PostList({ posts: _posts }: PostListProps) {
  return <div>Post List</div>
}
