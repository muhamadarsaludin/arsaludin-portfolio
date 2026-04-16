import { useQuery } from "@tanstack/react-query"
import { getReactionSummary } from "../services/reactions"
import type { ReactionSummary, ReactionTargetType } from "../types/reactions.types"
import { MAX_TOP_REACTIONS } from "../constants/reactions.constants"

type UseReactionSummaryParams = {
  targetId: string
  targetType: ReactionTargetType
  initialSummary?: ReactionSummary
  enabled?: boolean
}

/**
 * Hook to manage reaction statistics and current user status.
 * Optimized for both SSR (via optional initialSummary) and client-side fetching.
 * @param targetId - The UUID of the target entity.
 * @param targetType - The classification ("project" | "comment").
 * @param initialSummary - Optional server-provided data for hydration.
 * @param topReactionsCount - Number of top emojis to return.
 * @param params.enabled - Toggle to enable or disable the query. Defaults to true.
 * @returns React Query object containing the reaction summary and fetch status.
 */
export function useReactionSummary({
  targetId,
  targetType,
  initialSummary,
  enabled = true,
}: UseReactionSummaryParams) {
  return useQuery({
    queryKey: ["reaction-summary", targetType, targetId],
    queryFn: () => getReactionSummary({ targetId, targetType }),
    initialData: initialSummary,
    staleTime: 1000 * 60 * 5,
    enabled: !!targetId && enabled,
  })
}
