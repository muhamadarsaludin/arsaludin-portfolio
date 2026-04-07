import { useMutation, useQueryClient, InfiniteData } from "@tanstack/react-query"
import { useAuth } from "@/providers/AuthProvider"
import { toggleReaction } from "../services/reactions"
import type { 
  ReactionSummary, 
  ReactionTargetType, 
  Reaction, 
  PaginatedReactions 
} from "../types/reactions.types"
import { MAX_TOP_REACTIONS } from "../constants/reactions.constants"

/**
 * Handles toggling reactions with Optimistic UI Updates.
 * Orchestrates synchronization between 'reaction-summary' and 'reactions' (user list) caches.
 * * @param params.targetId - The UUID of the target entity.
 * @param params.targetType - The classification of the target ("project" | "comment").
 * @param params.topReactionsCount - Syncs with the summary query's slice logic.
 */
export function useReactionMutation({ 
  targetId, 
  targetType,
  topReactionsCount = MAX_TOP_REACTIONS 
}: { 
  targetId: string; 
  targetType: ReactionTargetType;
  topReactionsCount?: number
}) {
  const queryClient = useQueryClient()
  const { user, profile } = useAuth()
  
  // Keys harus match dengan yang ada di useReactionSummary dan useReactions
  const summaryKey = ["reaction-summary", targetType, targetId, topReactionsCount]
  const reactionsKey = ["reactions", targetType, targetId]

  return useMutation({
    mutationFn: (variables: { emoji: string }) => 
      toggleReaction({ targetId, targetType, emoji: variables.emoji }),
    
    onMutate: async ({ emoji }) => {
      if (!user || !profile) return

      // Stop refetch background biar gak tabrakan sama data "palsu" kita
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
        updated_at: null
      }

      queryClient.setQueryData<ReactionSummary>(summaryKey, (old) => {
        const current = old ?? {
          userReaction: null,
          allReactions: [],
          totalReactions: 0,
          topReactions: [],
          totalEmojis: 0,
          remainingEmojis: 0
        }

        const isRemoving = current.userReaction?.emoji === emoji
        let nextAll = [...current.allReactions]

        if (current.userReaction) {
          nextAll = nextAll.map(r => 
            r.emoji === current.userReaction?.emoji ? { ...r, count: Math.max(0, r.count - 1) } : r
          )
        }

        if (!isRemoving) {
          const idx = nextAll.findIndex(r => r.emoji === emoji)
          if (idx > -1) {
            nextAll[idx] = { ...nextAll[idx], count: nextAll[idx].count + 1 }
          } else {
            nextAll.push({ emoji, count: 1 })
          }
        }

        const filtered = nextAll.filter(r => r.count > 0).sort((a, b) => b.count - a.count)

        return {
          ...current,
          allReactions: filtered,
          userReaction: isRemoving ? null : optimisticUserReaction,
          totalReactions: isRemoving ? current.totalReactions - 1 : (current.userReaction ? current.totalReactions : current.totalReactions + 1),
          topReactions: filtered.slice(0, topReactionsCount),
          totalEmojis: filtered.length,
          remainingEmojis: Math.max(0, filtered.length - topReactionsCount),
        }
      })

      if (prevReactions) {
        queryClient.setQueryData<InfiniteData<PaginatedReactions>>(reactionsKey, (old) => {
          if (!old) return old
          const isRemoving = prevSummary?.userReaction?.emoji === emoji
          
          const newPages = old.pages.map(page => ({
            ...page,
            data: page.data.filter(r => r.user_id !== user.id)
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