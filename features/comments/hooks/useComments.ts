import { useInfiniteQuery } from "@tanstack/react-query"
import { COMMENTS_PAGE_SIZE } from "../constants/comments"
import { CommentTargetType } from "../types/comments"
import { getComments } from "../services/comments"
import { Cursor } from "@/features/shared/types"

type UseCommentsParams = {
  targetId: string
  targetType: CommentTargetType
  pageSize?: number
  enabled?: boolean
}

export function useComments({
  targetId,
  targetType,
  pageSize = COMMENTS_PAGE_SIZE,
  enabled = true,
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
    enabled: !!targetId && enabled,
    initialPageParam: null as Cursor | null,
    getNextPageParam: (lastPage) => {
      return lastPage.hasMore ? lastPage.nextCursor : undefined
    },
    staleTime: 5000, 
  })
}