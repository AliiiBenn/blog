'use server'

import type { Post, Tag } from '@/payload-types'
import { getPayloadClient } from '@/lib/payload'

export const getTags = async (): Promise<Tag[]> => {
  try {
    const payload = await getPayloadClient()

    const result = await payload.find({
      collection: 'tags',
      sort: 'name',
      limit: 100,
      depth: 0,
    })

    return result.docs as unknown as Tag[]
  } catch (error) {
    console.error('Failed to fetch tags:', error)
    return []
  }
}

export const getTagBySlug = async (slug: string): Promise<Tag | null> => {
  try {
    const payload = await getPayloadClient()

    const result = await payload.find({
      collection: 'tags',
      where: {
        slug: { equals: slug },
      },
      depth: 1,
    })

    return (result.docs[0] as unknown as Tag) || null
  } catch (error) {
    console.error('Failed to fetch tag by slug:', error)
    return null
  }
}

export const getPopularTags = async (limit: number = 10): Promise<Tag[]> => {
  try {
    const payload = await getPayloadClient()

    // Fetch all published posts to count tag usage
    const postsResult = await payload.find({
      collection: 'posts',
      where: {
        status: { equals: 'published' },
      },
      limit: 1000,
      depth: 0,
    })

    const posts = postsResult.docs as unknown as Post[]

    // Count tag occurrences
    const tagCounts = new Map<string, number>()
    posts.forEach((post) => {
      if (post.tags && Array.isArray(post.tags)) {
        post.tags.forEach((tag) => {
          if (typeof tag === 'object' && tag !== null && 'id' in tag) {
            const tagId = String(tag.id)
            tagCounts.set(tagId, (tagCounts.get(tagId) || 0) + 1)
          }
        })
      }
    })

    // Fetch all tags and sort by count
    const tagsResult = await payload.find({
      collection: 'tags',
      limit: 100,
      depth: 0,
    })

    const tags = tagsResult.docs as unknown as Tag[]

    return tags
      .sort((a, b) => {
        const countA = tagCounts.get(String(a.id)) || 0
        const countB = tagCounts.get(String(b.id)) || 0
        return countB - countA
      })
      .slice(0, limit)
  } catch (error) {
    console.error('Failed to fetch popular tags:', error)
    return []
  }
}
