import { ThemeProvider } from '@wrksz/themes/next'
import { ReactNode } from 'react'
import { AuthProvider } from './AuthProvider'
import { AosProvider } from './AosProvider'

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