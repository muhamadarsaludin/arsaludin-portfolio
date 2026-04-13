import { useQuery } from "@tanstack/react-query"
import { getFeaturedAchievements } from "../services/achievements"


export function useFeaturedAchievements() {
  return useQuery({
    queryKey: ["featured-achievements"],
    queryFn: () => getFeaturedAchievements(),
    staleTime: 1000 * 60 * 60,
  })
}
