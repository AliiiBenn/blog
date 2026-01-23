# Layout Components

## Overview

Create shared layout components used across all pages: Header, Footer, and Theme Provider.

## Theme Provider

Create `components/layout/theme-provider.tsx`:

```typescript
'use client';

import { ThemeProvider as NextThemesProvider } from 'next-themes';
import { type ThemeProviderProps } from 'next-themes/dist/types';

export function ThemeProvider({ children, ...props }: ThemeProviderProps) {
  return <NextThemesProvider {...props}>{children}</NextThemesProvider>;
}
```

Update `app/layout.tsx` to include ThemeProvider:

```typescript
import { ThemeProvider } from '@/components/layout/theme-provider';

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body>
        <ThemeProvider attribute="class" defaultTheme="dark" forcedTheme="dark">
          {children}
        </ThemeProvider>
      </body>
    </html>
  );
}
```

## Header Component

Create `components/layout/header.tsx`:

```typescript
import Link from 'next/link';
import { Search, Menu } from 'lucide-react';

export function Header() {
  return (
    <header className="sticky top-0 z-50 w-full border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center justify-between">
        {/* Logo */}
        <Link href="/" className="flex items-center space-x-2">
          <span className="font-mono text-xl font-bold text-primary">$ blog</span>
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center space-x-6">
          <Link href="/" className="text-sm font-mono hover:text-primary transition-colors">
            ~/home
          </Link>
          <Link href="/blog" className="text-sm font-mono hover:text-primary transition-colors">
            ~/blog
          </Link>
          <Link href="/about" className="text-sm font-mono hover:text-primary transition-colors">
            ~/about
          </Link>
        </nav>

        {/* Right side */}
        <div className="flex items-center space-x-4">
          <Link href="/search" className="hidden md:block">
            <Search className="h-5 w-5 hover:text-primary transition-colors" />
          </Link>
          <button className="md:hidden">
            <Menu className="h-5 w-5" />
          </button>
        </div>
      </div>
    </header>
  );
}
```

## Footer Component

Create `components/layout/footer.tsx`:

```typescript
import Link from 'next/link';

export function Footer() {
  return (
    <footer className="border-t border-border py-8 md:py-12">
      <div className="container">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand */}
          <div className="md:col-span-2">
            <span className="font-mono text-lg font-bold">$ blog</span>
            <p className="mt-2 text-sm text-muted-foreground">
              A personal blog about technology, coding, and everything in between.
            </p>
          </div>

          {/* Navigation */}
          <div>
            <h3 className="font-mono text-sm font-semibold mb-4">Navigation</h3>
            <ul className="space-y-2">
              <li>
                <Link href="/" className="text-sm text-muted-foreground hover:text-primary transition-colors">
                  ~/home
                </Link>
              </li>
              <li>
                <Link href="/blog" className="text-sm text-muted-foreground hover:text-primary transition-colors">
                  ~/blog
                </Link>
              </li>
              <li>
                <Link href="/about" className="text-sm text-muted-foreground hover:text-primary transition-colors">
                  ~/about
                </Link>
              </li>
            </ul>
          </div>

          {/* Social */}
          <div>
            <h3 className="font-mono text-sm font-semibold mb-4">Connect</h3>
            <ul className="space-y-2">
              <li>
                <a href="https://github.com" className="text-sm text-muted-foreground hover:text-primary transition-colors">
                  GitHub
                </a>
              </li>
              <li>
                <a href="https://twitter.com" className="text-sm text-muted-foreground hover:text-primary transition-colors">
                  Twitter
                </a>
              </li>
              <li>
                <a href="/rss" className="text-sm text-muted-foreground hover:text-primary transition-colors">
                  RSS
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* Copyright */}
        <div className="mt-8 pt-8 border-t border-border text-center text-sm text-muted-foreground">
          <p className="font-mono">
            © {new Date().getFullYear()}. Built with Next.js and PayloadCMS.
          </p>
        </div>
      </div>
    </footer>
  );
}
```

## Container Component (Optional)

Create `components/layout/container.tsx`:

```typescript
import { cn } from '@/lib/utils';

interface ContainerProps {
  children: React.ReactNode;
  className?: string;
}

export function Container({ children, className }: ContainerProps) {
  return (
    <div className={cn('container px-4 md:px-6', className)}>
      {children}
    </div>
  );
}
```

## Usage in Root Layout

Update `app/layout.tsx`:

```typescript
import { Header } from '@/components/layout/header';
import { Footer } from '@/components/layout/footer';
import { ThemeProvider } from '@/components/layout/theme-provider';

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body>
        <ThemeProvider attribute="class" defaultTheme="dark" forcedTheme="dark">
          <div className="min-h-screen flex flex-col">
            <Header />
            <main className="flex-1">{children}</main>
            <Footer />
          </div>
        </ThemeProvider>
      </body>
    </html>
  );
}
```

## Responsive Navigation (Mobile)

Create a mobile menu component (client component):

Create `components/layout/mobile-menu.tsx`:

```typescript
'use client';

import { useState } from 'react';
import Link from 'next/link';
import { X, Menu } from 'lucide-react';
import { Button } from '@/components/ui/button';

export function MobileMenu() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <Button
        variant="ghost"
        size="icon"
        className="md:hidden"
        onClick={() => setIsOpen(!isOpen)}
      >
        {isOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
      </Button>

      {isOpen && (
        <div className="fixed inset-0 z-50 bg-background md:hidden">
          <nav className="flex flex-col items-center justify-center h-full space-y-8">
            <Link
              href="/"
              onClick={() => setIsOpen(false)}
              className="text-2xl font-mono hover:text-primary transition-colors"
            >
              ~/home
            </Link>
            <Link
              href="/blog"
              onClick={() => setIsOpen(false)}
              className="text-2xl font-mono hover:text-primary transition-colors"
            >
              ~/blog
            </Link>
            <Link
              href="/about"
              onClick={() => setIsOpen(false)}
              className="text-2xl font-mono hover:text-primary transition-colors"
            >
              ~/about
            </Link>
            <Link
              href="/search"
              onClick={() => setIsOpen(false)}
              className="text-2xl font-mono hover:text-primary transition-colors"
            >
              ~/search
            </Link>
          </nav>
        </div>
      )}
    </>
  );
}
```

Update Header to use MobileMenu:

```typescript
import { MobileMenu } from '@/components/layout/mobile-menu';

// In Header component, replace the menu button:
<MobileMenu />
```

## Next Steps

- [ ] Create blog-specific components
- [ ] Create homepage components
- [ ] Implement pages
