# Image Handling

## Overview

Implement image upload, storage, optimization, and display using PayloadCMS, AWS S3, and Next.js Image component.

## S3 Storage Setup

### 1. Install Payload S3 Storage Adapter

```bash
pnpm add @payloadcms/storage-s3 @aws-sdk/client-s3
```

### 2. Configure Payload

Update `payload/init.ts`:

```typescript
import { s3Storage } from '@payloadcms/storage-s3';

export default buildConfig({
  // ... other config
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

### 3. Create Media Collection

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
        crop: 'center',
      },
      {
        name: 'og',
        width: 1200,
        height: 630,
        crop: 'center',
      },
      {
        name: 'thumbnail',
        width: 400,
        height: 300,
        crop: 'center',
      },
    ],
    adminThumbnail: 'thumbnail',
  },
  fields: [
    {
      name: 'alt',
      type: 'text',
      label: 'Alt Text',
      required: true,
      admin: {
        description: 'Important for SEO and accessibility',
      },
    },
    {
      name: 'caption',
      type: 'text',
    },
    {
      name: 'width',
      type: 'number',
      admin: {
        readOnly: true,
      },
    },
    {
      name: 'height',
      type: 'number',
      admin: {
        readOnly: true,
      },
    },
  ],
  admin: {
    hidden: true, // Hide from admin menu
  },
  hooks: {
    beforeChange: [
      ({ data }) => {
        // Store image dimensions
        if (data.filename) {
          // Payload will populate width/height automatically
        }
      },
    ],
  },
};
```

## Image Display Components

### Optimized Image Component

Create `components/ui/optimized-image.tsx`:

```typescript
'use client';

import { useState } from 'react';
import Image from 'next/image';
import { cn } from '@/lib/utils';

interface OptimizedImageProps {
  src: string;
  alt: string;
  width?: number;
  height?: number;
  className?: string;
  priority?: boolean;
  fill?: boolean;
  sizes?: string;
}

export function OptimizedImage({
  src,
  alt,
  width,
  height,
  className,
  priority = false,
  fill = false,
  sizes = '(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw',
}: OptimizedImageProps) {
  const [isLoading, setIsLoading] = useState(true);

  return (
    <div className={cn('relative overflow-hidden', className)}>
      {isLoading && (
        <div className="absolute inset-0 bg-muted animate-pulse" />
      )}
      <Image
        src={src}
        alt={alt}
        width={fill ? undefined : width}
        height={fill ? undefined : height}
        fill={fill}
        sizes={sizes}
        priority={priority}
        className={cn(
          'transition-opacity duration-300',
          isLoading ? 'opacity-0' : 'opacity-100'
        )}
        onLoad={() => setIsLoading(false)}
        onError={() => setIsLoading(false)}
      />
    </div>
  );
}
```

### Cover Image Component

Create `components/blog/cover-image.tsx`:

```typescript
import { OptimizedImage } from '@/components/ui/optimized-image';

interface CoverImageProps {
  image?: {
    url: string;
    alt?: string;
    sizes?: {
      card?: {
        url: string;
        width: number;
        height: number;
      };
      og?: {
        url: string;
        width: number;
        height: number;
      };
    };
  };
  priority?: boolean;
  className?: string;
}

export function CoverImage({ image, priority = false, className }: CoverImageProps) {
  if (!image) return null;

  // Use optimized size if available
  const imageUrl = image.sizes?.card?.url || image.url;
  const imageWidth = image.sizes?.card?.width;
  const imageHeight = image.sizes?.card?.height;

  return (
    <div className={cn('aspect-video w-full overflow-hidden', className)}>
      <OptimizedImage
        src={imageUrl}
        alt={image.alt || ''}
        width={imageWidth}
        height={imageHeight}
        priority={priority}
        fill
        sizes="(max-width: 768px) 100vw, 896px"
        className="object-cover"
      />
    </div>
  );
}
```

## Image Optimization Configuration

### Next.js Config

Update `next.config.ts`:

```typescript
import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  images: {
    formats: ['image/avif', 'image/webp'],
    deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048, 3840],
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
    domains: [],
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '**.s3.amazonaws.com',
      },
      {
        protocol: 'https',
        hostname: '**.s3.**.amazonaws.com',
      },
    ],
    minimumCacheTTL: 60 * 60 * 24 * 7, // 7 days
  },
};

export default nextConfig;
```

## Blur Placeholder Generation

### Custom Blur Generation

Create `lib/image-blur.ts`:

```typescript
import Image from 'next/image';

export async function getBlurPlaceholder(src: string): Promise<string> {
  try {
    const response = await fetch(src);
    const arrayBuffer = await response.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    // For Next.js 14+, use the built-in blur function
    const { base64 } = await Image.getBlurDataURL(buffer);

    return base64;
  } catch (error) {
    console.error('Error generating blur placeholder:', error);
    return '';
  }
}
```

### Usage in Component

```typescript
'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';

export function BlurImage({ src, alt }: { src: string; alt: string }) {
  const [blurDataURL, setBlurDataURL] = useState<string>();

  useEffect(() => {
    getBlurPlaceholder(src).then(setBlurDataURL);
  }, [src]);

  return (
    <Image
      src={src}
      alt={alt}
      placeholder={blurDataURL ? 'blur' : 'empty'}
      blurDataURL={blurDataURL}
      width={800}
      height={450}
    />
  );
}
```

## Image Gallery Component (Optional)

Create `components/blog/image-gallery.tsx`:

```typescript
'use client';

import { useState } from 'react';
import Image from 'next/image';
import { X } from 'lucide-react';
import { Dialog, DialogContent } from '@/components/ui/dialog';

interface ImageGalleryProps {
  images: Array<{
    url: string;
    alt: string;
  }>;
}

export function ImageGallery({ images }: ImageGalleryProps) {
  const [selectedImage, setSelectedImage] = useState<number | null>(null);

  return (
    <>
      <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
        {images.map((image, index) => (
          <button
            key={index}
            onClick={() => setSelectedImage(index)}
            className="relative aspect-video overflow-hidden rounded-lg border border-border hover:border-primary transition-colors"
          >
            <Image
              src={image.url}
              alt={image.alt}
              fill
              className="object-cover"
              sizes="(max-width: 768px) 50vw, 33vw"
            />
          </button>
        ))}
      </div>

      {selectedImage !== null && (
        <Dialog open={selectedImage !== null} onOpenChange={() => setSelectedImage(null)}>
          <DialogContent className="max-w-4xl">
            <button
              onClick={() => setSelectedImage(null)}
              className="absolute top-4 right-4 z-10 rounded-full bg-background p-2"
            >
              <X className="h-4 w-4" />
            </button>
            <div className="relative aspect-video w-full">
              <Image
                src={images[selectedImage].url}
                alt={images[selectedImage].alt}
                fill
                className="object-contain"
                priority
              />
            </div>
          </DialogContent>
        </Dialog>
      )}
    </>
  );
}
```

## Image SEO

### Alt Text Validation

Ensure all images have alt text:

```typescript
// In Payload hooks
{
  name: 'alt',
  type: 'text',
  required: true,
  admin: {
    description: 'Describe the image for accessibility and SEO',
  },
}
```

### Open Graph Images

Use appropriate size for OG images:

```typescript
const ogImage = post.coverImage?.sizes?.og?.url || post.coverImage?.url;
```

## Next Steps

- [ ] Implement styling and theme
- [ ] Implement performance optimization
- [ ] Add image CDN configuration
