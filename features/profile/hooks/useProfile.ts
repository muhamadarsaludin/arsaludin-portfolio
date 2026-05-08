import { useQuery } from "@tanstack/react-query"
import { getProfile } from "@/features/profile/services/profiles"

/**
 * Custom hook to fetch and manage user profile data.
 * @param userId - The unique UUID of the user.
 * @returns The query result containing an array of Profile objects.
 * @example
 * const { data: profile, isLoading } = useProfile(user?.id);
 */
export function useProfile({ userId }: { userId: string | null }) {
  return useQuery({
    queryKey: ["profile", userId],
    queryFn: () => getProfile({ id: userId! }),
    enabled: !!userId,
    staleTime: 1000 * 60 * 5,
  })
}
