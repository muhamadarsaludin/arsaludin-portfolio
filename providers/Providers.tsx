'use client'

import { ThemeProvider } from 'next-themes'
import { ReactNode } from 'react'
import { AuthProvider } from './AuthProvider'
import { AosProvider } from './AosProvider'
import type { User } from '@supabase/supabase-js'

export function Providers({
  children
}: {
  children: ReactNode
}) {
  return (
    <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
      <AuthProvider>
        <AosProvider>
          {children}
        </AosProvider>
      </AuthProvider>
    </ThemeProvider>
  )
}