import { ThemeProvider } from '@wrksz/themes/next'
import { ReactNode } from 'react'
import { AuthProvider } from './AuthProvider'

export function Providers({
  children
}: {
  children: ReactNode
}) {
  return (
    <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
      <AuthProvider>
        {children}
      </AuthProvider>
    </ThemeProvider>
  )
}