import { useQuery } from "@tanstack/react-query"
import { getProfile } from "@/features/profile/services/profiles"

interface UseProfileParams {
  userId: string | null
}

/**
 * Custom hook to fetch and manage user profile data.
 * @param userId - The unique UUID of the user.
 * @returns The query result containing an array of Profile objects.
 * @example
 * const { data: profile, isLoading } = useProfile(user?.id);
 */
export function useProfile({ userId }: UseProfileParams) {
  return useQuery({
    queryKey: ["profile", userId],
    queryFn: async () => {
      if (!userId) return null
      return await getProfile({ id: userId })
    },
    enabled: !!userId,
    staleTime: 1000 * 60 * 5,
    refetchOnWindowFocus: false,
  })
}
