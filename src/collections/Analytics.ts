import type { CollectionConfig } from 'payload'

export const Analytics: CollectionConfig = {
  slug: 'analytics',
  admin: {
    useAsTitle: 'path',
    defaultColumns: ['path', 'pageViews', 'lastViewed'],
    description: 'Website analytics tracking',
  },
  access: {
    read: () => true,
    create: () => false, // Disable manual creation
    update: () => false, // Disable manual updates
    delete: ({ req }) => !!req.user, // Only allow admins to delete
  },
  fields: [
    {
      name: 'path',
      type: 'text',
      required: true,
      unique: true,
      index: true,
      admin: {
        description: 'URL path (e.g., /blog/my-post)',
      },
    },
    {
      name: 'pageViews',
      type: 'number',
      required: true,
      defaultValue: 0,
      admin: {
        description: 'Total page views',
      },
    },
    {
      name: 'lastViewed',
      type: 'date',
      required: true,
      admin: {
        description: 'Last page view timestamp',
      },
    },
    {
      name: 'referrer',
      type: 'text',
      admin: {
        description: 'Traffic source (referrer)',
      },
    },
    {
      name: 'userAgent',
      type: 'text',
      admin: {
        description: 'Browser user agent',
      },
    },
    {
      name: 'device',
      type: 'group',
      fields: [
        {
          name: 'type',
          type: 'text',
          admin: {
            description: 'Device type (mobile/desktop/tablet)',
          },
        },
        {
          name: 'browser',
          type: 'text',
          admin: {
            description: 'Browser name',
          },
        },
        {
          name: 'os',
          type: 'text',
          admin: {
            description: 'Operating system',
          },
        },
      ],
    },
  ],
  timestamps: true,
}
