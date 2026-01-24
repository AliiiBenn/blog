'use client'

import Image from 'next/image'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Menu } from 'lucide-react'
import { useAppStore } from '@/lib/store'

export function Header() {
  const { setIsMobileMenuOpen } = useAppStore()

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center justify-between">
        <Link href="/" className="flex items-center space-x-2">
          <div className="relative size-8">
            <Image src="/icon.svg" alt="Blog" fill className="object-contain" />
          </div>
          <span className="text-xl font-bold">Blog</span>
        </Link>

        <nav className="hidden md:flex items-center gap-6">
          <Link
            href="/"
            className="text-sm font-medium transition-colors hover:text-primary"
          >
            Home
          </Link>
          <Link
            href="/blog"
            className="text-sm font-medium transition-colors hover:text-primary"
          >
            Blog
          </Link>
          <Link
            href="/about"
            className="text-sm font-medium transition-colors hover:text-primary"
          >
            About
          </Link>
        </nav>

        <div className="flex items-center gap-4">
          <Button variant="outline" size="sm" className="hidden md:flex" asChild>
            <Link href="/search">Search</Link>
          </Button>

          <Button
            variant="ghost"
            size="icon"
            className="md:hidden"
            onClick={() => setIsMobileMenuOpen(true)}
          >
            <Menu className="h-5 w-5" />
            <span className="sr-only">Toggle menu</span>
          </Button>
        </div>
      </div>
    </header>
  )
}
