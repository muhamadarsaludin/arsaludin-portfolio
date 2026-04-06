"use client"

import { QueryClient, QueryClientProvider } from "@tanstack/react-query"
import { useState } from "react"

/**
 * Global TanStack Query Provider for the application.
 * Manages the QueryClient instance and provides it to the component tree.
 * @param children - The component tree that will have access to React Query hooks.
 * @features
 * - **Single Instance**: Uses `useState` initializer to ensure QueryClient is only created once.
 * - **SSR Safe**: Prevents multiple client instances during Next.js hydration.
 * - **Optimized Defaults**: Custom global settings for data fetching behavior.
 */
export default function QueryProvider({ children }: { children: React.ReactNode }) {
  const [queryClient] = useState(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: {
            refetchOnWindowFocus: false,
            staleTime: 60 * 1000,
          },
        },
      })
  )

  return <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
}
