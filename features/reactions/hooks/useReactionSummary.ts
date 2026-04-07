import { useQuery } from "@tanstack/react-query"
import { getReactionSummary } from "../services/reactions"
import { ReactionSummary, ReactionTargetType } from "../types/reactions.types"
import { MAX_TOP_REACTIONS } from "../constants/reactions.constants"

type UseReactionSummaryParams = {
  targetId: string
  targetType: ReactionTargetType
  initialSummary?: ReactionSummary
  topReactionsCount?: number
  enabled?: boolean
}

/**
 * Hook to manage reaction statistics and current user status.
 * Optimized for both SSR (via optional initialSummary) and client-side fetching.
 * * @param params.targetId - The UUID of the target entity.
 * @param params.targetType - The classification ("project" | "comment").
 * @param params.initialSummary - Optional server-provided data for hydration.
 * @param params.topReactionsCount - Number of top emojis to return.
 */
export function useReactionSummary({
  targetId,
  targetType,
  initialSummary,
  topReactionsCount = MAX_TOP_REACTIONS,
  enabled = true,
}: UseReactionSummaryParams) {
  return useQuery({
    queryKey: ["reaction-summary", targetType, targetId, topReactionsCount],
    queryFn: () => getReactionSummary({ targetId, targetType, topReactionsCount }),
    initialData: initialSummary, 
    staleTime: 1000 * 60 * 5,
    enabled: !!targetId && enabled,
  })
}