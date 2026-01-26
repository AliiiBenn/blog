'use client'

import { Copy, Check } from 'lucide-react'
import { useState } from 'react'
import { usePathname } from 'next/navigation'

export function CopyUrlButton({ className }: { className?: string }) {
  const [copied, setCopied] = useState(false)
  const pathname = usePathname()

  const handleCopy = async () => {
    const url = typeof window !== 'undefined'
      ? window.location.origin + pathname
      : pathname

    await navigator.clipboard.writeText(url)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <button
      onClick={handleCopy}
      className={`inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors ${className || ''}`}
      title={copied ? 'Copied!' : 'Copy URL'}
    >
      {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
      <span>{copied ? 'Copied!' : 'Copy'}</span>
    </button>
  )
}
