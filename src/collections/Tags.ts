import type { CollectionConfig } from 'payload'
import { slugField } from 'payload'

export const Tags: CollectionConfig = {
  slug: 'tags',
  admin: {
    useAsTitle: 'name',
    defaultColumns: ['name', 'description'],
  },
  access: {
    read: () => true,
    create: ({ req }) => !!req.user,
    update: ({ req }) => !!req.user,
    delete: ({ req }) => !!req.user,
  },
  fields: [
    {
      name: 'name',
      type: 'text',
      required: true,
      unique: true,
    },
    slugField({
      fieldToUse: 'name',
    }),
    {
      name: 'description',
      type: 'textarea',
      admin: {
        description: 'Tag description for SEO and display',
      },
    },
    {
      name: 'metaTitle',
      type: 'text',
      admin: {
        description: 'Leave empty to use the tag name',
      },
    },
    {
      name: 'metaDescription',
      type: 'textarea',
      admin: {
        description: 'SEO meta description for search engines',
      },
    },
    {
      name: 'postsCount',
      type: 'number',
      virtual: true,
      admin: {
        readOnly: true,
      },
    },
  ],
  timestamps: true,
}
