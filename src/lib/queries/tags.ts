import type { Tag } from '@/payload-types'
import { getTags, getTagBySlug } from '@/app/actions/tags'

// Query keys for TanStack Query
export const tagKeys = {
  all: ['tags'] as const,
  lists: () => [...tagKeys.all, 'list'] as const,
  list: (filters: string) => [...tagKeys.lists(), { filters }] as const,
  details: () => [...tagKeys.all, 'detail'] as const,
  detail: (slug: string) => [...tagKeys.details(), slug] as const,
}

// Fetch functions using Server Actions
export const fetchTags = async (): Promise<Tag[]> => {
  return await getTags()
}

export const fetchTagBySlug = async (slug: string): Promise<Tag | null> => {
  return await getTagBySlug(slug)
}
