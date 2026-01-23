# Database Collections

## Overview

Define PayloadCMS collections for Users, Posts, Categories, Tags, and Media.

## Users Collection

Create `payload/collections/Users.ts`:

```typescript
import { CollectionConfig } from 'payload';

export const Users: CollectionConfig = {
  slug: 'users',
  auth: true,
  admin: {
    useAsTitle: 'email',
  },
  fields: [
    {
      name: 'name',
      type: 'text',
      required: true,
    },
    {
      name: 'role',
      type: 'select',
      options: [
        { label: 'Admin', value: 'admin' },
      ],
      defaultValue: 'admin',
      required: true,
    },
  ],
};
```

## Categories Collection

Create `payload/collections/Categories.ts`:

```typescript
import { CollectionConfig } from 'payload';

export const Categories: CollectionConfig = {
  slug: 'categories',
  admin: {
    useAsTitle: 'name',
  },
  fields: [
    {
      name: 'name',
      type: 'text',
      required: true,
    },
    {
      name: 'slug',
      type: 'text',
      unique: true,
      admin: {
        position: 'sidebar',
      },
    },
    {
      name: 'description',
      type: 'textarea',
    },
    {
      name: 'icon',
      type: 'text',
      admin: {
        description: 'Emoji or icon name (e.g., 💻, "Code")',
      },
    },
  ],
};
```

## Tags Collection

Create `payload/collections/Tags.ts`:

```typescript
import { CollectionConfig } from 'payload';

export const Tags: CollectionConfig = {
  slug: 'tags',
  admin: {
    useAsTitle: 'name',
  },
  fields: [
    {
      name: 'name',
      type: 'text',
      required: true,
    },
    {
      name: 'slug',
      type: 'text',
      unique: true,
      admin: {
        position: 'sidebar',
      },
    },
    {
      name: 'color',
      type: 'text',
      admin: {
        description: 'Hex color code (e.g., #0070f3)',
      },
    },
  ],
};
```

## Posts Collection

Create `payload/collections/Posts.ts`:

```typescript
import { CollectionConfig } from 'payload';

export const Posts: CollectionConfig = {
  slug: 'posts',
  admin: {
    useAsTitle: 'title',
    defaultColumns: ['title', 'category', 'status', 'publishedAt'],
  },
  versions: {
    drafts: true,
  },
  fields: [
    {
      name: 'title',
      type: 'text',
      required: true,
    },
    {
      name: 'slug',
      type: 'text',
      unique: true,
      admin: {
        position: 'sidebar',
      },
    },
    {
      name: 'excerpt',
      type: 'textarea',
      admin: {
        description: 'Short description for previews',
      },
    },
    {
      name: 'content',
      type: 'richText',
      required: true,
    },
    {
      name: 'coverImage',
      type: 'upload',
      relationTo: 'media',
    },
    {
      name: 'category',
      type: 'relationship',
      relationTo: 'categories',
      required: true,
    },
    {
      name: 'tags',
      type: 'relationship',
      relationTo: 'tags',
      hasMany: true,
    },
    {
      name: 'publishedAt',
      type: 'date',
      admin: {
        position: 'sidebar',
      },
    },
    {
      name: 'status',
      type: 'select',
      options: [
        { label: 'Draft', value: 'draft' },
        { label: 'Published', value: 'published' },
      ],
      defaultValue: 'draft',
      admin: {
        position: 'sidebar',
      },
    },
    {
      name: 'relatedPosts',
      type: 'relationship',
      relationTo: 'posts',
      hasMany: true,
      filterOptions: {
        id: {
          notEquals: ['{id}'],
        },
      },
    },
  ],
};
```

## Media Collection

Create `payload/collections/Media.ts`:

```typescript
import { CollectionConfig } from 'payload';

export const Media: CollectionConfig = {
  slug: 'media',
  upload: {
    staticURL: '/api/media/file',
    staticDir: 'media',
    imageSizes: [
      {
        name: 'card',
        width: 640,
        height: 360,
      },
      {
        name: 'og',
        width: 1200,
        height: 630,
      },
    ],
  },
  fields: [
    {
      name: 'alt',
      type: 'text',
      label: 'Alt Text',
    },
  ],
  admin: {
    hidden: true, // Hide from admin menu (access via relationship fields)
  },
};
```

## Register Collections

Update `payload/init.ts`:

```typescript
import { Posts } from './collections/Posts';
import { Categories } from './collections/Categories';
import { Tags } from './collections/Tags';
import { Users } from './collections/Users';
import { Media } from './collections/Media';

// In buildConfig:
collections: [
  Users,
  Posts,
  Categories,
  Tags,
  Media,
],
```

## Auto-generated Tables

When you run the app, Payload will automatically create these tables in PostgreSQL:

- `users` - Admin users
- `posts` - Blog posts
- `categories` - Post categories
- `tags` - Post tags
- `media` - Uploaded files
- `posts_tags` - Junction table for posts-tags relationship

## Next Steps

- [ ] Seed initial admin user
- [ ] Create seed data for categories and tags
- [ ] Test admin panel access
