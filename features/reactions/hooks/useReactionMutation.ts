"use client"

import type { InfiniteData } from "@tanstack/react-query"
import { useMutation, useQueryClient } from "@tanstack/react-query"
import { useAuth } from "@/providers/AuthProvider"
import { toggleReactionAction } from "../services/reactions"
import type {
  ReactionSummary,
  ReactionTargetType,
  Reaction
} from "../types/reactions.types"

type UseReactionMutationParams = {
  targetId: string
  targetType: ReactionTargetType
}

/**
 * Custom hook to handle reaction mutations with Optimistic UI updates.
 * * @param params - Configuration object for the mutation lifecycle
 * @param params.targetId - The unique identifier of the target entity
 * @param params.targetType - The type of target entity (e.g., 'project', 'blog')
 * @returns An object containing the `toggle` trigger function and its pending state
 */
export function useReactionMutation({ 
  targetId, 
  targetType 
}: UseReactionMutationParams) {
  const queryClient = useQueryClient()

  const reactionSummaryKey = ["reaction-summary", targetType, targetId]
  const userReactionKey = ["user-reaction", targetType, targetId]
  const { user, profile } = useAuth()


  const toggle = useMutation({
    mutationFn: (variables: { emoji: string }) => toggleReactionAction({ targetId, targetType, emoji: variables.emoji }),
    onMutate: async ({ emoji }) => {
      if (!user || !profile) {
        throw new Error("Unauthorized: Authentication state missing.")
      }

      await queryClient.cancelQueries({ queryKey: reactionSummaryKey })
      await queryClient.cancelQueries({ queryKey: userReactionKey })

      const prevSummary = queryClient.getQueryData<ReactionSummary>(reactionSummaryKey)
      const prevReaction = queryClient.getQueryData<Reaction | null>(userReactionKey)

      const isRemoving = prevReaction?.emoji === emoji

      // Optimistically update User's personal reaction state
      queryClient.setQueryData<Reaction | null>(userReactionKey, () => {
        if (isRemoving) return null
        const now = new Date().toISOString()
        return {
          id: `temp-${Date.now()}`,
          emoji,
          user_id: user.id,
          created_at: now,
          updated_at: now,
          author: profile,
        }
      })

      // Optimistically update the Reaction Summary state
      queryClient.setQueryData<ReactionSummary>(reactionSummaryKey, (oldSummary) => {
        const defaultSummary: ReactionSummary = { allReactions: [], totalReactions: 0, totalEmojis: 0 }
        const summary = oldSummary ?? defaultSummary

        let updatedReactions = [...summary.allReactions]

        // 1. Subtract the old reaction if removing or changing
        if (prevReaction) {
          updatedReactions = updatedReactions
            .map((r) => (r.emoji === prevReaction.emoji ? { ...r, count: r.count - 1 } : r))
            .filter((r) => r.count > 0)
        }

        // 2. Add the new reaction if we aren't clicking to remove
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
        // Step C: Recalculate totals
        const totalReactions = updatedReactions.reduce((acc, r) => acc + r.count, 0)
        const totalEmojis = updatedReactions.length

        return {
          allReactions: updatedReactions,
          totalReactions,
          totalEmojis,
        }
      })
      return { prevReaction, prevSummary }
    },

    onError: (_err, _variables, context) => {
      if (context) {
        queryClient.setQueryData(reactionSummaryKey, context.prevSummary)
        queryClient.setQueryData(userReactionKey, context.prevReaction)
      }
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: reactionSummaryKey })
      queryClient.invalidateQueries({ queryKey: userReactionKey })
    }
  })
  
  return {
    toggle: toggle.mutate,
    isPending: toggle.isPending,
  }
}