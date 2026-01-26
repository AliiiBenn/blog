import { cn } from '@/lib/utils'

// Typography components with modern, readable styling

export function TypographyH1({ className, ...props }: React.HTMLAttributes<HTMLHeadingElement>) {
  return (
    <h1
      className={cn('scroll-m-20 text-4xl font-bold tracking-tight lg:text-5xl mb-6', className)}
      {...props}
    />
  )
}

export function TypographyH2({ className, ...props }: React.HTMLAttributes<HTMLHeadingElement>) {
  return (
    <h2
      className={cn('scroll-m-20 border-b pb-2 text-3xl font-semibold tracking-tight first:mt-0 mt-10 mb-4', className)}
      {...props}
    />
  )
}

export function TypographyH3({ className, ...props }: React.HTMLAttributes<HTMLHeadingElement>) {
  return (
    <h3
      className={cn('scroll-m-20 text-2xl font-semibold tracking-tight mt-8 mb-4', className)}
      {...props}
    />
  )
}

export function TypographyH4({ className, ...props }: React.HTMLAttributes<HTMLHeadingElement>) {
  return (
    <h4
      className={cn('scroll-m-20 text-xl font-semibold tracking-tight mt-6 mb-4', className)}
      {...props}
    />
  )
}

export function TypographyP({ className, ...props }: React.HTMLAttributes<HTMLParagraphElement>) {
  return (
    <p
      className={cn('leading-7 [&:not(:first-child)]:mt-6 text-[17px]', className)}
      {...props}
    />
  )
}

export function TypographyBlockquote({ className, ...props }: React.HTMLAttributes<HTMLQuoteElement>) {
  return (
    <blockquote
      className={cn('mt-6 border-l-4 pl-6 italic text-muted-foreground', className)}
      {...props}
    />
  )
}

export function TypographyList({ className, ...props }: React.HTMLAttributes<HTMLUListElement>) {
  return (
    <ul
      className={cn('my-6 ml-6 list-disc space-y-2 text-[17px]', className)}
      {...props}
    />
  )
}

export function TypographyOL({ className, ...props }: React.HTMLAttributes<HTMLOListElement>) {
  return (
    <ol
      className={cn('my-6 ml-6 list-decimal space-y-2 text-[17px]', className)}
      {...props}
    />
  )
}

export function TypographyInlineCode({ className, ...props }: React.HTMLAttributes<HTMLElement>) {
  return (
    <code
      className={cn('relative rounded bg-muted px-[0.3rem] py-[0.2rem] font-mono text-sm font-semibold', className)}
      {...props}
    />
  )
}

export function TypographyLead({ className, ...props }: React.HTMLAttributes<HTMLParagraphElement>) {
  return (
    <p
      className={cn('text-xl text-muted-foreground', className)}
      {...props}
    />
  )
}

export function TypographyLarge({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn('text-lg font-semibold', className)}
      {...props}
    />
  )
}

export function TypographySmall({ className, ...props }: React.HTMLAttributes<HTMLElement>) {
  return (
    <small
      className={cn('text-sm font-medium leading-none', className)}
      {...props}
    />
  )
}

export function TypographyMuted({ className, ...props }: React.HTMLAttributes<HTMLParagraphElement>) {
  return (
    <p
      className={cn('text-sm text-muted-foreground', className)}
      {...props}
    />
  )
}

export function TypographyTable({ className, ...props }: React.HTMLAttributes<HTMLTableElement>) {
  return (
    <div className={cn('my-6 w-full overflow-y-auto', className)}>
      <table className="w-full" {...props} />
    </div>
  )
}

export function TypographyAnchor({ className, href, ...props }: React.HTMLAttributes<HTMLAnchorElement> & { href?: string }) {
  return (
    <a
      href={href}
      className={cn('font-medium underline underline-offset-4 text-primary hover:text-primary/80 transition-colors', className)}
      {...props}
    />
  )
}

export function TypographyHr({ className, ...props }: React.HTMLAttributes<HTMLHRElement>) {
  return (
    <hr
      className={cn('my-8 border-border', className)}
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
