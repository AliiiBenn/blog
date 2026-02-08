import type { Post } from '@/payload-types'
import { PostCard } from './post-card'
import { FileX } from 'lucide-react'

interface PostGridProps {
  posts: Post[]
}

export const PostGrid = ({ posts: _posts }: PostGridProps) => {
  if (_posts.length === 0) {
    return (
      <div className="col-span-full">
        <div className="p-12 text-center">
          <div className="mb-6 flex items-center justify-center gap-3 text-muted-foreground">
            <FileX className="h-16 w-16" />
          </div>
          <div className="mb-2 font-mono text-xl">
            <span className="text-muted-foreground">{'>'}</span>
            <span className="ml-2">cat empty_directory.log</span>
          </div>
          <div className="mb-4 font-mono text-sm text-muted-foreground">
            Output: No posts found
          </div>
          <div className="font-mono text-xs text-muted-foreground">
            [errno 2] No such file or directory
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-0 divide-y sm:divide-y-0 divide-border">
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
