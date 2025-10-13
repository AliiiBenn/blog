'use client'

import * as React from 'react'
import Link from 'next/link'
import { Eclipse, Search } from 'lucide-react'
import {
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from '@/components/ui/command'
const menuItems = [
  { name: 'Pricing', href: 'pricing' },
  { name: 'Docs', href: 'docs' },
  { name: 'About', href: 'about' },
]

export const AppHeader = () => {
  const [open, setOpen] = React.useState(false)

  return (
    <header>
      <nav className="fixed z-20 w-full border-b border-dashed bg-white backdrop-blur md:relative dark:bg-zinc-950/50 lg:dark:bg-transparent">
        <div className="m-auto max-w-5xl px-6">
          <div className="flex flex-wrap items-center justify-between gap-6 py-3 lg:gap-0">
            <div className="flex items-center gap-8">
              <Eclipse className="size-6" />
              <ul className="hidden text-base lg:flex lg:gap-8 lg:text-sm">
                {menuItems.map((item, index) => (
                  <li key={index}>
                    <Link
                      href={item.href}
                      className="text-muted-foreground hover:text-accent-foreground duration-150"
                    >
                      <span>{item.name}</span>
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            <div className="bg-background in-data-[state=active]:block lg:in-data-[state=active]:flex mb-6 hidden w-full flex-wrap items-center justify-end space-y-8 rounded-3xl border p-6 shadow-2xl shadow-zinc-300/20 md:flex-nowrap lg:m-0 lg:flex lg:w-fit lg:gap-6 lg:space-y-0 lg:border-transparent lg:bg-transparent lg:p-0 lg:shadow-none dark:shadow-none dark:lg:bg-transparent">
              <div className="flex items-center">
                <button
                  className="inline-flex h-9 w-fit rounded-md border border-input bg-background px-3 py-2 text-sm text-foreground shadow-xs transition-[color,box-shadow] outline-none placeholder:text-muted-foreground/70 focus-visible:border-ring focus-visible:ring-[3px] focus-visible:ring-ring/50"
                  onClick={() => setOpen(true)}
                >
                  <span className="flex grow items-center">
                    <Search
                      className="-ms-1 me-3 text-muted-foreground/80"
                      size={16}
                      aria-hidden="true"
                    />
                    <span className="font-normal text-muted-foreground/70">Search</span>
                  </span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </nav>

      <CommandDialog open={open} onOpenChange={setOpen}>
        <CommandInput placeholder="Type a command or search..." />
        <CommandList>
          <CommandEmpty>No results found.</CommandEmpty>
          <CommandGroup heading="Navigation">
            <CommandItem>
              <Link href="/pricing" className="w-full">
                <span>Pricing</span>
              </Link>
            </CommandItem>
            <CommandItem>
              <Link href="/docs" className="w-full">
                <span>Documentation</span>
              </Link>
            </CommandItem>
            <CommandItem>
              <Link href="/about" className="w-full">
                <span>About</span>
              </Link>
            </CommandItem>
            <CommandItem>
              <Link href="/blog" className="w-full">
                <span>Blog</span>
              </Link>
            </CommandItem>
            <CommandItem>
              <Link href="/contact" className="w-full">
                <span>Contact</span>
              </Link>
            </CommandItem>
          </CommandGroup>
        </CommandList>
      </CommandDialog>
    </header>
  )
}
