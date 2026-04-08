import type { InfiniteData } from "@tanstack/react-query"
import { useMutation, useQueryClient } from "@tanstack/react-query"
import { addComment, deleteComment } from "../services/comments"
import type { CommentData, PaginatedComments } from "../types/comments.types"
import { useAuth } from "@/providers/AuthProvider"

type UseCommentMutationParams = {
  targetId: string
  targetType: string
}

/**
 * Custom hook to handle top-level comment mutations (add and delete).
 * * This hook implements high-performance **Optimistic Updates** by:
 * 1. Prepending/removing items directly in the `InfiniteData` cache to avoid full list re-fetches.
 * 2. Synchronizing the `comment-count` cache to ensure UI counters remain reactive and accurate.
 * 3. Providing atomic rollbacks via `context` if server-side mutations fail.
 * @param {UseCommentMutationParams} params - The configuration object.
 * @param {string} params.targetId - The unique UUID of the parent entity (e.g., project_id).
 * @param {string} params.targetType - The category used for query key mapping (e.g., "project").
 * @returns {Object} An object containing `add` and `remove` mutate functions, along with their pending states.
 */
export function useCommentMutation({ targetId, targetType }: UseCommentMutationParams) {
  const queryClient = useQueryClient()
  const queryKey = ["comments", targetType, targetId]
  const countKey = ["comment-count", targetType, targetId]

  const { user, profile } = useAuth()

  /**
   * Mutation to create a new top-level comment.
   * Optimistically prepends the new comment to the first page of the cache.
   */
  const add = useMutation({
    mutationFn: addComment,
    onMutate: async (variables) => {
      if (!user || !profile) return

      await queryClient.cancelQueries({ queryKey })
      await queryClient.cancelQueries({ queryKey: countKey })

      const previous = queryClient.getQueryData<InfiniteData<PaginatedComments>>(queryKey)
      const previousCount = queryClient.getQueryData<number>(countKey)

      // OPTIMISTIC DATA
      const optimisticCommentData: CommentData = {
        id: `temp-${Date.now()}`,
        content: variables.content,
        user_id: user.id,
        created_at: new Date().toISOString(),
        replies_count: 0,
        author: profile,
        recipient: null,
        parent_id: variables.parentId,
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

      queryClient.setQueryData<InfiniteData<PaginatedComments>>(queryKey, (old) => {
        if (!old) return old
        return {
          ...old,
          pages: old.pages.map((page, i) =>
            i === 0 ? { ...page, data: [optimisticCommentData, ...page.data] } : page
          ),
        }
      })

      queryClient.setQueryData<number>(countKey, (old) => (old ?? 0) + 1)

      return { previous, previousCount }
    },
    onError: (_err, _newComment, context) => {
      queryClient.setQueryData(queryKey, context?.previous)
      queryClient.setQueryData(countKey, context?.previousCount)
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey })
      queryClient.invalidateQueries({ queryKey: countKey })
    }
  })

  /**
   * Mutation to delete a comment.
   * Optimistically removes the comment using a short-circuit search to save CPU.
   */
  const remove = useMutation({
    mutationFn: deleteComment,
    onMutate: async (comment) => {
      if (!user || !profile) return

      await queryClient.cancelQueries({ queryKey })
      await queryClient.cancelQueries({ queryKey: countKey })

      const previous = queryClient.getQueryData<InfiniteData<PaginatedComments>>(queryKey)
      const previousCount = queryClient.getQueryData<number>(countKey)

      queryClient.setQueryData<InfiniteData<PaginatedComments>>(queryKey, (old) => {
        if (!old) return old
        return {
          ...old,
          pages: old.pages.map((page) => ({
            ...page,
            data: page.data.filter((c) => c.id !== comment.commentId),
          })),
        }
      })

      queryClient.setQueryData<number>(countKey, (old) => 
        Math.max(0, (old ?? 0) - 1)
      )

      return { previous, previousCount }
    },
    onError: (_err, _id, context) => {
      queryClient.setQueryData(queryKey, context?.previous)
      queryClient.setQueryData(countKey, context?.previousCount)
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey })
      queryClient.invalidateQueries({ queryKey: countKey })
    }
  })

  return {
    add: add.mutate,
    remove: remove.mutate,
    isAdding: add.isPending,
    isRemoving: remove.isPending,
  }
}
