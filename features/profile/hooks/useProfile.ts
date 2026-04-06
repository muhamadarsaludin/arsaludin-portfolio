import { useQuery } from "@tanstack/react-query"
import { getProfile } from "@/features/profile/services/profiles"

export function useProfile(userId: string | undefined) {
  return useQuery({
    queryKey: ["profile", userId],
    queryFn: () => getProfile({ id: userId! }),
    enabled: !!userId,
    staleTime: 1000 * 60 * 5,
  })
}