import { useQuery } from "@tanstack/react-query"
import { getBatchCommentCounts } from "../services/comments"
import type { CommentTargetType } from "../types/comments.types"

type UseBatchCommentCountsParams = {
  targetIds: string[]
  targetType: CommentTargetType
}

export function useBatchCommentCounts({ targetIds, targetType }: UseBatchCommentCountsParams) {
  const serializedIds = targetIds.join(",")

  return useQuery({
    queryKey: ["comment-counts-batch", targetType, serializedIds],
    queryFn: () => getBatchCommentCounts({ targetIds, targetType }),
    enabled: targetIds.length > 0,
    staleTime: 1000 * 60 * 5,
  })
}
