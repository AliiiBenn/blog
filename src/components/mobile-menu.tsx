'use client'

import Link from 'next/link'
import { X } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { useAppStore } from '@/lib/store'
import { useEffect } from 'react'

export function MobileMenu() {
  const { isMobileMenuOpen: isOpen, setIsMobileMenuOpen: setIsOpen } = useAppStore()

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = ''
    }

    return () => {
      document.body.style.overflow = ''
    }
  }, [isOpen])

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50 md:hidden">
      <div className="fixed inset-0 bg-background/80 backdrop-blur-sm" onClick={() => setIsOpen(false)} />

      <div className="fixed inset-y-0 right-0 w-full max-w-sm bg-background p-6 shadow-lg">
        <div className="flex items-center justify-between mb-8">
          <span className="text-lg font-semibold">Menu</span>
          <Button variant="ghost" size="icon" onClick={() => setIsOpen(false)}>
            <X className="h-5 w-5" />
            <span className="sr-only">Close menu</span>
          </Button>
        </div>

        <nav className="flex flex-col space-y-4">
          <Link
            href="/"
            className="text-lg font-medium transition-colors hover:text-primary"
            onClick={() => setIsOpen(false)}
          >
            Home
          </Link>
          <Link
            href="/blog"
            className="text-lg font-medium transition-colors hover:text-primary"
            onClick={() => setIsOpen(false)}
          >
            Blog
          </Link>
          <Link
            href="/search"
            className="text-lg font-medium transition-colors hover:text-primary"
            onClick={() => setIsOpen(false)}
          >
            Search
          </Link>
          <Link
            href="/about"
            className="text-lg font-medium transition-colors hover:text-primary"
            onClick={() => setIsOpen(false)}
          >
            About
          </Link>
        </nav>
      </div>
    </div>
  )
}
