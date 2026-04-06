import { useInfiniteQuery } from "@tanstack/react-query"
import { COMMENTS_PAGE_SIZE } from "../constants/comments"
import { UseCommentsParams } from "../types/comments"
import { getComments } from "../services/comments"
import { Cursor } from "@/features/shared/types"

export function useComments({
  targetId,
  targetType,
  pageSize = COMMENTS_PAGE_SIZE,
}: UseCommentsParams) {
  return useInfiniteQuery({
    queryKey: ["comments", targetType, targetId],
    queryFn: async ({ pageParam }) => {
      return getComments({
        targetId,
        targetType,
        cursor: (pageParam as Cursor) ?? undefined,
        pageSize,
      })
    },
    initialPageParam: null as Cursor | null,
    getNextPageParam: (lastPage) => {
      return lastPage.hasMore ? lastPage.nextCursor : undefined
    },
    staleTime: 5000, 
  })
}