"use client"

import { useMutation, useQueryClient } from "@tanstack/react-query"
import { useAuth } from "@/providers/AuthProvider"
import { toggleReactionAction } from "../services/reactions"
import type { ReactionSummary, ReactionTargetType, Reaction } from "../types/reactions.types"

type UseBatchReactionMutationParams = {
  targetId: string
  targetType: ReactionTargetType
  targetIds: string[]
}

type BatchReactionsData = Record<
  string,
  {
    summary: ReactionSummary
    userReaction: Reaction | null
  }
>

export function useBatchReactionMutation({
  targetId,
  targetType,
  targetIds,
}: UseBatchReactionMutationParams) {
  const queryClient = useQueryClient()
  const { user, profile } = useAuth()

  const serializedIds = targetIds.join(",")
  const batchQueryKey = ["reactions-batch", targetType, serializedIds]

  const mutation = useMutation({
    mutationFn: (variables: { emoji: string }) =>
      toggleReactionAction({ targetId, targetType, emoji: variables.emoji }),

    onMutate: async ({ emoji }) => {
      if (!user || !profile) {
        throw new Error("Unauthorized: Authentication state missing.")
      }

      await queryClient.cancelQueries({ queryKey: batchQueryKey })

      const prevBatchData = queryClient.getQueryData<BatchReactionsData>(batchQueryKey)

      const currentItem = prevBatchData?.[targetId]
      const prevSummary = currentItem?.summary || {
        allReactions: [],
        totalReactions: 0,
        totalEmojis: 0,
      }
      const prevReaction = currentItem?.userReaction || null

      const isRemoving = prevReaction?.emoji === emoji

      let updatedReactions = [...prevSummary.allReactions]

      if (prevReaction) {
        updatedReactions = updatedReactions
          .map((r) => (r.emoji === prevReaction.emoji ? { ...r, count: r.count - 1 } : r))
          .filter((r) => r.count > 0)
      }

      if (!isRemoving) {
        const existingIndex = updatedReactions.findIndex((r) => r.emoji === emoji)
        if (existingIndex > -1) {
          updatedReactions[existingIndex] = {
            ...updatedReactions[existingIndex],
            count: updatedReactions[existingIndex].count + 1,
          }
        } else {
          updatedReactions.push({ emoji, count: 1 })
        }
      }

      const totalReactions = updatedReactions.reduce((acc, r) => acc + r.count, 0)
      const totalEmojis = updatedReactions.length

      const nextSummary: ReactionSummary = {
        allReactions: updatedReactions,
        totalReactions,
        totalEmojis,
      }

      const nextReaction: Reaction | null = isRemoving
        ? null
        : {
            id: `temp-${Date.now()}`,
            emoji,
            user_id: user.id,
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString(),
            author: profile,
          }

      queryClient.setQueryData<BatchReactionsData>(batchQueryKey, (oldBatch) => {
        return {
          ...oldBatch,
          [targetId]: {
            summary: nextSummary,
            userReaction: nextReaction,
          },
        }
      })

      return { prevBatchData }
    },

    onError: (_err, _variables, context) => {
      if (context?.prevBatchData) {
        queryClient.setQueryData(batchQueryKey, context.prevBatchData)
      }
    },

    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: batchQueryKey })
    },
  })

  return {
    toggle: mutation.mutate,
    isPending: mutation.isPending,
  }
}
