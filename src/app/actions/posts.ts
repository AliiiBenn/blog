'use server'

import type { Post } from '@/payload-types'
import type { Where } from 'payload'
import { getPayloadClient } from '@/lib/payload'

interface GetPostsOptions {
  category?: string
  tag?: string
  limit?: number
  page?: number
}

export const getPosts = async (options: GetPostsOptions = {}): Promise<Post[]> => {
  try {
    const payload = await getPayloadClient()
    const { category, tag, limit = 10, page = 1 } = options

    const and: Where[] = [
      { status: { equals: 'published' } },
    ]

    if (category) {
      and.push({
        category: {
          slug: {
            equals: category,
          },
        },
      } as Where)
    }

    if (tag) {
      and.push({
        tags: {
          slug: {
            in: [tag],
          },
        },
      } as Where)
    }

    const result = await payload.find({
      collection: 'posts',
      where: {
        and,
      },
      sort: '-publishedDate',
      limit,
      page,
      depth: 1,
    })

    return result.docs as unknown as Post[]
  } catch (error) {
    console.error('Failed to fetch posts:', error)
    return []
  }
}

export const getPostBySlug = async (slug: string): Promise<Post | null> => {
  try {
    const payload = await getPayloadClient()

    const result = await payload.find({
      collection: 'posts',
      where: {
        and: [
          { slug: { equals: slug } },
          { status: { equals: 'published' } },
        ],
      },
      depth: 1,
    })

    return (result.docs[0] as unknown as Post) || null
  } catch (error) {
    console.error('Failed to fetch post by slug:', error)
    return null
  }
}

export const getRecentPosts = async (limit: number = 5): Promise<Post[]> => {
  try {
    const payload = await getPayloadClient()

    const result = await payload.find({
      collection: 'posts',
      where: {
        status: { equals: 'published' },
      },
      sort: '-publishedDate',
      limit,
      depth: 1,
    })

    return result.docs as unknown as Post[]
  } catch (error) {
    console.error('Failed to fetch recent posts:', error)
    return []
  }
}

export const getRelatedPosts = async (
  postId: string,
  categorySlug: string,
  limit: number = 3,
): Promise<Post[]> => {
  try {
    const payload = await getPayloadClient()

    const result = await payload.find({
      collection: 'posts',
      where: {
        and: [
          { id: { not_equals: postId } },
          { status: { equals: 'published' } },
          { category: { slug: { equals: categorySlug } } } as Where,
        ],
      },
      sort: '-publishedDate',
      limit,
      depth: 1,
    })

    return result.docs as unknown as Post[]
  } catch (error) {
    console.error('Failed to fetch related posts:', error)
    return []
  }
}
