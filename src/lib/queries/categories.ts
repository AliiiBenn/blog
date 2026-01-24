import type { Category } from '@/payload-types'
import { getCategories, getCategoryBySlug } from '@/app/actions/categories'

// Query keys for TanStack Query
export const categoryKeys = {
  all: ['categories'] as const,
  lists: () => [...categoryKeys.all, 'list'] as const,
  list: (filters: string) => [...categoryKeys.lists(), { filters }] as const,
  details: () => [...categoryKeys.all, 'detail'] as const,
  detail: (slug: string) => [...categoryKeys.details(), slug] as const,
}

// Fetch functions using Server Actions
export const fetchCategories = async (): Promise<Category[]> => {
  return await getCategories()
}

export const fetchCategoryBySlug = async (slug: string): Promise<Category | null> => {
  return await getCategoryBySlug(slug)
}
