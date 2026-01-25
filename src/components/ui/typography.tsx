import { cn } from '@/lib/utils'

// Typography components with terminal style

export function TypographyH1({ className, ...props }: React.HTMLAttributes<HTMLHeadingElement>) {
  return (
    <h1
      className={cn('font-mono text-3xl font-bold sm:text-4xl lg:text-5xl mb-4', className)}
      {...props}
    />
  )
}

export function TypographyH2({ className, ...props }: React.HTMLAttributes<HTMLHeadingElement>) {
  return (
    <h2
      className={cn('font-mono text-2xl font-bold sm:text-3xl lg:text-4xl mb-3 mt-8 border-b border-border pb-2', className)}
      {...props}
    />
  )
}

export function TypographyH3({ className, ...props }: React.HTMLAttributes<HTMLHeadingElement>) {
  return (
    <h3
      className={cn('font-mono text-xl font-bold sm:text-2xl lg:text-3xl mb-2 mt-6', className)}
      {...props}
    />
  )
}

export function TypographyH4({ className, ...props }: React.HTMLAttributes<HTMLHeadingElement>) {
  return (
    <h4
      className={cn('font-mono text-lg font-bold sm:text-xl lg:text-2xl mb-2 mt-4', className)}
      {...props}
    />
  )
}

export function TypographyP({ className, ...props }: React.HTMLAttributes<HTMLParagraphElement>) {
  return (
    <p
      className={cn('font-mono text-sm sm:text-base text-foreground leading-7 mb-4 [&:not(:first-child)]:mt-4 break-words', className)}
      {...props}
    />
  )
}

export function TypographyBlockquote({ className, ...props }: React.HTMLAttributes<HTMLQuoteElement>) {
  return (
    <blockquote
      className={cn('font-mono text-sm text-muted-foreground border-l-2 border-border pl-4 my-4 italic', className)}
      {...props}
    />
  )
}

export function TypographyList({ className, ...props }: React.HTMLAttributes<HTMLUListElement>) {
  return (
    <ul
      className={cn('font-mono text-sm text-foreground my-4 ml-6 list-disc space-y-1', className)}
      {...props}
    />
  )
}

export function TypographyOL({ className, ...props }: React.HTMLAttributes<HTMLOListElement>) {
  return (
    <ol
      className={cn('font-mono text-sm text-foreground my-4 ml-6 list-decimal space-y-1', className)}
      {...props}
    />
  )
}

export function TypographyInlineCode({ className, ...props }: React.HTMLAttributes<HTMLElement>) {
  return (
    <code
      className={cn('font-mono text-xs bg-muted/50 border border-border rounded px-1.5 py-0.5 text-foreground', className)}
      {...props}
    />
  )
}

export function TypographyLead({ className, ...props }: React.HTMLAttributes<HTMLParagraphElement>) {
  return (
    <p
      className={cn('font-mono text-base text-muted-foreground', className)}
      {...props}
    />
  )
}

export function TypographyLarge({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn('font-mono text-lg font-semibold', className)}
      {...props}
    />
  )
}

export function TypographySmall({ className, ...props }: React.HTMLAttributes<HTMLElement>) {
  return (
    <small
      className={cn('font-mono text-xs', className)}
      {...props}
    />
  )
}

export function TypographyMuted({ className, ...props }: React.HTMLAttributes<HTMLParagraphElement>) {
  return (
    <p
      className={cn('font-mono text-xs text-muted-foreground', className)}
      {...props}
    />
  )
}

export function TypographyTable({ className, ...props }: React.HTMLAttributes<HTMLTableElement>) {
  return (
    <div className={cn('my-6 w-full overflow-x-auto', className)}>
      <table className="w-full font-mono text-sm" {...props} />
    </div>
  )
}

export function TypographyAnchor({ className, href, ...props }: React.HTMLAttributes<HTMLAnchorElement> & { href?: string }) {
  return (
    <a
      href={href}
      className={cn('font-mono text-sm underline underline-offset-2 text-primary hover:text-primary/80 transition-colors', className)}
      {...props}
    />
  )
}

export function TypographyHr({ className, ...props }: React.HTMLAttributes<HTMLHRElement>) {
  return (
    <hr
      className={cn('my-6 border-border', className)}
      {...props}
    />
  )
}

export function TypographyStrong({ className, ...props }: React.HTMLAttributes<HTMLElement>) {
  return (
    <strong
      className={cn('font-semibold', className)}
      {...props}
    />
  )
}
