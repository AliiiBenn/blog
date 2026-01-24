import React from 'react'
import { QueryClientProvider } from '@/lib/providers'
import { ThemeProvider } from '@/components/theme-provider'
import './styles.css'

export const metadata = {
  description: 'A modern blog built with Payload CMS and Next.js',
  title: 'Blog',
}

export default async function RootLayout(props: { children: React.ReactNode }) {
  const { children } = props

  return (
    <html lang="en" className="dark" suppressHydrationWarning>
      <body className="bg-background text-foreground">
        <ThemeProvider
          attribute="class"
          defaultTheme="dark"
          enableSystem={false}
          disableTransitionOnChange
        >
          <QueryClientProvider>
            <main>{children}</main>
          </QueryClientProvider>
        </ThemeProvider>
      </body>
    </html>
  )
}
