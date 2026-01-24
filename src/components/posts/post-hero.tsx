import type { Post } from '@/payload-types'

interface PostHeroProps {
  post: Post
}

export function PostHero({ post: _post }: PostHeroProps) {
  return <div>Post Hero</div>
}
