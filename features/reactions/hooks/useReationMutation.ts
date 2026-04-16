"use client"

import type { InfiniteData } from "@tanstack/react-query"
import { useMutation, useQueryClient } from "@tanstack/react-query"
import { useAuth } from "@/providers/AuthProvider"
import { toggleReaction } from "../services/reactions"
import type {
  ReactionSummary,
  ReactionTargetType,
  Reaction,
  PaginatedReactions,
} from "../types/reactions.types"

/**
 * Handles toggling reactions with Optimistic UI Updates.
 * Orchestrates synchronization between 'reaction-summary' and 'reactions' caches.
 * @param targetId - The UUID of the target entity.
 * @param targetType - The classification of the target ("project" | "comment").
 */
export function useReactionMutation({
  targetId,
  targetType
}: {
  targetId: string
  targetType: ReactionTargetType
}) {
  const queryClient = useQueryClient()
  const { user, profile } = useAuth()

  const summaryKey = ["reaction-summary", targetType, targetId]
  const reactionsKey = ["reactions", targetType, targetId]

  return useMutation({
    mutationFn: (variables: { emoji: string }) =>
      toggleReaction({ targetId, targetType, emoji: variables.emoji }),

    onMutate: async ({ emoji }) => {
      if (!user || !profile) return

      await queryClient.cancelQueries({ queryKey: summaryKey })
      await queryClient.cancelQueries({ queryKey: reactionsKey })

      const prevSummary = queryClient.getQueryData<ReactionSummary>(summaryKey)
      const prevReactions = queryClient.getQueryData<InfiniteData<PaginatedReactions>>(reactionsKey)

      const optimisticUserReaction: Reaction = {
        id: `temp-${Date.now()}`,
        emoji,
        user_id: user.id,
        author: profile,
        created_at: new Date().toISOString(),
        updated_at: null,
      }

      // 1. Update Reaction Summary (Optimistic)
      queryClient.setQueryData<ReactionSummary>(summaryKey, (old) => {
        if (!old) return old

        const isRemoving = old.userReaction?.emoji === emoji
        let nextAll = [...old.allReactions]

        if (old.userReaction) {
          nextAll = nextAll.map((r) =>
            r.emoji === old.userReaction?.emoji 
              ? { ...r, count: Math.max(0, r.count - 1) } 
              : r
          )
        }

        if (!isRemoving) {
          const idx = nextAll.findIndex((r) => r.emoji === emoji)
          if (idx > -1) {
            nextAll[idx] = { ...nextAll[idx], count: nextAll[idx].count + 1 }
          } else {
            nextAll.push({ emoji, count: 1 })
          }
        }

        const filteredAndSorted = nextAll
          .filter((r) => r.count > 0)
          .sort((a, b) => b.count - a.count || a.emoji.localeCompare(b.emoji))

        return {
          ...old,
          allReactions: filteredAndSorted,
          userReaction: isRemoving ? null : optimisticUserReaction,
          totalReactions: isRemoving
            ? old.totalReactions - 1
            : old.userReaction
              ? old.totalReactions
              : old.totalReactions + 1,
          totalEmojis: filteredAndSorted.length,
        }
      })

      // 2. Update Reactions List (Optimistic)
      if (prevReactions) {
        queryClient.setQueryData<InfiniteData<PaginatedReactions>>(reactionsKey, (old) => {
          if (!old) return old
          const isRemoving = prevSummary?.userReaction?.emoji === emoji

          const newPages = old.pages.map((page) => ({
            ...page,
            data: page.data.filter((r) => r.user_id !== user.id),
          }))

          if (!isRemoving) {
            newPages[0].data = [optimisticUserReaction, ...newPages[0].data]
          }

          return { ...old, pages: newPages }
        })
      }

      return { prevSummary, prevReactions }
    },

    onError: (_err, _variables, context) => {
      if (context?.prevSummary) queryClient.setQueryData(summaryKey, context.prevSummary)
      if (context?.prevReactions) queryClient.setQueryData(reactionsKey, context.prevReactions)
    },

    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: summaryKey })
      queryClient.invalidateQueries({ queryKey: reactionsKey })
    },
  })
}