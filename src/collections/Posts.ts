import type { CollectionConfig } from 'payload'
import { slugField } from 'payload'

export const Posts: CollectionConfig = {
  slug: 'posts',
  admin: {
    useAsTitle: 'title',
    defaultColumns: ['title', 'category', 'status', 'publishedDate', 'author'],
  },
  access: {
    read: () => true,
    create: ({ req }) => !!req.user,
    update: ({ req }) => !!req.user,
    delete: ({ req }) => !!req.user,
  },
  fields: [
    {
      name: 'title',
      type: 'text',
      required: true,
    },
    slugField({
      fieldToUse: 'title',
    }),
    {
      name: 'excerpt',
      type: 'textarea',
      admin: {
        description: 'Short summary for post cards',
      },
    },
    {
      name: 'content',
      type: 'richText',
      required: true,
    },
    {
      name: 'category',
      type: 'relationship',
      relationTo: 'categories',
      required: true,
      admin: {
        description: 'Select a category for this post',
      },
    },
    {
      name: 'tags',
      type: 'relationship',
      relationTo: 'tags',
      hasMany: true,
      admin: {
        description: 'Select tags for this post',
      },
    },
    {
      name: 'featuredImage',
      type: 'upload',
      relationTo: 'media',
      required: false,
      filterOptions: {
        mimeType: { equals: 'image/*' },
      },
      admin: {
        description: 'Main image for post cards and listings',
      },
    },
    {
      name: 'coverImage',
      type: 'upload',
      relationTo: 'media',
      filterOptions: {
        mimeType: { equals: 'image/*' },
      },
      admin: {
        description: 'Optional hero image for the post page',
      },
    },
    {
      name: 'status',
      type: 'select',
      options: [
        {
          label: 'Draft',
          value: 'draft',
        },
        {
          label: 'Published',
          value: 'published',
        },
      ],
      defaultValue: 'draft',
      admin: {
        description: 'Posts must be published to appear on the site',
      },
    },
    {
      name: 'publishedDate',
      type: 'date',
      admin: {
        description: 'Date when the post was published',
      },
    },
    {
      name: 'metaTitle',
      type: 'text',
      admin: {
        description: 'Leave empty to use the post title',
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
      name: 'author',
      type: 'relationship',
      relationTo: 'admins',
      required: true,
      defaultValue: ({ user }) => user?.id,
      admin: {
        description: 'Post author',
      },
    },
    {
      name: 'relatedPosts',
      type: 'relationship',
      relationTo: 'posts',
      hasMany: true,
      admin: {
        description: 'Related posts to show at the bottom of the article',
      },
    },
    {
      name: 'readingTime',
      type: 'number',
      admin: {
        description: 'Reading time in minutes (auto-calculated)',
        readOnly: true,
      },
    },
  ],
  hooks: {
    beforeChange: [
      ({ data }) => {
        // Auto-set publishedDate when status changes to published
        if (data.status === 'published' && !data.publishedDate) {
          data.publishedDate = new Date()
        }

        // Auto-calculate reading time (average 200 words per minute)
        if (data.content && typeof data.content === 'object') {
          const content = data.content as any
          let text = ''

          // Extract text from richText content
          const extractText = (nodes: any[]): void => {
            if (!Array.isArray(nodes)) return

            for (const node of nodes) {
              if (node.type === 'text' && node.text) {
                text += node.text + ' '
              }
              if (node.children) {
                extractText(node.children)
              }
            }
          }

          if (content.root?.children) {
            extractText(content.root.children)
          }

          const wordCount = text.split(/\s+/).filter(Boolean).length
          data.readingTime = Math.ceil(wordCount / 200) || 1
        }
      },
    ],
  },
  timestamps: true,
}
