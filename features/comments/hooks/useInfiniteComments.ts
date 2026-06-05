import { useInfiniteQuery } from "@tanstack/react-query"
import { COMMENTS_PAGE_SIZE } from "../constants/comments.constants"
import type { CommentTargetType } from "../types/comments.types"
import { getPaginatedComments } from "../services/comments"
import type { Cursor } from "@/features/shared/types/index.types"

type UseInfiniteCommentsParams = {
  targetId: string
  targetType: CommentTargetType
  pageSize?: number
  enabled?: boolean
}

/**
 * A custom hook to fetch and manage infinite scrolling for top-level comments.
 * Built on top of TanStack Query's useInfiniteQuery for robust cache and pagination management.
 * @param targetId - The specific ID of the entity whose comments are being retrieved.
 * @param targetType - Defines the relationship type (e.g., 'posts', 'videos') to target the correct DB column.
 * @param pageSize - Limits the number of comments returned in a single fetch.
 * @param enabled - Conditional flag to control the query execution (automatically disabled if targetId is falsy).
 * @returns An infinite query object containing data pages, fetch status, and pagination helpers.
 */
export function useInfiniteComments({
  targetId,
  targetType,
  pageSize = COMMENTS_PAGE_SIZE,
  enabled = true,
}: UseInfiniteCommentsParams) {
  return useInfiniteQuery({
    queryKey: ["comments", targetType, targetId, { pageSize }],
    queryFn: async ({ pageParam }) => {
      return getPaginatedComments({
        targetId: targetId!,
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
