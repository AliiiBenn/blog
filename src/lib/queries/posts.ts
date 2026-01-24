import type { Post } from '@/payload-types'
import { getPosts, getPostBySlug } from '@/app/actions/posts'

// Query keys for TanStack Query
export const postKeys = {
  all: ['posts'] as const,
  lists: () => [...postKeys.all, 'list'] as const,
  list: (filters: string) => [...postKeys.lists(), { filters }] as const,
  details: () => [...postKeys.all, 'detail'] as const,
  detail: (slug: string) => [...postKeys.details(), slug] as const,
}

// Fetch functions using Server Actions
export const fetchPosts = async (options?: {
  category?: string
  tag?: string
  limit?: number
  page?: number
}): Promise<Post[]> => {
  return await getPosts(options)
}

export const fetchPostBySlug = async (slug: string): Promise<Post | null> => {
  return await getPostBySlug(slug)
}
