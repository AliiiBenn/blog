# Testing Strategy

## Overview

Simple but comprehensive testing approach focused on **backend logic and core functionality**. No complex E2E tests - we rely on manual testing for user flows.

## Philosophy

- **Test the important stuff**: Backend logic, data transformations, critical business rules
- **Keep it fast**: Unit tests should run in seconds
- **No E2E unless simple**: Manual testing is sufficient for most user flows
- **Backend-first**: Server Actions, core logic, and validators are critical

## Testing Stack

- **Vitest** - Unit and integration tests (fast, works with TypeScript)
- **@testing-library/react** - Component testing (when needed)
- **MSW (optional)** - Mock Payload API in tests

## What to Test

### ✅ **Test These (Priority)**

#### 1. **Server Actions** (CRITICAL)
- Input validation
- Error handling
- Data transformation
- Edge cases

#### 2. **Core Functions** (@/core)
- Validators (Zod schemas)
- Formatters (date, text)
- Pure utilities (debounce, cn)
- Constants (breakpoints, routes)

#### 3. **Search Algorithm**
- Scoring logic
- Filtering by category/tag
- Pagination
- Empty results handling

#### 4. **Data Transformations**
- API response formatting
- Payload data mapping
- Type guards

#### 5. **Component Logic** (Selectively)
- Complex hooks with side effects
- Data fetching logic
- Error boundaries

### ❌ **Don't Test These**

- UI components with no logic (Button, Card - shadcn/ui)
- Static content (About page)
- Simple presentational components
- Third-party libraries (trust shadcn/ui, Payload, TanStack Query)
- Types (TypeScript checks these)

## Test Structure

```
src/
├── api/
│   ├── posts/
│   │   ├── get.ts
│   │   └── get.test.ts          # ✅ Test Server Action
│   ├── search/
│   │   ├── query.ts
│   │   └── query.test.ts        # ✅ Test search logic
│   └── categories/
│       ├── index.ts
│       └── index.test.ts        # ✅ Test categories API
│
├── core/
│   ├── validators/
│   │   ├── index.ts
│   │   └── index.test.ts        # ✅ Test Zod schemas
│   ├── formatters/
│   │   ├── date.ts
│   │   ├── date.test.ts         # ✅ Test date formatting
│   │   ├── text.ts
│   │   └── text.test.ts         # ✅ Test text utils
│   └── utils/
│       ├── debounce.ts
│       └── debounce.test.ts     # ✅ Test debounce
│
└── hooks/
    ├── use-posts.ts
    └── use-posts.test.ts        # ✅ Test hook logic
```

## Test Examples

### 1. Server Action Test

```typescript
// src/api/posts/get.test.ts
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { getPosts } from './get';

// Mock Payload
vi.mock('@/payload/init', () => ({
  default: {
    find: vi.fn(),
  },
}));

describe('getPosts', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should return posts with default options', async () => {
    const mockPosts = {
      docs: [
        { id: '1', title: 'Test Post', status: 'published' },
      ],
      totalPages: 1,
      totalDocs: 1,
    };

    vi.mocked(payload.find).mockResolvedValue(mockPosts);

    const result = await getPosts({});

    expect(result.posts).toHaveLength(1);
    expect(result.posts[0].title).toBe('Test Post');
  });

  it('should filter by status', async () => {
    await getPosts({ status: 'published' });

    expect(payload.find).toHaveBeenCalledWith({
      collection: 'posts',
      where: { status: 'published' },
      limit: 10,
      page: 1,
    });
  });

  it('should filter by category', async () => {
    await getPosts({ category: 'tech' });

    expect(payload.find).toHaveBeenCalledWith({
      collection: 'posts',
      where: { category: { equals: 'tech' } },
    });
  });

  it('should handle empty results', async () => {
    vi.mocked(payload.find).mockResolvedValue({
      docs: [],
      totalPages: 0,
      totalDocs: 0,
    });

    const result = await getPosts({});

    expect(result.posts).toHaveLength(0);
    expect(result.totalDocs).toBe(0);
  });

  it('should propagate errors', async () => {
    vi.mocked(payload.find).mockRejectedValue(
      new Error('Database error')
    );

    await expect(getPosts({})).rejects.toThrow('Database error');
  });
});
```

### 2. Core Function Test

```typescript
// src/core/formatters/date.test.ts
import { describe, it, expect } from 'vitest';
import { formatDate, formatReadingTime, getRelativeTime } from './date';

describe('formatDate', () => {
  it('should format date correctly', () => {
    const date = new Date('2024-01-15');
    const result = formatDate(date);

    expect(result).toBe('January 15, 2024');
  });

  it('should handle string dates', () => {
    const result = formatDate('2024-01-15');

    expect(result).toContain('2024');
  });
});

describe('formatReadingTime', () => {
  it('should format minutes', () => {
    expect(formatReadingTime(5)).toBe('5 min read');
  });

  it('should show minimum 1 minute', () => {
    expect(formatReadingTime(0)).toBe('1 min read');
    expect(formatReadingTime(0.5)).toBe('1 min read');
  });
});

describe('getRelativeTime', () => {
  it('should show "just now" for < 1 minute', () => {
    const now = new Date();
    const oneSecondAgo = new Date(now.getTime() - 1000);

    expect(getRelativeTime(oneSecondAgo)).toBe('just now');
  });

  it('should show minutes', () => {
    const now = new Date();
    const fiveMinutesAgo = new Date(now.getTime() - 5 * 60 * 1000);

    expect(getRelativeTime(fiveMinutesAgo)).toBe('5m ago');
  });

  it('should show hours', () => {
    const now = new Date();
    const twoHoursAgo = new Date(now.getTime() - 2 * 60 * 60 * 1000);

    expect(getRelativeTime(twoHoursAgo)).toBe('2h ago');
  });

  it('should show days', () => {
    const now = new Date();
    const threeDaysAgo = new Date(now.getTime() - 3 * 24 * 60 * 60 * 1000);

    expect(getRelativeTime(threeDaysAgo)).toBe('3d ago');
  });
});
```

### 3. Validator Test

```typescript
// src/core/validators/index.test.ts
import { describe, it, expect } from 'vitest';
import { searchInputSchema } from './index';

describe('searchInputSchema', () => {
  it('should validate valid input', () => {
    const result = searchInputSchema.parse({
      q: 'react',
      limit: 10,
    });

    expect(result.q).toBe('react');
    expect(result.limit).toBe(10);
  });

  it('should use default limit', () => {
    const result = searchInputSchema.parse({
      q: 'react',
    });

    expect(result.limit).toBe(10);
  });

  it('should allow optional category', () => {
    const result = searchInputSchema.parse({
      q: 'react',
      category: 'tech',
    });

    expect(result.category).toBe('tech');
  });

  it('should reject short query', () => {
    expect(() => {
      searchInputSchema.parse({ q: 'r' });
    }).toThrow();
  });

  it('should reject invalid limit', () => {
    expect(() => {
      searchInputSchema.parse({ q: 'react', limit: 0 });
    }).toThrow();

    expect(() => {
      searchInputSchema.parse({ q: 'react', limit: 200 });
    }).toThrow();
  });
});
```

### 4. Search Algorithm Test

```typescript
// src/api/search/query.test.ts
import { describe, it, expect, vi } from 'vitest';
import { searchPosts } from './query';

describe('searchPosts', () => {
  it('should score title matches higher', async () => {
    const posts = [
      { title: 'React Tutorial', excerpt: '', content: '' },
      { title: 'Vue Guide', excerpt: 'React is cool', content: '' },
    ];

    const results = await searchPosts({ q: 'react', posts });

    expect(results[0].title).toBe('React Tutorial');
    expect(results[0].score).toBeGreaterThan(results[1].score);
  });

  it('should filter by category', async () => {
    const posts = [
      { title: 'React Tutorial', category: 'tech' },
      { title: 'React Recipes', category: 'food' },
    ];

    const results = await searchPosts({
      q: 'react',
      category: 'tech',
      posts,
    });

    expect(results).toHaveLength(1);
    expect(results[0].category).toBe('tech');
  });

  it('should handle no matches', async () => {
    const results = await searchPosts({
      q: 'nonexistent',
      posts: [{ title: 'React' }],
    });

    expect(results).toHaveLength(0);
  });

  it('should paginate results', async () => {
    const posts = Array.from({ length: 25 }, (_, i) => ({
      title: `Post ${i}`,
      content: 'react',
    }));

    const page1 = await searchPosts({ q: 'react', posts, page: 1, limit: 10 });
    const page2 = await searchPosts({ q: 'react', posts, page: 2, limit: 10 });

    expect(page1.length).toBe(10);
    expect(page2.length).toBe(10);
    expect(page1[0].title).not.toBe(page2[0].title);
  });
});
```

### 5. Hook Test (Simple Cases)

```typescript
// src/hooks/use-posts.test.ts
import { describe, it, expect, vi } from 'vitest';
import { renderHook, waitFor } from '@testing-library/react';
import { usePosts } from './use-posts';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

// Mock the API
vi.mock('@/api', () => ({
  api: {
    posts: {
      get: vi.fn(),
    },
  },
}));

describe('usePosts', () => {
  it('should fetch posts', async () => {
    vi.mocked(api.posts.get).mockResolvedValue({
      posts: [{ id: '1', title: 'Test' }],
      totalDocs: 1,
      totalPages: 1,
    });

    const { result } = renderHook(() => usePosts());

    await waitFor(() => expect(result.current.isLoading).toBe(false));

    expect(result.current.data.posts).toHaveLength(1);
  });

  it('should handle errors', async () => {
    vi.mocked(api.posts.get).mockRejectedValue(
      new Error('Failed to fetch')
    );

    const { result } = renderHook(() => usePosts());

    await waitFor(() => expect(result.current.isError).toBe(true));

    expect(result.current.error).toBeTruthy();
  });
});
```

## Configuration

### Vitest Setup

```typescript
// vitest.config.ts
import { defineConfig } from 'vitest/config';
import react from '@vitejs/plugin-react';
import path from 'path';

export default defineConfig({
  plugins: [react()],
  test: {
    environment: 'jsdom',
    setupFiles: ['./vitest.setup.ts'],
    coverage: {
      provider: 'v8',
      reporter: ['text', 'json', 'html'],
      exclude: [
        'node_modules/',
        'src/components/ui/', // shadcn/ui - no need to test
        '**/*.test.ts',
        '**/*.test.tsx',
      ],
    },
  },
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
});
```

```typescript
// vitest.setup.ts
import { vi } from 'vitest';

// Mock Payload globally
vi.mock('@/payload/init', () => ({
  default: {
    find: vi.fn(),
    findByID: vi.fn(),
    create: vi.fn(),
    update: vi.fn(),
    delete: vi.fn(),
  },
}));

// Mock environment variables
process.env.DATABASE_URL = 'postgresql://test';
process.env.PAYLOAD_SECRET = 'test-secret';
```

### Package.json Scripts

```json
{
  "scripts": {
    "test": "vitest",
    "test:run": "vitest run",
    "test:coverage": "vitest run --coverage",
    "test:watch": "vitest --watch"
  }
}
```

## Coverage Goals

| Area | Target | Notes |
|------|--------|-------|
| **Server Actions** | 90%+ | Critical - test all paths |
| **Core Functions** | 100% | Pure functions - easy to test |
| **Validators** | 100% | Zod schemas - cheap to test |
| **Hooks** | 70%+ | Complex logic only |
| **Components** | 0-50% | Skip presentational, test logic |
| **UI Components** | 0% | Don't test shadcn/ui |

## Test Writing Guidelines

### ✅ **DO**

1. **Test behavior, not implementation**
   ```typescript
   // ✅ GOOD
   expect(result.posts).toHaveLength(10);

   // ❌ BAD
   expect(payload.find).toHaveBeenCalledWith({ limit: 10 });
   ```

2. **Use descriptive test names**
   ```typescript
   // ✅ GOOD
   it('should return empty array when no posts match')

   // ❌ BAD
   it('works')
   ```

3. **Test edge cases**
   - Empty inputs
   - Null/undefined values
   - Error scenarios
   - Pagination boundaries

4. **Mock external dependencies**
   - Payload API
   - File system
   - Network requests

### ❌ **DON'T**

1. **Don't test third-party code**
   - TanStack Query (well-tested)
   - shadcn/ui components
   - Next.js built-ins

2. **Don't test simple JSX**
   ```typescript
   // ❌ WASTE OF TIME
   it('renders a div', () => {
     render(<div>Hello</div>);
     expect(screen.getByText('Hello')).toBeInTheDocument();
   });
   ```

3. **Don't test types**
   ```typescript
   // ❌ USELESS
   it('has correct type', () => {
     const result: Post = { id: '1' };
   });
   ```

## CI Integration

Tests run automatically:
- **Pre-commit**: Only changed files (fast feedback)
- **GitHub Actions**: Full test suite on every PR
- **Coverage check**: Fail if coverage drops below targets

## Manual Testing Checklist

Since we don't do E2E, use this checklist:

### Critical User Paths
- [ ] Homepage loads correctly
- [ ] Navigate to blog listing
- [ ] Open a single blog post
- [ ] Search functionality works
- [ ] Category filtering works
- [ ] Tag filtering works
- [ ] Admin panel accessible
- [ ] Create/edit/delete post works

### Responsive Design
- [ ] Mobile view (< 768px)
- [ ] Tablet view (768px - 1024px)
- [ ] Desktop view (> 1024px)

### Performance
- [ ] Lighthouse score > 90
- [ ] No console errors
- [ ] Images load correctly

## When to Write Tests

### ✅ **Write tests when:**
- Implementing Server Actions
- Adding complex business logic
- Creating validators/formatters
- Working on search algorithm
- Fixing a bug (add regression test)

### ⏸️ **Skip tests when:**
- Building UI components (use visual testing)
- Adding static content
- Updating configuration
- Refactoring types (TypeScript is enough)

## Summary

**Testing priorities:**
1. **Backend logic** (Server Actions) - CRITICAL
2. **Core functions** (@/core) - CRITICAL
3. **Search algorithm** - IMPORTANT
4. **Component logic** - NICE TO HAVE
5. **UI components** - SKIP

**No E2E** = Trust manual testing for user flows, focus on backend logic.
