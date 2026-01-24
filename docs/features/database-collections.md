# Database Collections

## Overview

Define PayloadCMS collections for Admins, Posts, Categories, Tags, and Media.

## Admins Collection

Create `payload/collections/Admins.ts`:

```typescript
import { CollectionConfig } from 'payload';

export const Admins: CollectionConfig = {
  slug: 'admins',
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
  ],
  access: {
    read: () => true,
    create: () => true,
    update: () => true,
    delete: () => true,
  },
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
import { Admins } from './collections/Admins';
import { Media } from './collections/Media';

// In buildConfig:
collections: [
  Admins,
  Posts,
  Categories,
  Tags,
  Media,
],
```

## Auto-generated Tables

When you run the app, Payload will automatically create these tables in PostgreSQL:

- `admins` - Admin users
- `posts` - Blog posts
- `categories` - Post categories
- `tags` - Post tags
- `media` - Uploaded files metadata
- `posts_tags` - Junction table for posts-tags relationship

## S3 Storage Setup

### Create an S3 Bucket

1. Go to AWS Console → S3
2. Create a new bucket with a unique name
3. Configure CORS policy for Next.js:
```json
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Sid": "AllowUploads",
      "Effect": "Allow",
      "Principal": "*",
      "Action": ["s3:PutObject", "s3:GetObject"],
      "Resource": "arn:aws:s3:::your-bucket-name/*"
    }
  ]
}
```

4. Create IAM user with programmatic access (S3 read/write permissions)
5. Store credentials in environment variables

### Alternative: S3-Compatible Services

You can use S3-compatible services instead of AWS S3:
- **DigitalOcean Spaces** - Cheaper, simpler
- **Cloudflare R2** - Zero egress fees
- **MinIO** - Self-hosted option
- **Wasabi** - Flat pricing

Just set `S3_ENDPOINT` to your provider's endpoint URL.

## Next Steps

- [ ] Seed initial admin user
- [ ] Create seed data for categories and tags
- [ ] Setup S3 bucket and IAM credentials
- [ ] Test media upload functionality
- [ ] Test admin panel access
