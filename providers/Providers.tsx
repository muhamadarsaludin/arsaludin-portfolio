import { ThemeProvider } from "@wrksz/themes/next"
import type { ReactNode } from "react"
import { AuthProvider } from "./AuthProvider"
import type { User } from "@supabase/supabase-js"
import QueryProvider from "./QueryProvider"

export function Providers({
  children,
  initialUser,
}: {
  children: ReactNode
  initialUser: User | null
}) {
  return (
    <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
      <QueryProvider>
        <AuthProvider initialUser={initialUser}>
          {children}
        </AuthProvider>
      </QueryProvider>
    </ThemeProvider>
  )
}
