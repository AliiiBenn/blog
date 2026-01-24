import React from 'react'
import { QueryClientProvider } from '@/lib/providers'
import './styles.css'

export const metadata = {
  description: 'A modern blog built with Payload CMS and Next.js',
  title: 'Blog',
}

export default async function RootLayout(props: { children: React.ReactNode }) {
  const { children } = props

  return (
    <html lang="en" suppressHydrationWarning>
      <body>
        <QueryClientProvider>
          <main>{children}</main>
        </QueryClientProvider>
      </body>
    </html>
  )
}
