import { useQuery } from "@tanstack/react-query"
import { getProfile } from "@/features/profile/services/profiles"

/**
 * Custom hook to fetch and manage user profile data from Supabase.
 * Leverages TanStack Query for server-state management, caching, and synchronization.
 * @param userId - The unique identifier of the user from Supabase Auth.
 * If undefined, the query will remain in 'idle' state.
 * @returns An object containing:
 * - `data`: The Profile object or null.
 * - `isLoading`: Boolean indicating the initial fetch is in progress.
 * - `isFetching`: Boolean indicating any background refetch is in progress.
 * - `error`: Any error encountered during the fetch.
 * @example
 * const { data: profile, isLoading } = useProfile(user?.id);
 * @features
 * - **Dependent Query**: Only fires when `userId` is truthy (via `enabled`).
 * - **Stale-While-Revalidate**: Data is considered "fresh" for 5 minutes.
 * - **Auto-Refetch**: Triggers on window focus or network reconnect if data is stale.
 */
export function useProfile({ userId }: { userId: string | null }) {
  return useQuery({
    queryKey: ["profile", userId],
    queryFn: () => getProfile({ id: userId! }),
    enabled: !!userId,
    staleTime: 1000 * 60 * 5,
  })
}
