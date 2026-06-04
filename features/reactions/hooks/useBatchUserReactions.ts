import { useQuery } from "@tanstack/react-query"
import { getBatchUserReactions } from "../services/reactions"
import type { ReactionTargetType } from "../types/reactions.types"

type UseBatchUserReactionsParams = {
  targetIds: string[]
  targetType: ReactionTargetType
}

export function useBatchUserReactions({ targetIds, targetType }: UseBatchUserReactionsParams) {
  return useQuery({
    queryKey: ["user-reaction-batch", targetType],
    queryFn: () =>
      getBatchUserReactions({
        targetIds,
        targetType,
      }),
    enabled: targetIds.length > 0,
    staleTime: 1000 * 60 * 5,
  })
}
