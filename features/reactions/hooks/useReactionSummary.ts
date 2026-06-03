import { useQuery } from "@tanstack/react-query"
import type { ReactionSummary, ReactionTargetType } from "../types/reactions.types"
import { getReactionSummary } from "../services/reactions"

type UseReactionSummaryParams = {
  targetId: string
  targetType: ReactionTargetType
  initialSummary?: ReactionSummary
  enabled?: boolean
}

/**
 * Custom hook to fetch user reaction summary
 *
 * @param params - Configuration object for the query lifecycle
 * @param params.targetId - The unique identifier of the target entity
 * @param params.targetType - The type of target entity (e.g., 'project', 'blog')
 * @param params.initialSummary - Optional initial data from SSG/SSR to prevent layout flashes
 * @param params.enabled - Optional flag to conditionally toggle the query lifecycle (defaults to true)
 */
export function useReactionSummary({
  targetId,
  targetType,
  initialSummary,
  enabled = true,
}: UseReactionSummaryParams) {
  return useQuery({
    queryKey: ["reaction-summary", targetType, targetId],
    queryFn: () =>
      getReactionSummary({
        targetId,
        targetType,
      }),
    placeholderData: initialSummary,
    enabled: !!targetId && enabled,
    staleTime: 1000 * 60 * 5,
  })
}
