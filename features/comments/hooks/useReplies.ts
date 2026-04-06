import { useInfiniteQuery } from "@tanstack/react-query"
import { COMMENTS_PAGE_SIZE } from "../constants/comments"
import type { Cursor } from "@/features/shared/types"
import { getReplies } from "../services/replies"

type UseRepliesParams = {
  parentId: string
  pageSize?: number
  enabled?: boolean
}

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