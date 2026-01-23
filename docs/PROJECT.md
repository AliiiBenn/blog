# Personal Blog Project

## Overview

A modern, full-featured personal blog built with Next.js 16 and PayloadCMS, featuring a clean Vercel/Terminal-inspired design with full dark theme.

## Tech Stack

### Frontend
- **Next.js 16** (App Router)
- **React 19**
- **TypeScript**
- **Tailwind CSS**
- **shadcn/ui** (component library)

### Backend & CMS
- **PayloadCMS** (Headless CMS)
- **PostgreSQL** (Vercel Postgres)
- **Drizzle ORM** (included with Payload)

### Infrastructure
- **Vercel** (deployment)
- **Vercel Blob Storage** (image uploads)

## Core Features

### Content Management
- **Blog Posts** with rich text editor (Payload's built-in editor)
- **Categories** for post organization
- **Tags** for flexible content classification
- **Related Posts** linking between articles
- **Draft/Published** workflow

### User Experience
- Full dark theme (no light mode)
- Vercel/Terminal-inspired design
- Responsive design (mobile-first)
- Local search algorithm (no external service needed)
- Fast, optimized navigation

### SEO & Performance
- Dynamic meta tags (Open Graph, Twitter Cards)
- Automatic sitemap generation
- RSS feed for subscribers
- Schema.org markup (Article type)
- Image optimization with Next.js Image
- Blur placeholders for images

### Pages
1. **Homepage** - Hero section + featured/latest posts
2. **Blog Listing** - All posts with category/tag filters
3. **Single Post** - Full article with related posts
4. **Category Page** - All posts in a specific category
5. **Tag Page** - All posts with a specific tag
6. **Search Page** - Search results with filters
7. **About Page** - Static page about the author
8. **Admin Panel** - PayloadCMS admin interface

## Design Philosophy

### Vercel/Terminal Aesthetic
- **Colors**: Deep blacks (#000, #0a0a0a, #111)
- **Accents**: Vercel blue (#0070f3), white, gray gradients
- **Typography**: Mono fonts for terminal feel
- **Borders**: Subtle 1px borders (#333)
- **Effects**: Hover glows, smooth transitions

### Content Structure
- Clean, readable layouts
- Focus on typography and content
- Minimal distractions
- Fast loading times

## Search Strategy

Given that the blog won't have thousands of posts, a local search algorithm is sufficient:
- Full-text search across titles, excerpts, and content
- Relevance scoring (title > excerpt > content)
- Category and tag filtering
- Paginated results

No external search service (Algolia, Meilisearch) needed initially.

## Authentication

Single admin user access via PayloadCMS built-in authentication:
- Email/password login
- Admin panel access only
- No public user accounts

## Development Goals

1. **Performance**: Fast page loads, optimized images
2. **SEO**: Excellent search engine optimization
3. **Maintainability**: Clean code, well-documented
4. **Scalability**: Easy to add features as needed
5. **Developer Experience**: TypeScript, modern tooling

## Future Considerations

- Newsletter integration
- Comments system
- Multiple authors
- Analytics integration
- Webmentions
- RSS customization
