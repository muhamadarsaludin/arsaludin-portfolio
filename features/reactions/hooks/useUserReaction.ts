import { useQuery } from "@tanstack/react-query"
import type { ReactionTargetType } from "../types/reactions.types"
import { getUserReaction } from "../services/reactions"

type UseUserReactionParams = {
  targetId: string
  targetType: ReactionTargetType
  enabled?: boolean
}

/**
 * Custom hook to fetch user reaction
 *
 * @param params - Configuration object for the query lifecycle
 * @param params.targetId - The unique identifier of the target entity
 * @param params.targetType - The type of target entity (e.g., 'project', 'blog')
 * @param params.enabled - Optional flag to conditionally toggle the query lifecycle (defaults to true)
 */
export function useUserReaction({ targetId, targetType, enabled = true }: UseUserReactionParams) {
  return useQuery({
    queryKey: ["user-reaction", targetType, targetId],
    queryFn: () =>
      getUserReaction({
        targetId,
        targetType,
      }),
    enabled: !!targetId && enabled,
    staleTime: 1000 * 60 * 5,
  })
}
