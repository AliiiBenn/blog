import React from 'react'
import { QueryClientProvider } from '@/lib/providers'
import { ThemeProvider } from '@/components/theme-provider'
import { MobileMenu } from '@/components/mobile-menu'
import './styles.css'

import { GeistSans } from "geist/font/sans";

export const metadata = {
  description: 'A modern blog built with Payload CMS and Next.js',
  title: 'Blog',
}

export default async function RootLayout(props: { children: React.ReactNode }) {
  const { children } = props

  return (
    <html lang="en" className={GeistSans.className + "dark"} suppressHydrationWarning>
      <body className="bg-background text-foreground">
        <ThemeProvider
          attribute="class"
          defaultTheme="dark"
          enableSystem={false}
          disableTransitionOnChange
        >
          <QueryClientProvider>
            <main className="flex-1 w-full max-w-2xl mx-auto px-4 sm:px-6">{children}</main>
            <MobileMenu />
          </QueryClientProvider>
        </ThemeProvider>
      </body>
    </html>
  )
}
