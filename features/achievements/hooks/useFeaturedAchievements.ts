import { useQuery } from "@tanstack/react-query"
import { getFeaturedAchievements } from "../services/achievements"

type UseFeaturedAchievementsParams = {
  locale: string
}

/**
 * Custom hook to fetch featured achievements.
 * @returns The query result containing an array of Achievement objects.
 */
export function useFeaturedAchievements({ locale }: UseFeaturedAchievementsParams) {
  return useQuery({
    queryKey: ["featured-achievements", locale],
    queryFn: () => getFeaturedAchievements({ locale }),
    staleTime: 1000 * 60 * 30,
    refetchOnWindowFocus: false,
  })
}
