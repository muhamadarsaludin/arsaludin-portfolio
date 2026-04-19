import { useQuery } from "@tanstack/react-query"
import { getFeaturedAchievements } from "../services/achievements"

/**
 * Custom hook to fetch featured achievements.
 * @returns The query result containing an array of Achievement objects.
 */
export function useFeaturedAchievements() {
  return useQuery({
    queryKey: ["featured-achievements"],
    queryFn: () => getFeaturedAchievements(),
    staleTime: 1000 * 60 * 30,
    refetchOnWindowFocus: false,
  })
}
