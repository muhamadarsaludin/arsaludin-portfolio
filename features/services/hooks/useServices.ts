import { useQuery } from "@tanstack/react-query"
import { getServices } from "../services/services"

/**
 * Custom hook to fetch and manage the state of services.
 * Integrates TanStack Query for efficient caching and background updates.
 * @param options - Hook parameters.
 * @param options.locale - Language code for localized content (e.g., 'id', 'en').
 * @param options.isAdminView - If true, fetches all records and includes administrative metadata.
 * @features
 * - **Cache Isolation**: Includes `isAdminView` in the queryKey to prevent data leakage between public and admin views.
 * - **Static Optimization**: Uses a 1-hour `staleTime` since service data rarely changes.
 */
export function useServices({
  locale,
  isAdminView = false,
}: {
  locale: string
  isAdminView?: boolean
}) {
  return useQuery({
    queryKey: ["services", locale, isAdminView],
    queryFn: () => getServices({ locale, isAdminView }),
    staleTime: isAdminView ? 0 : 1000 * 60 * 60,
    refetchOnWindowFocus: isAdminView,
  })
}
