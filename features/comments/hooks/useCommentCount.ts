import { getCommentCount } from "../services/comments"
import { CommentTargetType } from "../types/comments.types"
import { useQuery } from "@tanstack/react-query"

type UseCommentCountParams = {
  targetId: string
  targetType: CommentTargetType
  initialCount?: number
  enabled?: boolean
}

/**
 * A custom hook to manage and synchronize comment counts across the UI.
 * Supports **Hydration** through `initialCount` to prevent Layout Shift (CLS) 
 * when navigating between list and detail views.
 * @param {Object} params - Hook parameters.
 * @param {string} params.targetId - The unique ID of the target entity.
 * @param {CommentTargetType} params.targetType - The type of entity being commented on.
 * @param {number} [params.initialCount] - Optional server-side or cached count for immediate display.
 * @param {boolean} [params.enabled=true] - Controls whether the query should execute.
 * @returns {UseQueryResult<number, Error>} The TanStack Query result containing the total count.
 * @example
 * const { data: count } = useCommentCount({ 
 * targetId: "proj-123", 
 * targetType: "project", 
 * initialCount: 5 
 * });
 */
export function useCommentCount({
  targetId,
  targetType,
  initialCount,
  enabled = true,
}: UseCommentCountParams) {
  return useQuery<number>({
    queryKey: ["comment-count", targetType, targetId],
    queryFn: () => getCommentCount({ targetId, targetType }),
    initialData: initialCount,
    staleTime: 1000 * 60 * 5,
    enabled: !!targetId && enabled,
  })
}