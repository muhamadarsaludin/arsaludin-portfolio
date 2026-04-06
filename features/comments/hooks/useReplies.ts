import { useInfiniteQuery } from "@tanstack/react-query"
import { COMMENTS_PAGE_SIZE } from "../constants/comments"
import { Cursor } from "@/features/shared/types"
import { getReplies } from "../services/replies"
import { UseRepliesParams } from "../types/replies"

export function useReplies({
  parentId,
  pageSize = COMMENTS_PAGE_SIZE,
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
    initialPageParam: null as Cursor | null,
    getNextPageParam: (lastPage) => {
      return lastPage.hasMore ? lastPage.nextCursor : undefined
    },
    staleTime: 5000, 
  })
}