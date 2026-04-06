// features/projects/hooks/useProjects.ts

import { useQuery } from "@tanstack/react-query"
import { getProjects } from "../services/projects"

/**
 * Custom hook to fetch and manage projects data with TanStack Query.
 * Optimized for both public portfolio displays and administrative views.
 * @param options - Configuration for the projects query.
 * @param options.locale - Language code for localized content (e.g., 'id', 'en').
 * @param options.isFeatured - If true, fetches only projects marked as featured.
 * @param options.isAdminView - If true, includes private metadata and bypasses visibility filters.
 * @features
 * - **Multi-Level Caching**: Query key includes all parameters to prevent data overlap.
 * - **Contextual StaleTime**: Uses 0ms for Admin to ensure real-time accuracy, and 1 hour for Public view.
 * - **SWR Support**: Seamlessly updates project reactions and comment counts in the background.
 */
export function useProjects({
  locale,
  isFeatured = false,
  isAdminView = false,
}: {
  locale: string
  isFeatured?: boolean
  isAdminView?: boolean
}) {
  return useQuery({
    queryKey: ["projects", locale, { isFeatured, isAdminView }],
    queryFn: () => getProjects({ locale, isFeatured, isAdminView }),
    staleTime: isAdminView ? 0 : 1000 * 60 * 60,
    refetchOnWindowFocus: isAdminView,
  })
}