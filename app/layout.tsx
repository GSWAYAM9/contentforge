import { Analytics } from '@vercel/analytics/next'
import type { Metadata, Viewport } from 'next'
import './globals.css'
import { RootLayoutClient } from './layout-client'

export const metadata: Metadata = {
  title: 'ContentForge AI - AI-Powered Content Publishing',
  description: 'Create, optimize, and publish world-class content with AI agents',
  generator: 'v0.app',
  icons: {
    icon: [
      {
        url: '/icon-light-32x32.png',
        media: '(prefers-color-scheme: light)',
      },
      {
        url: '/icon-dark-32x32.png',
        media: '(prefers-color-scheme: dark)',
      },
      {
        url: '/icon.svg',
        type: 'image/svg+xml',
      },
    ],
    apple: '/apple-icon.png',
  },
}

export const viewport: Viewport = {
  colorScheme: 'dark',
  themeColor: '#09090B',
  userScalable: true,
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className="antialiased bg-background">
        <RootLayoutClient>
          {children}
        </RootLayoutClient>
        {process.env.NODE_ENV === 'production' && <Analytics />}
      </body>
    </html>
  )
}
