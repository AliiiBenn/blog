# Blog Architecture

## Project Structure

```
blog/
├── app/                          # Next.js App Router
│   ├── (public)/                 # Public route group
│   │   ├── page.tsx              # Homepage (hero + articles)
│   │   ├── about/
│   │   │   └── page.tsx          # Static about page
│   │   ├── blog/
│   │   │   ├── page.tsx          # Blog listing with filters
│   │   │   └── [slug]/
│   │   │       └── page.tsx      # Single blog post
│   │   ├── category/
│   │   │   └── [slug]/
│   │   │       └── page.tsx      # Category page
│   │   ├── tag/
│   │   │   └── [slug]/
│   │   │       └── page.tsx      # Tag page
│   │   └── search/
│   │       └── page.tsx          # Search results page
│   ├── api/
│   │   └── search/
│   │       └── route.ts          # Local search API endpoint
│   ├── globals.css               # Global styles + Tailwind
│   ├── layout.tsx                # Root layout
│   ├── sitemap.ts                # Dynamic sitemap
│   └── rss/
│       └── route.ts              # RSS feed
│
├── components/                   # React components
│   ├── ui/                       # shadcn/ui components
│   ├── blog/                     # Blog-specific components
│   │   ├── article-card.tsx      # Post preview card
│   │   ├── article-header.tsx    # Post header (title, meta)
│   │   ├── article-content.tsx   # Post body renderer
│   │   ├── article-list.tsx      # Posts grid/list
│   │   ├── category-badge.tsx    # Category badge component
│   │   ├── tag-badge.tsx         # Tag badge component
│   │   └── search-bar.tsx        # Search input
│   ├── layout/                   # Layout components
│   │   ├── header.tsx            # Site header
│   │   ├── footer.tsx            # Site footer
│   │   └── theme-provider.tsx    # Dark theme provider
│   └── home/                     # Homepage components
│       ├── hero-section.tsx      # Hero with terminal style
│       └── featured-posts.tsx    # Featured/latest posts
│
├── payload/                      # PayloadCMS configuration
│   ├── collections/              # Data collections
│   │   ├── Posts.ts              # Blog posts collection
│   │   ├── Categories.ts         # Categories collection
│   │   └── Tags.ts               # Tags collection
│   ├── globals.ts                # Global config
│   ├── types.ts                  # TypeScript types
│   └── init.ts                   # Payload initialization
│
├── lib/                          # Utility libraries
│   ├── payload-client.ts         # Payload client config
│   ├── search.ts                 # Search algorithm
│   └── utils.ts                  # Helper functions
│
├── public/                       # Static assets
│   └── images/                   # Static images
│
├── docs/                         # Documentation
│   ├── PROJECT.md                # Project overview
│   └── ARCHITECTURE.md           # This file
│
└── package.json
```

## Database Schema

### Posts Collection

```typescript
{
  title: string;              // Post title
  slug: string;               // URL-friendly unique identifier
  content: RichText;          // Rich text content (Payload editor)
  excerpt: string;            // Short description/summary
  coverImage: Upload;         // Featured image
  category: Category;         // Single category relation
  tags: Tag[];                // Multiple tags relation
  publishedAt: Date;          // Publication date
  createdAt: Date;            // Creation date
  updatedAt: Date;            // Last update date
  status: 'draft' | 'published';
  relatedPosts: Post[];       // Related posts links
}
```

### Categories Collection

```typescript
{
  name: string;               // Display name
  slug: string;               // URL-friendly unique identifier
  description?: string;       // Optional description
  icon?: string;              // Optional emoji or icon name
}
```

### Tags Collection

```typescript
{
  name: string;               // Display name
  slug: string;               // URL-friendly unique identifier
  color?: string;             // Optional hex color
}
```

## Search Algorithm

### Local Search Strategy

Given the modest number of posts, a local search algorithm is sufficient:

```typescript
interface SearchOptions {
  query: string;
  category?: string;
  tag?: string;
  limit?: number;
  page?: number;
}

interface SearchResult {
  posts: Post[];
  totalResults: number;
  totalPages: number;
}
```

**Scoring System:**
- Title match: 10 points
- Excerpt match: 5 points
- Content match: 1 point
- Combined score for ranking

**Implementation:**
1. Fetch all published posts
2. Filter by category/tag if provided
3. Search across title, excerpt, and content
4. Calculate relevance scores
5. Sort by score and date
6. Return paginated results

## Routing Strategy

### Public Routes (App Router)

| Route | Purpose | Caching Strategy |
|-------|---------|------------------|
| `/` | Homepage | ISR (revalidate every hour) |
| `/about` | About page | Static |
| `/blog` | Blog listing | ISR (revalidate every hour) |
| `/blog/[slug]` | Single post | ISR (revalidate on demand) |
| `/category/[slug]` | Category page | ISR (revalidate every hour) |
| `/tag/[slug]` | Tag page | ISR (revalidate every hour) |
| `/search` | Search | No cache (dynamic) |

### API Routes

| Route | Purpose |
|-------|---------|
| `/api/search` | Local search endpoint |

## PayloadCMS Integration

### Client vs Server

- **Server**: Direct Payload import for server components
- **Client**: Payload REST API via fetch wrapper

### Admin Access

- Protected route: `/admin`
- Single admin user
- Email/password authentication
- Managed via Payload's built-in auth

## Image Handling

### Upload Flow

1. Author uploads image via Payload admin
2. Image stored in Vercel Blob Storage
3. Payload stores metadata in PostgreSQL
4. Next.js Image component for optimization
5. Blur placeholder generated automatically

### Image Sizes

Responsive images with:
- 16:9 aspect ratio for cover images
- WebP/AVIF formats
- Lazy loading
- Progressive loading with blur

## SEO Implementation

### Meta Tags

Each page includes:
- Title and description
- Open Graph tags
- Twitter Card tags
- Canonical URL
- Schema.org JSON-LD

### Sitemap

Dynamic sitemap generated at `/sitemap.xml`:
- All published posts
- Category and tag pages
- Static pages (about, blog listing)
- Updated automatically

### RSS Feed

Feed generated at `/rss`:
- Recent posts (last 50)
- Full content or excerpts
- Standard RSS 2.0 format

## Performance Optimization

### Next.js Features

- **ISR (Incremental Static Regeneration)**: Blog posts and listings
- **Server Components**: Reduce client JavaScript
- **Streaming**: Progressive page rendering
- **Image Optimization**: Next.js Image component

### Caching Strategy

- Static pages: Edge cache
- Blog posts: ISR with revalidation
- API routes: Short cache where appropriate
- Images: Long cache with CDN

## Styling Architecture

### Tailwind Configuration

```javascript
module.exports = {
  theme: {
    extend: {
      colors: {
        background: '#000000',
        foreground: '#ffffff',
        card: '#0a0a0a',
        'card-hover': '#111111',
        border: '#333333',
        primary: '#0070f3', // Vercel blue
        'primary-hover': '#0060df',
      },
      fontFamily: {
        mono: ['var(--font-geist-mono)'],
        sans: ['var(--font-geist-sans)'],
      },
    },
  },
}
```

### Component Patterns

- Server components by default
- Client components only when needed (interactivity)
- Compound components for complex UI
- Consistent props interfaces

## Deployment

### Vercel Configuration

```javascript
// vercel.json
{
  "buildCommand": "pnpm build",
  "devCommand": "pnpm dev",
  "installCommand": "pnpm install",
  "framework": "nextjs",
  "regions": ["iad1"] // US East
}
```

### Environment Variables

```env
# Database
DATABASE_URL=
# Payload
PAYLOAD_SECRET=
# Vercel Blob
BLOB_READ_WRITE_TOKEN=
# Vercel Postgres
POSTGRES_URL=
POSTGRES_PRISMA_URL=
POSTGRES_URL_NON_POOLING=
```

## Security Considerations

- Payload admin protected with auth
- CSRF protection on API routes
- Rate limiting on search endpoint
- Secure headers (CSP, XSS protection)
- Environment variables for secrets
- No sensitive data in client code

## Development Workflow

### Local Development

1. Install dependencies: `pnpm install`
2. Setup environment variables
3. Run database migrations
4. Start dev server: `pnpm dev`
5. Access Payload admin: `http://localhost:3000/admin`

### Production Deployment

1. Push to `main` branch
2. Vercel auto-deploys
3. Database migrations run automatically
4. CDN caching enabled by default

## Future Extensibility

### Potential Additions

- Newsletter signup (Resend, Mailchimp)
- Comment system (giscus, Commento)
- Analytics (Vercel Analytics, Plausible)
- Webmentions
- Multiple authors
- Post series/collections
- Code syntax highlighting
- Mermaid diagrams
- Reading time estimation

### Architecture Enabling Growth

- Modular component structure
- Type-safe database access
- Clear separation of concerns
- Documented patterns
- Scalable caching strategy
