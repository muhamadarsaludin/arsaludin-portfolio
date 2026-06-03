import { ThemeProvider } from "@wrksz/themes/next"
import type { ReactNode } from "react"
import { AuthProvider } from "./AuthProvider"
import QueryProvider from "./QueryProvider"

/**
 * Root Provider Wrapper for the application.
 * Consolidates Theme, Data Fetching (TanStack Query), and Authentication contexts.
 * @param children - The application's component tree (typically from the root layout).
 * @param initialUser - The authenticated user object passed from the server-side to prevent hydration flicker.
 * @order-of-operations
 * 1. **ThemeProvider**: Handles CSS variable injection and dark/light mode classes.
 * 2. **QueryProvider**: Initializes the QueryClient needed by hooks within AuthProvider.
 * 3. **AuthProvider**: Connects the Supabase session and fetches the user profile.
 */
export function Providers({ children }: { children: ReactNode }) {
  return (
    <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
      <QueryProvider>
        <AuthProvider>{children}</AuthProvider>
      </QueryProvider>
    </ThemeProvider>
  )
}
