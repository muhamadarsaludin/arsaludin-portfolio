import { ThemeProvider } from '@wrksz/themes/next'
import { ReactNode } from 'react'
import { AuthProvider } from './AuthProvider'
import { User } from '@supabase/supabase-js'

export function Providers({
  children,
  initialUser
}: {
  children: ReactNode
  initialUser: User | null
}) {
  return (
    <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
      <AuthProvider initialUser={initialUser}>
        {children}
      </AuthProvider>
    </ThemeProvider>
  )
}