import { useInfiniteQuery } from "@tanstack/react-query"
import { REPLIES_PAGE_SIZE } from "../constants/comments.constants"
import type { Cursor } from "@/features/shared/types/index.types"
import { getPaginatedReplies } from "../services/replies"
import type { PaginatedComments } from "../types/comments.types"

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
 * @returns An infinite query object containing data pages, fetch status, and pagination helpers.
 */
export function useInfiniteReplies({
  parentId,
  pageSize = REPLIES_PAGE_SIZE,
  enabled = true,
}: UseRepliesParams) {
  return useInfiniteQuery<PaginatedComments, Error>({
    queryKey: ["replies", parentId, { pageSize }],
    queryFn: ({ pageParam }) => {
      return getPaginatedReplies({
        parentId: parentId!,
        cursor: pageParam as Cursor | undefined,
        pageSize,
      })
    },
    enabled: !!parentId && enabled,
    initialPageParam: undefined as Cursor | undefined,
    getNextPageParam: (lastPage) => {
      return lastPage.hasMore ? lastPage.nextCursor : undefined
    },
    staleTime: 1000 * 60,
  })
}
