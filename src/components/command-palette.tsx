'use client'

import * as React from 'react'
import { useRouter } from 'next/navigation'
import { getPosts } from '@/app/actions/posts'
import { Dialog, DialogContent, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Kbd } from '@/components/ui/kbd'
import { Input } from '@/components/ui/input'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Search, Terminal, FileText, ChevronRight } from 'lucide-react'

interface Post {
  id: number
  title: string
  slug: string
  excerpt?: string | null
  readingTime?: number | null
}

export function CommandPalette() {
  const [open, setOpen] = React.useState(false)
  const [query, setQuery] = React.useState('')
  const [posts, setPosts] = React.useState<Post[]>([])
  const [loading, setLoading] = React.useState(false)
  const router = useRouter()
  const inputRef = React.useRef<HTMLInputElement>(null)

  React.useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if (e.key === 'k' && (e.metaKey || e.ctrlKey)) {
        e.preventDefault()
        setOpen((open) => !open)
      }
    }

    document.addEventListener('keydown', down)
    return () => document.removeEventListener('keydown', down)
  }, [open])

  React.useEffect(() => {
    if (open) {
      const fetchPosts = async () => {
        setLoading(true)
        try {
          const fetchedPosts = await getPosts({ limit: 100 })
          setPosts(fetchedPosts)
        } catch (error) {
          console.error('Failed to fetch posts:', error)
        } finally {
          setLoading(false)
        }
      }

      fetchPosts()
    }
  }, [open])

  const filteredPosts = React.useMemo(() => {
    return posts.filter((post) =>
      post.title.toLowerCase().includes(query.toLowerCase())
    )
  }, [posts, query])

  React.useEffect(() => {
    if (open && inputRef.current) {
      inputRef.current.focus()
    }
  }, [open])

  const handlePostClick = (slug: string) => {
    setOpen(false)
    router.push(`/blog/${slug}`)
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm" className="hidden md:inline-flex items-center gap-2">
          <span>Search</span>
          <Kbd className="bg-muted">
            <span className="ml-1 items-center gap-1 hidden sm:inline-flex">
              <span>⌘</span>
              <span className="text-xs">K</span>
            </span>
          </Kbd>
        </Button>
      </DialogTrigger>
      <DialogContent className="overflow-hidden p-0" showCloseButton={false}>
        <DialogTitle className="sr-only">Search articles</DialogTitle>
        <div className="flex items-center gap-2 border-b border-border px-4 py-3">
          <Search className="h-4 w-4 text-muted-foreground shrink-0" />
          <Input
            ref={inputRef}
            placeholder="Search articles..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="border-0 focus-visible:ring-0 focus:ring-0 font-mono flex-1"
          />
          <Kbd className="hidden sm:inline-block bg-muted shrink-0">
            <span>ESC</span>
          </Kbd>
        </div>

        <ScrollArea className="max-h-[60vh]">
          <div className="p-2">
            {loading ? (
              <div className="py-8 text-center text-sm text-muted-foreground font-mono">
                <div className="flex items-center justify-center gap-2">
                  <Terminal className="h-4 w-4 animate-pulse" />
                  <span>Fetching posts...</span>
                </div>
              </div>
            ) : filteredPosts.length === 0 ? (
              <div className="py-8 text-center text-sm text-muted-foreground font-mono">
                <div className="flex items-center justify-center gap-2">
                  <Terminal className="h-4 w-4" />
                  <span>No results found</span>
                </div>
              </div>
            ) : (
              <div className="space-y-1">
                <div className="px-2 py-1 text-xs font-mono text-muted-foreground">
                  {filteredPosts.length} {filteredPosts.length === 1 ? 'result' : 'results'}
                </div>
                {filteredPosts.map((post) => (
                  <button
                    key={post.id}
                    onClick={() => handlePostClick(post.slug)}
                    className="flex items-start gap-3 rounded-md px-3 py-2 text-left text-sm hover:bg-muted transition-colors w-full"
                  >
                    <FileText className="h-4 w-4 mt-0.5 text-muted-foreground" />
                    <div className="flex-1 min-w-0">
                      <div className="font-mono font-medium">{post.title}</div>
                      {post.excerpt && (
                        <div className="mt-1 line-clamp-1 text-xs text-muted-foreground">
                          {post.excerpt}
                        </div>
                      )}
                    </div>
                    <ChevronRight className="h-4 w-4 text-muted-foreground" />
                  </button>
                ))}
              </div>
            )}
          </div>
        </ScrollArea>

        <div className="flex items-center justify-between border-t border-border bg-muted/20 px-4 py-2 text-xs text-muted-foreground font-mono">
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-1">
              <Kbd className="bg-background">↑↓</Kbd>
              <span>to navigate</span>
            </div>
            <div className="flex items-center gap-1">
              <Kbd className="bg-background">↵</Kbd>
              <span>to select</span>
            </div>
            <div className="flex items-center gap-1">
              <Kbd className="bg-background">esc</Kbd>
              <span>to close</span>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
