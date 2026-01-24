import type { CollectionConfig } from 'payload'
import { slugField } from 'payload'

export const Categories: CollectionConfig = {
  slug: 'categories',
  admin: {
    useAsTitle: 'name',
    defaultColumns: ['name', 'priority', 'featured'],
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
        description: 'Category description for SEO and display',
      },
    },
    {
      name: 'icon',
      type: 'upload',
      relationTo: 'media',
      filterOptions: {
        mimeType: { equals: 'image/*' },
      },
      admin: {
        description: 'Small icon for the category',
      },
    },
    {
      name: 'image',
      type: 'upload',
      relationTo: 'media',
      filterOptions: {
        mimeType: { equals: 'image/*' },
      },
      admin: {
        description: 'Banner image for the category page',
      },
    },
    {
      name: 'metaTitle',
      type: 'text',
      admin: {
        description: 'Leave empty to use the category name',
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
      name: 'priority',
      type: 'number',
      defaultValue: 0,
      admin: {
        description: 'Higher values appear first in lists',
      },
    },
    {
      name: 'color',
      type: 'text',
      admin: {
        description: 'Hex color code for frontend styling (e.g., #3b82f6)',
      },
    },
    {
      name: 'featured',
      type: 'checkbox',
      defaultValue: false,
      admin: {
        description: 'Show on homepage',
      },
    },
  ],
  timestamps: true,
}
