# Admin Panel

## Overview

Configure and customize the PayloadCMS admin panel for content management.

## Admin Configuration

Update `payload/init.ts`:

```typescript
export default buildConfig({
  admin: {
    user: 'Users',
    admin: {
      type: 'user',
    },
    components: {
      graphics: {
        Logo: '@/components/admin/Logo',
        Icon: '@/components/admin/Icon',
      },
      routes: [
        {
          path: '/dashboard',
          Component: '@/components/admin/Dashboard',
        },
      ],
    },
    theme: 'dark',
    css: '@/app/admin.css',
    meta: {
      titleSuffix: '- Blog Admin',
      favicon: '/favicon.ico',
      ogImage: '/og.png',
    },
    defaultLocale: 'en',
    locales: ['en'],
  },
});
```

## Custom Admin Components

### Admin Logo

Create `components/admin/Logo.tsx`:

```typescript
import React from 'react';

const Logo = () => {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
      <span style={{
        fontSize: '20px',
        fontWeight: 'bold',
        fontFamily: 'monospace',
        color: '#0070f3',
      }}>
        $
      </span>
      <span style={{
        fontSize: '16px',
        fontWeight: 'bold',
        fontFamily: 'monospace',
      }}>
        blog
      </span>
    </div>
  );
};

export default Logo;
```

### Admin Icon

Create `components/admin/Icon.tsx`:

```typescript
import React from 'react';

const Icon = () => {
  return (
    <svg width="32" height="32" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect width="32" height="32" rx="6" fill="#000"/>
      <text x="50%" y="55%" dominantBaseline="middle" textAnchor="middle"
        fontFamily="monospace" fontSize="16" fontWeight="bold" fill="#0070f3">
        $
      </text>
    </svg>
  );
};

export default Icon;
```

### Custom Dashboard

Create `components/admin/Dashboard.tsx`:

```typescript
import React, { useEffect, useState } from 'react';
import { payload } from '@/payload';

const Dashboard = () => {
  const [stats, setStats] = useState({
    totalPosts: 0,
    publishedPosts: 0,
    draftPosts: 0,
    totalCategories: 0,
    totalTags: 0,
  });

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const [posts, categories, tags] = await Promise.all([
          payload.find({
            collection: 'posts',
            limit: 0,
            depth: 0,
          }),
          payload.find({
            collection: 'categories',
            limit: 0,
            depth: 0,
          }),
          payload.find({
            collection: 'tags',
            limit: 0,
            depth: 0,
          }),
        ]);

        const publishedCount = posts.docs.filter(
          (post: any) => post.status === 'published'
        ).length;

        setStats({
          totalPosts: posts.totalDocs,
          publishedPosts: publishedCount,
          draftPosts: posts.totalDocs - publishedCount,
          totalCategories: categories.totalDocs,
          totalTags: tags.totalDocs,
        });
      } catch (error) {
        console.error('Error fetching stats:', error);
      }
    };

    fetchStats();
  }, []);

  return (
    <div style={{ padding: '24px' }}>
      <h1 style={{ fontSize: '24px', fontWeight: 'bold', marginBottom: '24px' }}>
        Dashboard
      </h1>

      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
        gap: '16px',
      }}>
        <div style={{
          padding: '16px',
          borderRadius: '8px',
          border: '1px solid #333',
          backgroundColor: '#0a0a0a',
        }}>
          <div style={{ fontSize: '14px', color: '#999', marginBottom: '8px' }}>
            Total Posts
          </div>
          <div style={{ fontSize: '32px', fontWeight: 'bold' }}>
            {stats.totalPosts}
          </div>
        </div>

        <div style={{
          padding: '16px',
          borderRadius: '8px',
          border: '1px solid #333',
          backgroundColor: '#0a0a0a',
        }}>
          <div style={{ fontSize: '14px', color: '#999', marginBottom: '8px' }}>
            Published
          </div>
          <div style={{ fontSize: '32px', fontWeight: 'bold', color: '#0070f3' }}>
            {stats.publishedPosts}
          </div>
        </div>

        <div style={{
          padding: '16px',
          borderRadius: '8px',
          border: '1px solid #333',
          backgroundColor: '#0a0a0a',
        }}>
          <div style={{ fontSize: '14px', color: '#999', marginBottom: '8px' }}>
            Drafts
          </div>
          <div style={{ fontSize: '32px', fontWeight: 'bold', color: '#666' }}>
            {stats.draftPosts}
          </div>
        </div>

        <div style={{
          padding: '16px',
          borderRadius: '8px',
          border: '1px solid #333',
          backgroundColor: '#0a0a0a',
        }}>
          <div style={{ fontSize: '14px', color: '#999', marginBottom: '8px' }}>
            Categories
          </div>
          <div style={{ fontSize: '32px', fontWeight: 'bold' }}>
            {stats.totalCategories}
          </div>
        </div>

        <div style={{
          padding: '16px',
          borderRadius: '8px',
          border: '1px solid #333',
          backgroundColor: '#0a0a0a',
        }}>
          <div style={{ fontSize: '14px', color: '#999', marginBottom: '8px' }}>
            Tags
          </div>
          <div style={{ fontSize: '32px', fontWeight: 'bold' }}>
            {stats.totalTags}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
```

## Admin Custom Styles

Create `app/admin.css`:

```css
/* Custom admin styles to match Vercel/Terminal theme */

:root {
  --tk-font-sans: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Oxygen',
    'Ubuntu', 'Cantarell', 'Fira Sans', 'Droid Sans', 'Helvetica Neue', sans-serif;
  --tk-font-mono: 'SF Mono', 'Monaco', 'Inconsolata', 'Fira Mono', 'Droid Sans Mono',
    'Source Code Pro', monospace;
}

/* Dark mode overrides */
body {
  --theme-bg-100: #000000;
  --theme-bg-200: #0a0a0a;
  --theme-bg-300: #111111;
  --theme-elevated-100: #0a0a0a;
  --theme-elevated-200: #111111;
  --theme-elevated-300: #1a1a1a;
  --theme-border-color: #333333;
  --theme-text-primary: #ffffff;
  --theme-text-secondary: #999999;
  --theme-selection: rgba(0, 112, 243, 0.2);
  --theme-primary: #0070f3;
  --theme-primary-hover: #0060df;
}

/* Custom font for terminal feel */
.tk-header,
.tk-sidebar,
.tk-collection-list,
.tk-dash {
  font-family: var(--tk-font-mono);
}

/* Logo styling */
.tk-header-logo {
  display: flex;
  align-items: center;
  gap: 8px;
}

/* Button styling */
.tk-button-primary {
  background-color: var(--theme-primary);
  border-color: var(--theme-primary);
}

.tk-button-primary:hover {
  background-color: var(--theme-primary-hover);
  border-color: var(--theme-primary-hover);
}

/* Input styling */
.tk-input,
.tk-textarea,
.tk-select {
  background-color: var(--theme-bg-200);
  border-color: var(--theme-border-color);
}

/* Card styling */
.tk-card {
  background-color: var(--theme-bg-200);
  border-color: var(--theme-border-color);
}
```

## Admin Hooks

### Auto-Generate Slug

```typescript
// In Posts collection
{
  name: 'slug',
  type: 'text',
  admin: {
    position: 'sidebar',
  },
  hooks: {
    beforeValidate: [
      ({ siblingData, value }) => {
        if (siblingData.title && !value) {
          return siblingData.title
            .toLowerCase()
            .replace(/[^a-z0-9]+/g, '-')
            .replace(/^-|-$/g, '');
        }
        return value;
      },
    ],
  },
}
```

### Auto-Set Published Date

```typescript
// In Posts collection
{
  name: 'publishedAt',
  type: 'date',
  admin: {
    position: 'sidebar',
  },
  hooks: {
    beforeChange: [
      ({ siblingData, data }) => {
        if (siblingData.status === 'published' && !siblingData.publishedAt) {
          return new Date();
        }
        return siblingData.publishedAt || data.publishedAt;
      },
    ],
  },
}
```

## Access Control

### Post Access Control

```typescript
// In Posts collection
access: {
  read: () => true, // Public read access
  create: ({ req }) => req.user?.role === 'admin',
  update: ({ req }) => req.user?.role === 'admin',
  delete: ({ req }) => req.user?.role === 'admin',
},
```

### Admin-Only Collections

```typescript
// In Media collection
access: {
  read: ({ req }) => !!req.user,
  create: ({ req }) => req.user?.role === 'admin',
  update: ({ req }) => req.user?.role === 'admin',
  delete: ({ req }) => req.user?.role === 'admin',
},
```

## Admin Dashboard Quick Links

Add custom navigation:

```typescript
// In admin config
components: {
  graphics: {
    Logo: '@/components/admin/Logo',
    Icon: '@/components/admin/Icon',
  },
  routes: [
    {
      path: '/view-site',
      Component: () => null,
      exact: true,
    },
  ],
},
```

## Admin User Management

### Seed Initial Admin User

Create `payload/seed.ts`:

```typescript
import { payload } from '@/payload';

async function seed() {
  // Check if admin user exists
  const existingUser = await payload.find({
    collection: 'users',
    where: {
      email: {
        equals: process.env.PAYLOAD_ADMIN_EMAIL || 'admin@example.com',
      },
    },
    limit: 1,
  });

  if (!existingUser.docs[0]) {
    // Create admin user
    await payload.create({
      collection: 'users',
      data: {
        email: process.env.PAYLOAD_ADMIN_EMAIL || 'admin@example.com',
        password: process.env.PAYLOAD_ADMIN_PASSWORD || 'changeme',
        name: 'Admin',
        role: 'admin',
      },
    });

    console.log('Admin user created');
  } else {
    console.log('Admin user already exists');
  }
}

seed();
```

## Admin Rich Text Editor Configuration

Customize the editor:

```typescript
// In payload/init.ts
editor: slateEditor({
  features: ({ defaultFeatures }) => [
    ...defaultFeatures,
    // Add custom features
  ],
}),
```

## Next Steps

- [ ] Implement performance optimization
- [ ] Configure deployment
- [ ] Add admin user documentation
