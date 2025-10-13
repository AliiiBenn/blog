import type { CollectionConfig } from 'payload'

export const ArticleTags: CollectionConfig = {
  slug: 'article-tags',
  admin: {
    useAsTitle: 'name',
    group: 'Articles'
  },
  fields: [
    {
      name: 'name',
      type: 'text',
      required: true,
      unique: true,
    },
  ],
}