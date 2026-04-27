import { Cursor } from './../../shared/types/index.types';
import { useInfiniteQuery } from "@tanstack/react-query"
import { ACHIEVEMENTS_PAGE_SIZE } from "../constants/achievements.types"
import { getPaginatedAchievements } from "../services/achievements"

type UseAchievementsProps = {
  search?: string
  types?: string[]
  levels?: string[]
  categorySlugs?: string[]
  pageSize?: number
  cursor?: Cursor | undefined
  enabled?: boolean
}

export function useInfiniteAchievements({
  search,
  types,
  levels,
  categorySlugs,
  pageSize = ACHIEVEMENTS_PAGE_SIZE,
  enabled = true
}: UseAchievementsProps = {}) {
  return useInfiniteQuery({
    queryKey: ["achievements", { search, types, levels, categorySlugs, pageSize}],
    queryFn: async ({ pageParam }) => {
      return getPaginatedAchievements({
        search, 
        types, 
        levels,
        categorySlugs, 
        pageSize,
        cursor: pageParam as Cursor | undefined,
      })
    },
    enabled: enabled, 
    initialPageParam: undefined as Cursor | undefined,
    getNextPageParam: (lastPage) => {
      return lastPage.hasMore ? lastPage.nextCursor : undefined
    },
    staleTime: 1000 * 60 * 30,
  })
}