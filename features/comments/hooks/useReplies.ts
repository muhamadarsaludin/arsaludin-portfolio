import { useInfiniteQuery } from "@tanstack/react-query"
import { COMMENTS_PAGE_SIZE } from "../constants/comments.constants"
import type { Cursor } from "@/features/shared/types/index.types"
import { getReplies } from "../services/replies"

type UseRepliesParams = {
  parentId: string
  pageSize?: number
  enabled?: boolean
}

/**
 * A custom hook to fetch and manage infinite scrolling for comment replies.
 * @param parentId - The ID of the comment whose replies are being fetched.
 * @param pageSize - The amount of data requested in a single request.
 * @param enabled - Condition to trigger the query (automatically disabled if parentId is missing).
 * @returns An infinite query object containing:
 * - data: Paginated replies grouped by pages.
 * - fetchNextPage: Function to load the next set of replies.
 * - hasNextPage: Boolean indicating if more replies are available.
 */
export function useReplies({
  parentId,
  pageSize = COMMENTS_PAGE_SIZE,
  enabled = true,
}: UseRepliesParams) {
  return useInfiniteQuery({
    queryKey: ["replies", parentId],
    queryFn: async ({ pageParam }) => {
      return getReplies({
        parentId,
        cursor: (pageParam as Cursor) ?? undefined,
        pageSize,
      })
    },
    enabled: !!parentId && enabled,
    initialPageParam: null as Cursor | null,
    getNextPageParam: (lastPage) => {
      return lastPage.hasMore ? lastPage.nextCursor : undefined
    },
    staleTime: 5000,
  })
}
