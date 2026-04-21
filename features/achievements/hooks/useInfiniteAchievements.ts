import { Cursor } from './../../shared/types/index.types';
import { useInfiniteQuery } from "@tanstack/react-query"
import { ACHIEVEMENTS_PAGE_SIZE } from "../constants/achievements.types"
import { getPaginatedAchievements } from "../services/achievements"

type UseAchievementsProps = {
  search?: string
  types?: string[]
  categoryIds?: string[]
  pageSize?: number
  enabled?: boolean
  cursor?: Cursor | undefined
}

export function useInfiniteAchievements({
  search,
  types,
  categoryIds,
  pageSize = ACHIEVEMENTS_PAGE_SIZE,
  enabled = true
}: UseAchievementsProps = {}) {
  return useInfiniteQuery({
    queryKey: ["achievements", { search, types, categoryIds, pageSize}],
    queryFn: async ({ pageParam }) => {
      return getPaginatedAchievements({
        search, 
        types, 
        categoryIds, 
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