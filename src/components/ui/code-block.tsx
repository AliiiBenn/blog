'use client'

import { cn } from '@/lib/utils'
import { Check, Copy, Terminal } from 'lucide-react'
import type React from 'react'
import { useEffect, useState } from 'react'
import { codeToHtml } from 'shiki'

export type CodeBlockProps = {
  children?: React.ReactNode
  className?: string
} & React.HTMLProps<HTMLDivElement>

export function CodeBlock({ children, className, ...props }: CodeBlockProps) {
  return (
    <figure
      className={cn(
        'my-6 rounded-md border-2 border-border bg-background overflow-hidden text-sm',
        className,
      )}
      {...props}
    >
      {children}
    </figure>
  )
}

export type CodeBlockCodeProps = {
  code: string
  language?: string
  theme?: string
  className?: string
  filename?: string
} & React.HTMLProps<HTMLDivElement>

export function CodeBlockCode({
  code,
  language = 'text',
  theme = 'github-dark',
  className,
  filename,
  ...props
}: CodeBlockCodeProps) {
  const [highlightedHtml, setHighlightedHtml] = useState<string | null>(null)
  const [copied, setCopied] = useState(false)

  useEffect(() => {
    async function highlight() {
      try {
        const html = await codeToHtml(code, { lang: language as keyof typeof import('shiki/langs'), theme })
        setHighlightedHtml(html)
      } catch {
        // Fallback to plain text if language is not supported
        const html = await codeToHtml(code, { lang: 'text', theme })
        setHighlightedHtml(html)
      }
    }
    highlight()
  }, [code, language, theme])

  const handleCopy = async () => {
    await navigator.clipboard.writeText(code)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const classNames = cn(
    'text-xs sm:text-sm p-4 overflow-auto max-h-[400px] sm:max-h-[600px] [&>pre]:!bg-transparent [&>pre>code]:!bg-transparent',
    className,
  )

  return (
    <>
      {(filename || language) && (
        <div className="flex items-center justify-between px-3 py-2 bg-muted/80 border-b border-border/40 text-xs text-muted-foreground font-mono">
          <div className="flex items-center gap-2 text-xs uppercase">
            <Terminal className="h-3.5 w-3.5" />
            <span>{filename || language}</span>
          </div>
          <button
            type="button"
            className="inline-flex items-center justify-center rounded-md p-1.5 text-xs font-medium transition-colors hover:bg-muted disabled:pointer-events-none disabled:opacity-50"
            aria-label="Copy Text"
            onClick={handleCopy}
          >
            {copied ? <Check className="h-3.5 w-3.5" /> : <Copy className="h-3.5 w-3.5" />}
          </button>
        </div>
      )}
      {highlightedHtml ? (
        <div
          className={classNames}
          dangerouslySetInnerHTML={{ __html: highlightedHtml }}
          {...props}
        />
      ) : (
        <div className={classNames} {...props}>
          <pre className="min-w-full w-max">
            <code className="font-mono">{code}</code>
          </pre>
        </div>
      )}
    </>
  )
}
