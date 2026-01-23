# About Page

## Overview

Create a static "About" page at `/about` with author bio and information.

## Page Implementation

Create `app/about/page.tsx`:

```typescript
import { Metadata } from 'next';
import Image from 'next/image';

export const metadata: Metadata = {
  title: 'About | Blog',
  description: 'Learn more about the author and this blog',
  openGraph: {
    title: 'About | Blog',
    description: 'Learn more about the author and this blog',
    type: 'website',
  },
};

export default function AboutPage() {
  return (
    <div className="container py-12">
      <div className="mx-auto max-w-4xl">
        {/* Header */}
        <header className="mb-8">
          <h1 className="text-4xl font-bold font-mono">~/about</h1>
        </header>

        {/* Content */}
        <div className="prose prose-invert max-w-none">
          {/* Introduction */}
          <section className="mb-12">
            <div className="flex flex-col md:flex-row gap-8 items-start">
              {/* Profile Image */}
              <div className="relative w-32 h-32 md:w-48 md:h-48 rounded-lg overflow-hidden border border-border flex-shrink-0">
                <Image
                  src="/images/avatar.jpg"
                  alt="Author avatar"
                  fill
                  className="object-cover"
                  priority
                />
              </div>

              {/* Bio */}
              <div>
                <h2 className="text-2xl font-bold mb-4">Hi, I'm [Your Name]</h2>
                <p className="text-muted-foreground leading-relaxed">
                  I'm a software developer passionate about building beautiful,
                  functional applications. I write about web development,
                  software architecture, and the lessons I've learned along the way.
                </p>
                <p className="text-muted-foreground leading-relaxed mt-4">
                  When I'm not coding, you can find me exploring new technologies,
                  contributing to open source, or sharing knowledge with the developer community.
                </p>
              </div>
            </div>
          </section>

          {/* Tech Stack */}
          <section className="mb-12">
            <h2 className="text-2xl font-bold mb-4">Tech Stack</h2>
            <p className="text-muted-foreground mb-4">
              Technologies I work with regularly:
            </p>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              {[
                { name: 'TypeScript', icon: '📘' },
                { name: 'React', icon: '⚛️' },
                { name: 'Next.js', icon: '▲' },
                { name: 'Node.js', icon: '🟢' },
                { name: 'PostgreSQL', icon: '🐘' },
                { name: 'Docker', icon: '🐳' },
              ].map((tech) => (
                <div
                  key={tech.name}
                  className="flex items-center gap-2 p-3 rounded-lg border border-border bg-card"
                >
                  <span className="text-2xl">{tech.icon}</span>
                  <span className="font-mono">{tech.name}</span>
                </div>
              ))}
            </div>
          </section>

          {/* Connect */}
          <section className="mb-12">
            <h2 className="text-2xl font-bold mb-4">Let's Connect</h2>
            <p className="text-muted-foreground mb-4">
              Feel free to reach out on any of these platforms:
            </p>
            <div className="flex flex-wrap gap-4">
              {[
                { name: 'GitHub', url: 'https://github.com', icon: '🐙' },
                { name: 'Twitter', url: 'https://twitter.com', icon: '🐦' },
                { name: 'LinkedIn', url: 'https://linkedin.com', icon: '💼' },
                { name: 'Email', url: 'mailto:hello@example.com', icon: '📧' },
              ].map((social) => (
                <a
                  key={social.name}
                  href={social.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 px-4 py-2 rounded-lg border border-border bg-card hover:border-primary transition-colors font-mono"
                >
                  <span>{social.icon}</span>
                  <span>{social.name}</span>
                </a>
              ))}
            </div>
          </section>

          {/* This Blog */}
          <section>
            <h2 className="text-2xl font-bold mb-4">About This Blog</h2>
            <p className="text-muted-foreground leading-relaxed">
              This blog is built with modern web technologies:
            </p>
            <ul className="list-disc list-inside text-muted-foreground mt-4 space-y-2">
              <li><strong>Next.js 16</strong> - React framework for production</li>
              <li><strong>PayloadCMS</strong> - Headless CMS for content management</li>
              <li><strong>PostgreSQL</strong> - Robust database for data storage</li>
              <li><strong>Tailwind CSS</strong> - Utility-first CSS framework</li>
              <li><strong>shadcn/ui</strong> - Beautiful and accessible components</li>
              <li><strong>Vercel</strong> - Deployment and hosting platform</li>
            </ul>
            <p className="text-muted-foreground leading-relaxed mt-4">
              The source code is available on GitHub if you're interested in how it's built.
            </p>
          </section>
        </div>
      </div>
    </div>
  );
}
```

## Dynamic About Page (Optional)

If you want to manage the about content via PayloadCMS:

### 1. Create Global

Create `payload/globals/About.ts`:

```typescript
import { Global } from 'payload';

export const About: Global = {
  slug: 'about',
  admin: {
    group: 'Globals',
  },
  fields: [
    {
      name: 'name',
      type: 'text',
      required: true,
    },
    {
      name: 'bio',
      type: 'textarea',
      required: true,
    },
    {
      name: 'avatar',
      type: 'upload',
      relationTo: 'media',
    },
    {
      name: 'techStack',
      type: 'array',
      fields: [
        {
          name: 'name',
          type: 'text',
        },
        {
          name: 'icon',
          type: 'text',
        },
      ],
    },
    {
      name: 'socialLinks',
      type: 'array',
      fields: [
        {
          name: 'platform',
          type: 'text',
        },
        {
          name: 'url',
          type: 'text',
        },
        {
          name: 'icon',
          type: 'text',
        },
      ],
    },
    {
      name: 'additionalContent',
      type: 'richText',
    },
  ],
};
```

### 2. Register Global

Update `payload/init.ts`:

```typescript
import { About } from './globals/About';

// In buildConfig:
globals: [
  About,
],
```

### 3. Update Page

```typescript
import { getPayloadClient } from '@/lib/payload-client';

export default async function AboutPage() {
  const payload = await getPayloadClient();

  const about = await payload.findGlobal({
    slug: 'about',
  });

  return (
    <div className="container py-12">
      <div className="mx-auto max-w-4xl">
        <h1 className="text-4xl font-bold font-mono mb-8">~/about</h1>

        {about.avatar && (
          <Image
            src={about.avatar.url}
            alt={about.name}
            width={192}
            height={192}
            className="rounded-lg border border-border mb-8"
          />
        )}

        <h2 className="text-2xl font-bold mb-4">{about.name}</h2>
        <p className="text-muted-foreground mb-8">{about.bio}</p>

        {/* Render other fields... */}
      </div>
    </div>
  );
}
```

## Avatar Placeholder

Add a placeholder avatar image in `public/images/avatar.jpg` or use the Next.js default:

```typescript
<div className="w-32 h-32 rounded-lg bg-gradient-to-br from-primary to-primary-hover flex items-center justify-center text-4xl font-bold">
  YN
</div>
```

## Next Steps

- [ ] Implement sitemap generation
- [ ] Implement RSS feed
- [ ] Add SEO optimization
