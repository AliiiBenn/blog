import type { Metadata } from 'next'
import { getRecentPosts } from '@/app/actions/posts'
import { PostGrid } from '@/components/posts/post-grid'
import RotatingEarth from '@/components/rotating-earth'
import { SquareBorderGrid } from '@/components/square-border-grid'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Kbd } from '@/components/ui/kbd'

export const metadata: Metadata = {
  title: 'Home',
  description: 'Blog of David Pereira - Python, Next.js, React, TypeScript developer and creator of Developers Secrets and Nesalia Inc',
}

export default async function HomePage() {
  const recentPosts = await getRecentPosts(6)

  return (
    <div className="bg-background py-8 sm:py-12 lg:py-16 relative">
      {/* Hero Section */}
      <section className="bg-background">
        <div className="mx-auto max-w-5xl max-h-[80rem] border-x border-t border-border pt-24 pb-12 relative overflow-hidden">
          {/* Top left corner decoration */}
          <div className="absolute top-0 left-0 -translate-x-1/2 -translate-y-1/2 pointer-events-none">
            <div className="relative w-6 h-6 opacity-50">
              <div className="absolute top-1/2 left-0 right-0 h-px bg-foreground -translate-y-1/2"></div>
              <div className="absolute left-1/2 top-0 bottom-0 w-px bg-foreground -translate-x-1/2"></div>
            </div>
          </div>

          {/* Squares grid border */}
          <SquareBorderGrid className="z-10" targetSquares={10} />

          <div className="text-center mb-8">
            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold tracking-tight text-foreground mb-3">
              In the endless pursuit of achieving greatness
            </h1>
            <p className="text-base sm:text-lg text-muted-foreground max-w-2xl mx-auto mb-6">
              Exploring the intersection of technology, innovation, and continuous growth
            </p>

            {/* Separator */}
            <div className="flex items-center justify-center gap-4">
              <div className="h-px w-16 bg-border/30" />
              <div className="w-1 h-1 bg-border/30 rounded-full" />
              <div className="h-px w-16 bg-border/30" />
            </div>
          </div>

          <div className="flex justify-center">
            <RotatingEarth width={700} height={525} />
          </div>
        </div>
      </section>

      {/* Spacer */}
      <section className="mx-auto max-w-5xl h-4 border-x border-t border-border" />

      {/* Latest Posts - Terminal Style */}
      <section className="mx-auto max-w-5xl border-x border-t border-border bg-background">
        <PostGrid posts={recentPosts} />
      </section>

      {/* Newsletter CTA - Terminal Style */}
      <section className="mx-auto max-w-5xl border-x border-t border-b border-border bg-background py-12 relative">
        {/* Bottom right corner decoration */}
        <div className="absolute bottom-0 right-0 translate-x-1/2 translate-y-1/2 pointer-events-none">
          <div className="relative w-6 h-6 opacity-50">
            <div className="absolute top-1/2 left-0 right-0 h-px bg-foreground -translate-y-1/2"></div>
            <div className="absolute left-1/2 top-0 bottom-0 w-px bg-foreground -translate-x-1/2"></div>
          </div>
        </div>

        <div className="border-2 border-dashed border-border bg-muted/20 p-8">
          <div className="mx-auto max-w-2xl text-center">
            {/* Terminal prompt */}
            <div className="mb-4 font-mono text-xs">
              <div className="inline-flex items-center gap-2 border border-border bg-muted px-2 py-2 max-w-full overflow-hidden">
                <Kbd className="bg-background">$</Kbd>
                <span className="text-muted-foreground truncate">curl --subscribe newsletter</span>
                <span className="animate-pulse shrink-0">_</span>
              </div>
            </div>
            <h2 className="mb-4 font-mono text-lg sm:text-xl font-bold">
              <span className="text-muted-foreground">TODO:</span>
              <span className="ml-2 text-foreground break-words">Stay Updated</span>
            </h2>
            <p className="mb-6 font-mono text-sm text-muted-foreground">
              {/* Get the latest articles delivered straight to your inbox */}
            </p>
            <Button size="default" disabled className="font-mono w-full sm:w-auto">
              <span className="text-muted-foreground">[ ]</span>
              <span className="ml-2 truncate">Subscribe to Newsletter</span>
              <Badge variant="secondary" className="ml-2 text-xs shrink-0">WIP</Badge>
            </Button>
          </div>
        </div>
      </section>
    </div>
  )
}
