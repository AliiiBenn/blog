import React from 'react'
import './globals.css'
import { Metadata } from 'next'
import { AppProviders } from '@/components/providers'
import { AppHeader } from '@/components/headers/app-header'

export const metadata: Metadata = {
  description: 'A blank template using Payload in a Next.js app.',
  title: 'Payload Blank Template',
}

export default async function RootLayout(props: { children: React.ReactNode }) {
  const { children } = props

  return (
    <html lang="en" suppressHydrationWarning>
      <body>
        <AppProviders>
          <AppHeader />
          <main>{children}</main>
        </AppProviders>
      </body>
    </html>
  )
}
