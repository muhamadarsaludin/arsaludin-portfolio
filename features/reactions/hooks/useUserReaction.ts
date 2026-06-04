import { useQuery } from "@tanstack/react-query"
import type { Reaction, ReactionTargetType } from "../types/reactions.types"
import { getUserReaction } from "../services/reactions"

type UseUserReactionParams = {
  targetId: string
  targetType: ReactionTargetType
  initialUserReaction?: Reaction | null
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
export function useUserReaction({ 
  targetId, 
  targetType, 
  initialUserReaction,
  enabled = true 
}: UseUserReactionParams) {
  return useQuery({
    queryKey: ["user-reaction", targetType, targetId],
    queryFn: () =>
      getUserReaction({
        targetId,
        targetType,
      }),
    initialData: initialUserReaction,
    enabled: !!targetId && enabled,
    staleTime: 1000 * 60 * 5,
  })
}
