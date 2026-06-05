import { useQuery } from "@tanstack/react-query"
import { getBatchReactions } from "../services/reactions"
import type { ReactionTargetType } from "../types/reactions.types"

type UseBatchReactionsParams = {
  targetIds: string[]
  targetType: ReactionTargetType
}

export function useBatchReactions({ targetIds, targetType }: UseBatchReactionsParams) {
  const serializedIds = targetIds.join(",")

  return useQuery({
    queryKey: ["reactions-batch", targetType, serializedIds],
    queryFn: () =>
      getBatchReactions({
        targetIds,
        targetType,
      }),
    enabled: targetIds.length > 0
  })
}
