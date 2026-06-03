import { useQuery } from "@tanstack/react-query"
import { getProfile } from "@/features/profile/services/profiles"
import type { Profile } from "../types/profiles.types"

interface UseProfileParams {
  userId: string | null
  initialProfileData?: Profile | null
}

/**
 * Custom hook to fetch and manage user profile data.
 * @param userId - The unique UUID of the user.
 * @returns The query result containing an array of Profile objects.
 * @example
 * const { data: profile, isLoading } = useProfile(user?.id);
 */
export function useProfile({ userId, initialProfileData }: UseProfileParams) {
  return useQuery({
    queryKey: ["profile", userId],
    queryFn: () => getProfile({ id: userId! }),
    enabled: !!userId,
    initialData: initialProfileData ? initialProfileData : undefined,
    staleTime: 1000 * 60 * 5,
    refetchOnWindowFocus: true,
    retry: false,
  })
}
