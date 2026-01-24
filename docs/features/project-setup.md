# Project Setup

## Overview

Initialize a Next.js 16 project with PayloadCMS, TypeScript, Tailwind CSS, and shadcn/ui.

## Steps

### 1. Initialize Next.js Project

```bash
pnpm create next-app@latest blog --typescript --tailwind --eslint --app --src-dir --import-alias "@/*"
cd blog
```

### 2. Install Dependencies

```bash
# PayloadCMS and dependencies
pnpm add payload @payloadcms/bundler-webpack @payloadcms/db-postgres @payloadcms/db-vercel-postgres
pnpm add @payloadcms/richtext-slate @payloadcms/storage-vercel-blob

# Additional dependencies
pnpm add next-themes clsx tailwind-merge
pnpm add -D @types/node
```

### 3. Setup shadcn/ui

```bash
pnpm dlx shadcn@latest init
```

Configuration:
- Style: Default
- Base color: Slate
- CSS variables: Yes
- Tailwind config: Yes
- Components json: Yes

### 4. Install shadcn Components

```bash
pnpm dlx shadcn@latest add button card input badge select separator
```

### 5. Configure Tailwind CSS

Update `tailwind.config.ts` with Vercel theme colors:

```typescript
import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: ["class"],
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        card: {
          DEFAULT: "hsl(var(--card))",
          hover: "hsl(var(--card-hover))",
        },
        border: "hsl(var(--border))",
        primary: {
          DEFAULT: "hsl(var(--primary))",
          hover: "hsl(var(--primary-hover))",
        },
        muted: {
          DEFAULT: "hsl(var(--muted))",
          foreground: "hsl(var(--muted-foreground))",
        },
      },
      fontFamily: {
        sans: ["var(--font-geist-sans)", "sans-serif"],
        mono: ["var(--font-geist-mono)", "monospace"],
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
};

export default config;
```

### 6. Update Global Styles

In `app/globals.css`, add CSS variables for dark theme:

```css
@tailwind base;
@tailwind components;
@tailwind utilities;

@layer base {
  :root {
    --background: 0 0% 0%;
    --foreground: 0 0% 100%;
    --card: 0 0% 4%;
    --card-hover: 0 0% 7%;
    --border: 0 0% 20%;
    --primary: 211 100% 48%;
    --primary-hover: 211 100% 45%;
    --muted: 0 0% 15%;
    --muted-foreground: 0 0% 60%;
  }
}
```

### 7. Environment Variables Template

Create `.env.example`:

```env
# Database
DATABASE_URL=

# Payload
PAYLOAD_SECRET=
NEXT_PUBLIC_PAYLOAD_URL=

# Vercel Postgres
POSTGRES_URL=
POSTGRES_PRISMA_URL=
POSTGRES_URL_NON_POOLING=

# AWS S3
S3_BUCKET_NAME=
S3_REGION=
S3_ACCESS_KEY_ID=
S3_SECRET_ACCESS_KEY=
S3_ENDPOINT=

# Admin
PAYLOAD_ADMIN_EMAIL=
PAYLOAD_ADMIN_PASSWORD=
```

### 8. Vercel Configuration

Create `vercel.json`:

```json
{
  "buildCommand": "pnpm build",
  "devCommand": "pnpm dev",
  "installCommand": "pnpm install",
  "framework": "nextjs"
}
```

### 9. Git Initialization

```bash
git init
git add .
git commit -m "Initial project setup with Next.js, PayloadCMS, and shadcn/ui"
```

## Next Steps

- [ ] Configure PayloadCMS
- [ ] Setup database collections
- [ ] Create layout components
- [ ] Implement pages
