import type { Post } from '@/payload-types'
import { PostCard } from './post-card'

interface PostGridProps {
  posts: Post[]
}

export const PostGrid = ({ posts: _posts }: PostGridProps) => {
  if (_posts.length === 0) {
    return (
      <div className="flex min-h-[400px] items-center justify-center">
        <p className="text-muted-foreground">No posts found.</p>
      </div>
    )
  }

  return (
    <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
      {_posts.map((post, index) => (
        <PostCard
          key={post.id}
          post={post}
          priority={index < 6}
        />
      ))}
    </div>
  )
}
