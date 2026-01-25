import Image from 'next/image'
import Link from 'next/link'
import type { Metadata } from 'next'
import { getRecentPosts } from '@/app/actions/posts'
import { PostGrid } from '@/components/posts/post-grid'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Kbd } from '@/components/ui/kbd'
import { ArrowRight, Terminal, ChevronRight, FileText } from 'lucide-react'

export const metadata: Metadata = {
  title: 'Home',
  description: 'Blog of David Pereira - Python, Next.js, React, TypeScript developer and creator of Developers Secrets and Nesalia Inc',
}

export default async function HomePage() {
  const recentPosts = await getRecentPosts(6)

  return (
    <div className="bg-background">
      {/* Hero Section - Terminal Style */}
      <section className="bg-background">
        {/* Terminal Window Header */}
        <div className="mx-auto max-w-5xl border-x border-border">
          <div className="flex items-center gap-2 border-b border-border bg-muted/20 px-3 py-2">
            <div className="flex gap-1.5">
              <div className="h-3 w-3 rounded-full bg-muted-foreground/60" />
              <div className="h-3 w-3 rounded-full bg-muted-foreground/40" />
              <div className="h-3 w-3 rounded-full bg-muted-foreground/20" />
            </div>
            <div className="ml-4 flex-1 font-mono text-xs text-muted-foreground">
              ~/blog/home
            </div>
          </div>

          {/* Terminal Prompt Header */}
          <div className="px-4 sm:px-6 lg:px-8 py-6 font-mono text-sm">
            <div className="flex items-center gap-2 text-muted-foreground">
              <Kbd className="bg-muted">$</Kbd>
              <span>david@blog</span>
              <span className="text-foreground">:</span>
              <span className="text-foreground">~</span>
              <span className="text-foreground">./welcome.sh</span>
            </div>
          </div>

          <div className="px-4 sm:px-6 lg:px-8 pb-12">
            <div className="flex flex-col items-center gap-8 lg:flex-row lg:gap-12 lg:items-start">
              <div className="flex-1">
                {/* Title with terminal decorations */}
                <div className="mb-6">
                  <div className="mb-4 font-mono text-xs text-muted-foreground">
                    <Badge variant="outline" className="font-mono">v1.0.0</Badge>
                    <span className="ml-2">{`// WELCOME_MESSAGE`}</span>
                  </div>
                  <h1 className="font-mono text-3xl font-bold tracking-tight sm:text-4xl lg:text-5xl">
                    <span className="text-muted-foreground">{'>'}</span>
                    <span className="ml-2 text-foreground break-words">David_Pereira</span>
                    <span className="animate-pulse">_</span>
                  </h1>
                </div>

                <p className="mb-2 font-mono text-sm text-muted-foreground break-words">
                  <span>const</span>
                  <span className="text-foreground"> mission = </span>
                  <span className="text-foreground">&quot;Creating a generation of exceptional developers&quot;</span>
                </p>
                <p className="mb-6 font-mono text-sm text-muted-foreground break-words">
                  <span>through</span>
                  <span className="text-foreground"> Developers Secrets &amp; Nesalia Inc</span>
                  <span className="text-foreground">;</span>
                </p>

                {/* Tech Stack */}
                <div className="mb-8 space-y-2">
                  <p className="font-mono text-xs text-muted-foreground">
                    <span className="text-foreground">export const</span>
                    <span className="text-foreground"> stack = </span>
                    <span className="text-foreground">[</span>
                  </p>
                  <div className="flex flex-wrap gap-2 pl-4">
                    <Badge variant="secondary" className="font-mono text-xs">&quot;Python&quot;</Badge>
                    <Badge variant="secondary" className="font-mono text-xs">&quot;TypeScript&quot;</Badge>
                    <Badge variant="secondary" className="font-mono text-xs">&quot;React&quot;</Badge>
                    <Badge variant="secondary" className="font-mono text-xs">&quot;Next.js&quot;</Badge>
                    <Badge variant="secondary" className="font-mono text-xs">&quot;Node.js&quot;</Badge>
                  </div>
                  <p className="font-mono text-xs text-muted-foreground">
                    <span className="text-foreground">];</span>
                  </p>
                </div>

                <div className="flex flex-col sm:flex-row flex-wrap justify-center gap-3 lg:justify-start">
                  <Button size="default" className="font-mono w-full sm:w-auto" asChild>
                    <Link href="/blog">
                      <Terminal className="mr-2 h-4 w-4" />
                      ./browse_articles.sh
                      <ArrowRight className="ml-2 h-4 w-4 sm:h-5 sm:w-5" />
                    </Link>
                  </Button>
                  <Button size="default" variant="outline" className="font-mono w-full sm:w-auto" asChild>
                    <Link href="/about">
                      ./about_me.sh
                      <ArrowRight className="ml-2 h-4 w-4 sm:h-5 sm:w-5" />
                    </Link>
                  </Button>
                </div>
              </div>

              {/* Terminal-style profile */}
              <div className="flex-shrink-0 w-full max-w-[280px] lg:ml-8 lg:max-w-[280px]">
                <div className="relative overflow-hidden border-2 border-border bg-background">
                  <div className="border-b border-border bg-muted/50 px-3 py-2 font-mono text-xs text-muted-foreground">
                    <div className="flex items-center gap-2">
                      <Terminal className="h-3 w-3" />
                      <span>whoami</span>
                    </div>
                  </div>
                  <div className="px-4 py-4">
                    <div className="relative mx-auto aspect-square w-full max-w-[180px] overflow-hidden rounded-full border-2 border-border sm:max-w-[200px]">
                      <Image
                        src="/me.png"
                        alt="David Pereira"
                        fill
                        className="object-cover"
                        priority
                        sizes="(max-width: 640px) 180px, (max-width: 1024px) 200px, 200px"
                      />
                    </div>
                    <div className="mt-4 font-mono text-xs">
                      <div className="flex items-center gap-2 text-muted-foreground">
                        <ChevronRight className="h-3 w-3 shrink-0" />
                        <span className="shrink-0">name:</span>
                        <span className="text-foreground break-words">&quot;David Pereira&quot;</span>
                      </div>
                      <div className="mt-1 flex items-center gap-2 text-muted-foreground">
                        <ChevronRight className="h-3 w-3 shrink-0" />
                        <span className="shrink-0">role:</span>
                        <span className="text-foreground break-words">&quot;Full-Stack Developer&quot;</span>
                      </div>
                      <div className="mt-1 flex items-center gap-2 text-muted-foreground">
                        <ChevronRight className="h-3 w-3 shrink-0" />
                        <span className="shrink-0">status:</span>
                        <Badge variant="secondary" className="text-[10px]">ONLINE</Badge>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Latest Posts - Terminal Style */}
      <section className="mx-auto max-w-5xl border-x border-t border-border bg-background">
        {/* Section Header */}
        <div>
          <div className="flex items-center gap-3 border-b border-border bg-muted/20 px-3 py-2">
            <FileText className="h-4 w-4 text-muted-foreground" />
            <div className="flex-1 font-mono text-xs text-muted-foreground">
              ~/posts/
            </div>
          </div>
        </div>
        <div>
          <PostGrid posts={recentPosts} />
        </div>
      </section>

      {/* Newsletter CTA - Terminal Style */}
      <section className="mx-auto max-w-5xl border-x border-t border-b border-border bg-background px-4 py-12 sm:px-6 lg:px-8">
        <div className="border-2 border-dashed border-border bg-muted/20 p-6 sm:p-8">
          <div className="mx-auto max-w-2xl text-center">
            {/* Terminal prompt */}
            <div className="mb-4 font-mono text-xs">
              <div className="inline-flex items-center gap-2 rounded-t-lg border border-border bg-muted px-2 sm:px-3 py-2 max-w-full overflow-hidden">
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
