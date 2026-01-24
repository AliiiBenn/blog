---
name: payload-cms
description: Expert guide for Payload CMS v3 development - collections, fields, access control, hooks, components, and best practices. Use this skill when working with Payload CMS, creating collections, configuring fields, implementing access control, or building custom components and endpoints.
license: MIT
---

This skill provides comprehensive guidance for developing with Payload CMS v3. It covers collection configuration, field types, access control patterns, hooks, custom components, endpoints, and advanced features.

## When to Use This Skill

Use this skill when:
- Creating or modifying Payload collections
- Configuring fields and relationships
- Implementing access control and authentication
- Writing hooks for data manipulation
- Building custom admin components
- Creating API endpoints
- Working with Payload adapters (PostgreSQL, MongoDB, etc.)
- Implementing drafts, versioning, or localization
- Debugging Payload-related issues

## Core Concepts

### Collections
Collections define the data models in Payload. They include:
- **Slug**: Unique identifier for the collection
- **Fields**: Define the data structure
- **Access Control**: Who can read, create, update, delete
- **Hooks**: Lifecycle hooks (beforeOperation, afterOperation, etc.)
- **Admin**: Admin panel customization

### Fields
Fields define the shape of your data:
- **Basic types**: text, number, email, textarea, select, checkbox
- **Rich content**: richText, blocks, array
- **Relations**: relationship, upload, polymorphic
- **Advanced**: tabs, collapsible, group, UI fields

### Access Control
Granular permissions using functions:
```typescript
access: {
  read: () => true,
  create: ({ req }) => req.user?.roles?.includes('admin'),
  update: ({ req, data }) => data.author === req.user.id,
}
```

### Hooks
Modify data at lifecycle points:
```typescript
hooks: {
  beforeChange: [
    ({ siblingData }) => {
      siblingData.updatedAt = new Date()
    }
  ],
  afterRead: [
    ({ doc, req }) => {
      // Transform data before sending to client
    }
  ]
}
```

## Available Documentation Files

The following reference files contain detailed examples and patterns:

- **payload-overview.md**: Core concepts, configuration, and getting started
- **collections.md**: Collection configuration, auth, drafts, versioning
- **fields.md**: All field types, validation, and patterns
- **access-control.md**: Basic access control patterns
- **access-control-advanced.md**: Advanced permissions and security
- **hooks.md**: All available hooks with examples
- **components.md**: Custom admin components
- **endpoints.md**: Custom API endpoints
- **queries.md**: Database queries and filtering
- **adapters.md**: Database adapters (PostgreSQL, MongoDB, etc.)
- **field-type-guards.md**: TypeScript guards for field types
- **plugin-development.md**: Building custom plugins
- **security-critical.mdc**: Security best practices

## Best Practices

1. **Always use TypeScript** - Payload generates types for you
2. **Leverage hooks** - Transform data and enforce business logic
3. **Use access control** - Secure your data from the ground up
4. **Index fields** - Add indexes to frequently queried fields
5. **Virtual fields** - Computed data without database storage
6. **Field conditions** - Show/hide fields based on other values
7. **Custom components** - Enhance admin UX when needed

## Common Patterns

### Slug Auto-Generation
```typescript
import { slugField } from 'payload'

fields: [
  { name: 'title', type: 'text' },
  slugField({ fieldToUse: 'title' }),
]
```

### Published Status
```typescript
{
  name: 'status',
  type: 'select',
  options: ['draft', 'published'],
  defaultValue: 'draft',
  admin: {
    description: 'Posts must be published to appear on the site',
  },
}
```

### Featured Image
```typescript
{
  name: 'featuredImage',
  type: 'upload',
  relationTo: 'media',
  filterOptions: {
    mimeType: { equals: 'image/*' },
  },
}
```

### Related Posts
```typescript
{
  name: 'relatedPosts',
  type: 'relationship',
  relationTo: 'posts',
  hasMany: true,
  filterOptions: {
    id: { not_equals: 'id' },
  },
}
```

## Workflow Tips

1. **Start with collections** - Define your data models first
2. **Add fields incrementally** - Build and test as you go
3. **Test access control** - Verify permissions work as expected
4. **Use hooks sparingly** - Only when necessary for business logic
5. **Generate types** - Run `payload generate:types` after changes
6. **Check admin panel** - Verify UI appears correctly

## Integration with Next.js

Payload 3.0 includes official Next.js integration via `@payloadcms/next`:
- Route groups: `(payload)` for admin, `(frontend)` for your app
- API routes handled automatically
- Server Actions integration available
- SSR and SSG support

---

Refer to individual documentation files for detailed examples and advanced patterns.
