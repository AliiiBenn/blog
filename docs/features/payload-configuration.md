# PayloadCMS Configuration

## Overview

Configure PayloadCMS with PostgreSQL, Vercel Blob Storage, and authentication.

## Payload Initialization File

Create `payload/init.ts`:

```typescript
import { buildConfig } from 'payload';
import { postgresAdapter } from '@payloadcms/db-postgres';
import { vercelBlobStorage } from '@payloadcms/storage-vercel-blob';
import { slateEditor } from '@payloadcms/richtext-slate';

export default buildConfig({
  editor: slateEditor,
  db: postgresAdapter({
    pool: {
      connectionString: process.env.DATABASE_URL,
    },
  }),
  collections: [
    // Collections will be imported here
  ],
  globals: [
    // Globals will be imported here
  ],
  admin: {
    user: 'Users',
    admin: {
      meta: {
        titleSuffix: '- Blog Admin',
      },
    },
  },
  typescript: {
    outputFile: './payload-types.ts',
  },
  plugins: [
    vercelBlobStorage({
      collections: {
        media: true,
      },
      token: process.env.BLOB_READ_WRITE_TOKEN,
    }),
  ],
});
```

## Payload Client

Create `lib/payload-client.ts`:

```typescript
import { getPayload } from 'payload';
import config from '@/payload/init';

let payloadInstance: any = null;

export async function getPayloadClient() {
  if (!payloadInstance) {
    payloadInstance = await getPayload({
      config,
    });
  }
  return payloadInstance;
}
```

## Next.js Configuration

Update `next.config.ts`:

```typescript
import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  },
};

export default nextConfig;
```

## Environment Variables Setup

### Local Development

Create `.env.local`:

```env
DATABASE_URL="postgresql://user:password@localhost:5432/blog"
PAYLOAD_SECRET="your-secret-key-change-this-in-production"
NEXT_PUBLIC_PAYLOAD_URL="http://localhost:3000"

# For Vercel Postgres (when deployed)
POSTGRES_URL=""
POSTGRES_PRISMA_URL=""
POSTGRES_URL_NON_POOLING=""

# Vercel Blob Storage
BLOB_READ_WRITE_TOKEN=""

# Admin credentials (for initial seed)
PAYLOAD_ADMIN_EMAIL="admin@example.com"
PAYLOAD_ADMIN_PASSWORD="changeme"
```

### Production

Set these in Vercel dashboard:
- `DATABASE_URL` - Vercel Postgres connection string
- `PAYLOAD_SECRET` - Random string for encryption
- `NEXT_PUBLIC_PAYLOAD_URL` - Your production URL
- `BLOB_READ_WRITE_TOKEN` - From Vercel Blob Storage

## Admin Access

The admin panel will be available at `/admin` after configuration is complete.

## Next Steps

- [ ] Create Users collection
- [ ] Create Posts collection
- [ ] Create Categories collection
- [ ] Create Tags collection
- [ ] Create Media collection
