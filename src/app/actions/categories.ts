'use server'

import type { Category } from '@/payload-types'
import { getPayloadClient } from '@/lib/payload'

export const getCategories = async (): Promise<Category[]> => {
  try {
    const payload = await getPayloadClient()

    const result = await payload.find({
      collection: 'categories',
      sort: 'priority',
      limit: 100,
      depth: 0,
    })

    return result.docs as unknown as Category[]
  } catch (error) {
    console.error('Failed to fetch categories:', error)
    return []
  }
}

export const getCategoryBySlug = async (slug: string): Promise<Category | null> => {
  try {
    const payload = await getPayloadClient()

    const result = await payload.find({
      collection: 'categories',
      where: {
        slug: { equals: slug },
      },
      depth: 1,
    })

    return (result.docs[0] as unknown as Category) || null
  } catch (error) {
    console.error('Failed to fetch category by slug:', error)
    return null
  }
}

export const getFeaturedCategories = async (): Promise<Category[]> => {
  try {
    const payload = await getPayloadClient()

    const result = await payload.find({
      collection: 'categories',
      where: {
        featured: { equals: true },
      },
      sort: 'priority',
      limit: 10,
      depth: 0,
    })

    return result.docs as unknown as Category[]
  } catch (error) {
    console.error('Failed to fetch featured categories:', error)
    return []
  }
}
