import { useInfiniteQuery } from "@tanstack/react-query"
import type { Cursor } from "@/features/shared/types/index.types"
import { REACTIONS_PAGE_SIZE } from "../constants/reactions.constants"
import { ReactionTargetType } from "../types/reactions.types"
import { getReactions } from "../services/reactions"

type UseReactionsParams = {
  targetId: string
  targetType: ReactionTargetType
  pageSize?: number
  enabled?: boolean
}

/**
 * A custom hook to fetch and manage infinite scrolling for reactions.
 * Built on top of TanStack Query's useInfiniteQuery for robust cache and pagination management.
 * @param targetId - The specific ID of the entity whose reactions are being retrieved.
 * @param targetType - Defines the relationship type (e.g., 'project', 'comments') to target the correct DB column.
 * @param pageSize - Limits the number of reactions returned in a single fetch.
 * @param enabled - Conditional flag to control the query execution (automatically disabled if targetId is falsy).
 * @returns An infinite query object containing data pages, fetch status, and pagination helpers.
 */
export function useReactions({
  targetId,
  targetType,
  pageSize = REACTIONS_PAGE_SIZE,
  enabled = true,
}: UseReactionsParams) {
  return useInfiniteQuery({
    queryKey: ["reactions", targetType, targetId],
    queryFn: async ({ pageParam }) => {
      return getReactions({
        targetId,
        targetType,
        cursor: (pageParam as Cursor) ?? undefined,
        pageSize,
      })
    },
    enabled: !!targetId && enabled,
    initialPageParam: null as Cursor | null,
    getNextPageParam: (lastPage) => {
      return lastPage.hasMore ? lastPage.nextCursor : undefined
    },
    staleTime: 1000 * 5,
  })
}
