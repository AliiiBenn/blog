import React from 'react'
import { QueryClientProvider } from '@/lib/providers'
import { ThemeProvider } from '@/components/theme-provider'
import { Header } from '@/components/header'
import { Footer } from '@/components/footer'
import { MobileMenu } from '@/components/mobile-menu'
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
            <div className="flex min-h-screen flex-col">
              <Header />
              <main className="flex-1 w-full">{children}</main>
              <Footer />
            </div>
            <MobileMenu />
          </QueryClientProvider>
        </ThemeProvider>
      </body>
    </html>
  )
}
