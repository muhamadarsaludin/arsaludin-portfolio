import type { InfiniteData } from "@tanstack/react-query"
import { useMutation, useQueryClient } from "@tanstack/react-query"
import type { CommentData, PaginatedComments } from "../types/comments.types"
import { useAuth } from "@/providers/AuthProvider"
import { addReply, deleteReply } from "../services/replies"

type UseReplyMutationParams = {
  targetId: string
  targetType: string
}

/**
 * Custom hook to handle reply mutations (add and delete) with comprehensive Optimistic Updates.
 * * This hook synchronizes three distinct cache layers:
 * 1. **Replies Thread**: Prepends/removes the reply in the specific comment thread.
 * 2. **Main Comment List**: Updates the `replies_count` property of the parent comment.
 * 3. **Global Counter**: Updates the total `comment-count` (total interactions) for the target entity.
 * @param {UseReplyMutationParams} params - Configuration object containing targetId and targetType.
 * @param {string} params.targetId - The unique UUID of the entity (e.g., project_id).
 * @param {string} params.targetType - The category used for query key mapping (e.g., "project").
 * @returns {MutationObject} Methods and states for managing replies.
 */
export function useReplyMutation({ targetId, targetType }: UseReplyMutationParams) {
  const queryClient = useQueryClient()
  const mainCommentsKey = ["comments", targetType, targetId]
  const countKey = ["comment-count", targetType, targetId] // Global Counter Key
  const { user, profile } = useAuth()

  /**
   * Mutation to add a new reply.
   */
  const add = useMutation({
    mutationFn: addReply,
    onMutate: async (variables) => {
      if (!user || !profile) return

      const pId = variables.parentId
      const repliesKey = ["replies", pId]

      // Cancel all related queries
      await queryClient.cancelQueries({ queryKey: repliesKey })
      await queryClient.cancelQueries({ queryKey: mainCommentsKey })
      await queryClient.cancelQueries({ queryKey: countKey })

      const previousReplies = queryClient.getQueryData<InfiniteData<PaginatedComments>>(repliesKey)
      const previousMain = queryClient.getQueryData<InfiniteData<PaginatedComments>>(mainCommentsKey)
      const previousCount = queryClient.getQueryData<number>(countKey)

      const optimisticReply: CommentData = {
        id: `temp-${Date.now()}`,
        content: variables.content,
        user_id: user.id,
        created_at: new Date().toISOString(),
        replies_count: 0,
        author: profile,
        recipient: variables.optimisticRecipient,
        parent_id: pId,
        updated_at: new Date().toISOString(),
        reaction_summary: {
          userReaction: null,
          totalReactions: 0,
          allReactions: [],
          topReactions: [],
          totalEmojis: 0,
          remainingEmojis: 0
        }
      }

      // 1. Update Reply Thread List
      queryClient.setQueryData<InfiniteData<PaginatedComments>>(repliesKey, (old) => {
        if (!old) return old
        return {
          ...old,
          pages: old.pages.map((page, i) =>
            i === 0 ? { ...page, data: [...page.data, optimisticReply] } : page
          ),
        }
      })

      // 2. Update parent's replies_count in Main List
      queryClient.setQueryData<InfiniteData<PaginatedComments>>(mainCommentsKey, (old) => {
        if (!old) return old
        return {
          ...old,
          pages: old.pages.map((page) => ({
            ...page,
            data: page.data.map((c) =>
              c.id === pId ? { ...c, replies_count: (c.replies_count || 0) + 1 } : c
            ),
          })),
        }
      })

      // 3. Update Global Comment Count (+1)
      queryClient.setQueryData<number>(countKey, (old) => (old ?? 0) + 1)

      return { previousReplies, previousMain, previousCount, pId }
    },
    onError: (_err, _vars, context) => {
      if (context?.pId) {
        queryClient.setQueryData(["replies", context.pId], context.previousReplies)
      }
      queryClient.setQueryData(mainCommentsKey, context?.previousMain)
      queryClient.setQueryData(countKey, context?.previousCount)
    },
    onSettled: async (_data, _error, variables) => {
      const pId = variables.parentId
      await Promise.all([
        queryClient.invalidateQueries({ queryKey: ["replies", pId] }),
        queryClient.invalidateQueries({ queryKey: mainCommentsKey }),
        queryClient.invalidateQueries({ queryKey: countKey }),
      ])
    },
  })

  /**
   * Mutation to delete a reply.
   */
  const remove = useMutation({
    mutationFn: deleteReply,
    onMutate: async (variables) => {
      if (!user || !profile) return
      
      const pId = variables.parentId
      const repliesKey = ["replies", pId]

      await queryClient.cancelQueries({ queryKey: repliesKey })
      await queryClient.cancelQueries({ queryKey: mainCommentsKey })
      await queryClient.cancelQueries({ queryKey: countKey })

      const previousReplies = queryClient.getQueryData(repliesKey)
      const previousMain = queryClient.getQueryData(mainCommentsKey)
      const previousCount = queryClient.getQueryData<number>(countKey)

      // 1. Remove from Reply Thread
      queryClient.setQueryData<InfiniteData<PaginatedComments>>(repliesKey, (old) => {
        if (!old) return old
        return {
          ...old,
          pages: old.pages.map((page) => ({
            ...page,
            data: page.data.filter((c) => c.id !== variables.commentId),
          })),
        }
      })

      // 2. Decrement parent's replies_count in Main List
      queryClient.setQueryData<InfiniteData<PaginatedComments>>(mainCommentsKey, (old) => {
        if (!old) return old
        return {
          ...old,
          pages: old.pages.map((page) => ({
            ...page,
            data: page.data.map((c) =>
              c.id === pId ? { ...c, replies_count: Math.max(0, (c.replies_count || 0) - 1) } : c
            ),
          })),
        }
      })

      // 3. Update Global Comment Count (-1)
      queryClient.setQueryData<number>(countKey, (old) => Math.max(0, (old ?? 0) - 1))

      return { previousReplies, previousMain, previousCount, pId }
    },
    onError: (_err, _vars, context) => {
      if (context?.pId) {
        queryClient.setQueryData(["replies", context.pId], context.previousReplies)
      }
      queryClient.setQueryData(mainCommentsKey, context?.previousMain)
      queryClient.setQueryData(countKey, context?.previousCount)
    },
    onSettled: async (_data, _error, variables) => {
      const pId = variables.parentId
      await Promise.all([
        queryClient.invalidateQueries({ queryKey: ["replies", pId] }),
        queryClient.invalidateQueries({ queryKey: mainCommentsKey }),
        queryClient.invalidateQueries({ queryKey: countKey }),
      ])
    },
  })

  return {
    add: add.mutate,
    remove: remove.mutate,
    isAdding: add.isPending,
    isRemoving: remove.isPending,
  }
}
