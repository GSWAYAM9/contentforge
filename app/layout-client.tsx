'use client'

import { ThemeProvider } from 'next-themes'

export function RootLayoutClient({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <ThemeProvider attribute="class" defaultTheme="dark" forcedTheme="dark">
      {children}
    </ThemeProvider>
  )
}
