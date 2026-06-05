import { useInfiniteQuery } from "@tanstack/react-query"
import type { Cursor } from "@/features/shared/types/index.types"
import { REACTIONS_PAGE_SIZE } from "../constants/reactions.constants"
import type { ReactionTargetType } from "../types/reactions.types"
import { getPaginatedReactions } from "../services/reactions"

type UseInfiniteReactionsParams = {
  targetId: string
  targetType: ReactionTargetType
  enabled?: boolean
  pageSize?: number
}

/**
 * A custom hook to fetch and manage infinite scrolling for reactions.
 * @param targetId - The specific ID of the entity whose reactions are being retrieved.
 * @param targetType - Defines the relationship type (e.g., 'project', 'comments') to target the correct DB column.
 * @param pageSize - Limits the number of reactions returned in a single fetch.
 * @param enabled - Conditional flag to control the query execution (automatically disabled if targetId is falsy).
 * @returns An infinite query object containing data pages, fetch status, and pagination helpers.
 */
export function useInfiniteReactions({
  targetId,
  targetType,
  enabled = true,
  pageSize = REACTIONS_PAGE_SIZE,
}: UseInfiniteReactionsParams) {
  return useInfiniteQuery({
    queryKey: ["reactions", targetType, targetId, { pageSize }],
    queryFn: async ({ pageParam }) => {
      return getPaginatedReactions({
        targetId,
        targetType,
        cursor: pageParam as Cursor | undefined,
        pageSize,
      })
    },
    enabled: !!targetId && enabled,
    initialPageParam: undefined as Cursor | undefined,
    getNextPageParam: (lastPage) => {
      return lastPage.hasMore ? lastPage.nextCursor : undefined
    }
  })
}
