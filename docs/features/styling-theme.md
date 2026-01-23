# Styling & Theme

## Overview

Implement Vercel/Terminal-inspired dark theme using Tailwind CSS with custom fonts, colors, and animations.

## Tailwind Configuration

Update `tailwind.config.ts`:

```typescript
import type { Config } from 'tailwindcss';

const config: Config = {
  darkMode: ['class'],
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        background: 'hsl(var(--background))',
        foreground: 'hsl(var(--foreground))',
        card: {
          DEFAULT: 'hsl(var(--card))',
          hover: 'hsl(var(--card-hover))',
        },
        'card-hover': 'hsl(var(--card-hover))',
        border: 'hsl(var(--border))',
        input: 'hsl(var(--input))',
        primary: {
          DEFAULT: 'hsl(var(--primary))',
          foreground: 'hsl(var(--primary-foreground))',
          hover: 'hsl(var(--primary-hover))',
        },
        'primary-hover': 'hsl(var(--primary-hover))',
        secondary: {
          DEFAULT: 'hsl(var(--secondary))',
          foreground: 'hsl(var(--secondary-foreground))',
        },
        muted: {
          DEFAULT: 'hsl(var(--muted))',
          foreground: 'hsl(var(--muted-foreground))',
        },
        accent: {
          DEFAULT: 'hsl(var(--accent))',
          foreground: 'hsl(var(--accent-foreground))',
        },
      },
      fontFamily: {
        sans: ['var(--font-geist-sans)', 'system-ui', 'sans-serif'],
        mono: ['var(--font-geist-mono)', 'monospace'],
      },
      borderRadius: {
        lg: 'var(--radius)',
        md: 'calc(var(--radius) - 2px)',
        sm: 'calc(var(--radius) - 4px)',
      },
      animation: {
        'pulse-glow': 'pulse-glow 2s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'typing': 'typing 3s steps(30, end)',
        'blink': 'blink 1s step-end infinite',
      },
      keyframes: {
        'pulse-glow': {
          '0%, 100%': { opacity: '1' },
          '50%': { opacity: '.5' },
        },
        'typing': {
          '0%': { width: '0' },
          '100%': { width: '100%' },
        },
        'blink': {
          '0%, 100%': { opacity: '1' },
          '50%': { opacity: '0' },
        },
      },
    },
  },
  plugins: [require('tailwindcss-animate')],
};

export default config;
```

## Global Styles

Update `app/globals.css`:

```css
@tailwind base;
@tailwind components;
@tailwind utilities;

@layer base {
  :root {
    /* Vercel/Terminal Dark Theme Colors */
    --background: 0 0% 0%;
    --foreground: 0 0% 100%;

    --card: 0 0% 4%;
    --card-hover: 0 0% 7%;
    --border: 0 0% 20%;

    --primary: 211 100% 48%;
    --primary-hover: 211 100% 45%;
    --primary-foreground: 0 0% 100%;

    --secondary: 0 0% 15%;
    --secondary-foreground: 0 0% 100%;

    --muted: 0 0% 15%;
    --muted-foreground: 0 0% 60%;

    --accent: 0 0% 15%;
    --accent-foreground: 0 0% 100%;

    --input: 0 0% 15%;

    --radius: 0.5rem;
  }
}

@layer base {
  * {
    @apply border-border;
  }

  body {
    @apply bg-background text-foreground;
    font-feature-settings: 'rlig' 1, 'calt' 1;
  }
}

@layer utilities {
  /* Terminal prompt styling */
  .terminal-prompt {
    @apply font-mono text-muted-foreground;
  }

  .terminal-prompt::before {
    content: '$ ';
    @apply text-primary;
  }

  /* Code blocks */
  .prose code {
    @apply bg-muted px-1.5 py-0.5 rounded text-sm font-mono;
  }

  .prose pre {
    @apply bg-muted p-4 rounded-lg overflow-x-auto;
  }

  .prose pre code {
    @apply bg-transparent p-0;
  }

  /* Custom scrollbar */
  .custom-scrollbar::-webkit-scrollbar {
    @apply w-2;
  }

  .custom-scrollbar::-webkit-scrollbar-track {
    @apply bg-background;
  }

  .custom-scrollbar::-webkit-scrollbar-thumb {
    @apply bg-muted rounded-full;
  }

  .custom-scrollbar::-webkit-scrollbar-thumb:hover {
    @apply bg-muted-foreground;
  }

  /* Text gradient */
  .text-gradient {
    @apply bg-gradient-to-r from-primary to-primary-hover bg-clip-text text-transparent;
  }

  /* Grid background pattern */
  .grid-pattern {
    background-image: linear-gradient(to right, #80808012 1px, transparent 1px),
      linear-gradient(to bottom, #80808012 1px, transparent 1px);
    background-size: 24px 24px;
  }

  /* Glow effect */
  .glow {
    box-shadow: 0 0 20px rgba(0, 112, 243, 0.3);
  }

  .glow-hover {
    transition: box-shadow 0.3s ease;
  }

  .glow-hover:hover {
    box-shadow: 0 0 30px rgba(0, 112, 243, 0.5);
  }
}
```

## Font Configuration

### Geist Fonts Setup

Install Geist fonts (Vercel's fonts):

```bash
pnpm add geist
```

Update `app/layout.tsx`:

```typescript
import { GeistSans, GeistMono } from 'geist/font';
import './globals.css';

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${GeistSans.variable} ${GeistMono.variable}`}>
      <body>{children}</body>
    </html>
  );
}
```

Or with Next.js font optimization:

```typescript
import { Inter, JetBrains_Mono } from 'next/font/google';
import './globals.css';

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-geist-sans',
  display: 'swap',
});

const jetbrainsMono = JetBrains_Mono({
  subsets: ['latin'],
  variable: '--font-geist-mono',
  display: 'swap',
});

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${inter.variable} ${jetbrainsMono.variable}`}>
      <body>{children}</body>
    </html>
  );
}
```

## Component Styling Patterns

### Terminal-Style Components

```typescript
// Terminal prompt component
export function TerminalPrompt({ command }: { command: string }) {
  return (
    <div className="font-mono">
      <span className="text-primary">$</span>
      <span className="ml-2">{command}</span>
    </div>
  );
}

// File path breadcrumb
export function FilePath({ path }: { path: string }) {
  return (
    <div className="font-mono text-sm text-muted-foreground">
      {path.split('/').map((part, i, arr) => (
        <span key={i}>
          {i > 0 && <span className="mx-1">/</span>}
          <span className={i === arr.length - 1 ? 'text-foreground' : ''}>
            {part || '~'}
          </span>
        </span>
      ))}
    </div>
  );
}
```

### Card Styling

```typescript
// Article card with Vercel-style
export function ArticleCard({ post }: { post: Post }) {
  return (
    <article className="group relative overflow-hidden rounded-lg border border-border bg-card transition-all hover:border-primary/50 hover:shadow-lg hover:shadow-primary/10 hover:glow-hover">
      {/* Content */}
    </article>
  );
}
```

### Button Styling

```typescript
// Terminal-style button
export function TerminalButton({ children, ...props }: ButtonProps) {
  return (
    <Button
      className="font-mono"
      variant="outline"
      {...props}
    >
      {children}
    </Button>
  );
}
```

## Animations

### Typing Animation

```typescript
'use client';

import { useEffect, useRef, useState } from 'react';

export function TypingAnimation({ text }: { text: string }) {
  const [displayedText, setDisplayedText] = useState('');
  const index = useRef(0);

  useEffect(() => {
    const interval = setInterval(() => {
      if (index.current < text.length) {
        setDisplayedText((prev) => prev + text.charAt(index.current));
        index.current += 1;
      } else {
        clearInterval(interval);
      }
    }, 100);

    return () => clearInterval(interval);
  }, [text]);

  return (
    <span className="font-mono">
      {displayedText}
      <span className="animate-blink">|</span>
    </span>
  );
}
```

### Fade In Animation

```css
@keyframes fade-in {
  from {
    opacity: 0;
    transform: translateY(10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.animate-fade-in {
  animation: fade-in 0.3s ease-out;
}
```

## Custom Components

### Code Block with Syntax Highlighting

```typescript
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { vscDarkPlus } from 'react-syntax-highlighter/dist/esm/styles/prism';

export function CodeBlock({ code, language }: { code: string; language: string }) {
  return (
    <div className="rounded-lg border border-border overflow-hidden">
      <div className="bg-muted px-4 py-2 text-sm font-mono text-muted-foreground border-b border-border">
        {language}
      </div>
      <SyntaxHighlighter
        language={language}
        style={vscDarkPlus}
        customStyle={{
          margin: 0,
          borderRadius: '0 0 0.5rem 0.5rem',
        }}
      >
        {code}
      </SyntaxHighlighter>
    </div>
  );
}
```

### Gradient Text

```typescript
export function GradientText({ children }: { children: React.ReactNode }) {
  return (
    <span className="bg-gradient-to-r from-primary to-primary-hover bg-clip-text text-transparent">
      {children}
    </span>
  );
}
```

## Responsive Design Utilities

```typescript
// Container utility
export function Container({ children, className }: { children: React.ReactNode; className?: string }) {
  return (
    <div className={cn('container px-4 md:px-6', className)}>
      {children}
    </div>
  );
}
```

## Theme Enforcement

Ensure dark mode is always active:

```typescript
// app/layout.tsx
export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning className="dark">
      <body>{children}</body>
    </html>
  );
}
```

Or with next-themes:

```typescript
<ThemeProvider attribute="class" defaultTheme="dark" forcedTheme="dark" enableSystem={false}>
  {children}
</ThemeProvider>
```

## Next Steps

- [ ] Implement admin panel customization
- [ ] Implement performance optimization
- [ ] Test responsive design across breakpoints
