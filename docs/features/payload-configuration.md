# PayloadCMS Configuration

## Overview

Configure PayloadCMS with PostgreSQL, AWS S3 storage, and authentication.

## Payload Initialization File

Create `payload/init.ts`:

```typescript
import { buildConfig } from 'payload';
import { postgresAdapter } from '@payloadcms/db-postgres';
import { s3Storage } from '@payloadcms/storage-s3';
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
    user: 'Admins',
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
    s3Storage({
      collections: {
        media: true,
      },
      bucket: process.env.S3_BUCKET_NAME,
      region: process.env.S3_REGION,
      credentials: {
        accessKeyId: process.env.S3_ACCESS_KEY_ID,
        secretAccessKey: process.env.S3_SECRET_ACCESS_KEY,
      },
      endpoint: process.env.S3_ENDPOINT, // Optional: for S3-compatible services
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

# AWS S3
S3_BUCKET_NAME="your-bucket-name"
S3_REGION="us-east-1"
S3_ACCESS_KEY_ID="your-access-key"
S3_SECRET_ACCESS_KEY="your-secret-key"
S3_ENDPOINT=""  # Optional: for S3-compatible services like DigitalOcean Spaces

# Admin credentials (for initial seed)
PAYLOAD_ADMIN_EMAIL="admin@example.com"
PAYLOAD_ADMIN_PASSWORD="changeme"
```

### Production

Set these in Vercel dashboard:
- `DATABASE_URL` - Vercel Postgres connection string
- `PAYLOAD_SECRET` - Random string for encryption
- `NEXT_PUBLIC_PAYLOAD_URL` - Your production URL
- `S3_BUCKET_NAME` - Your S3 bucket name
- `S3_REGION` - AWS region (e.g., us-east-1)
- `S3_ACCESS_KEY_ID` - AWS access key ID
- `S3_SECRET_ACCESS_KEY` - AWS secret access key
- `S3_ENDPOINT` - Optional: for S3-compatible services

## Admin Access

The admin panel will be available at `/admin` after configuration is complete.

## Next Steps

- [ ] Create Admins collection
- [ ] Create Posts collection
- [ ] Create Categories collection
- [ ] Create Tags collection
- [ ] Create Media collection
- [ ] Setup S3 bucket and credentials
