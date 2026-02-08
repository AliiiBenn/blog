import type { Post } from '@/payload-types'
import { PostCard } from './post-card'
import { FileX } from 'lucide-react'

interface PostGridProps {
  posts: Post[]
}

export const PostGrid = ({ posts: _posts }: PostGridProps) => {
  // Calculate position flags for each card (based on desktop layout: 3 columns)
  const cols = 3
  const total = _posts.length

  const getPositionFlags = (index: number) => {
    const isFirstRow = index < cols
    const isLastRow = index >= total - (total % cols || cols)
    const isFirstCol = index % cols === 0
    const isLastCol = (index + 1) % cols === 0 || index === total - 1

    return { isFirstRow, isLastRow, isFirstCol, isLastCol }
  }

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
    <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-0">
      {_posts.map((post, index) => {
        const positionFlags = getPositionFlags(index)
        return (
          <PostCard
            key={post.id}
            post={post}
            priority={index < 6}
            {...positionFlags}
          />
        )
      })}
    </div>
  )
}
