import type { InfiniteData } from "@tanstack/react-query"
import { useMutation, useQueryClient } from "@tanstack/react-query"
import { addComment, deleteComment } from "../services/comments"
import type { CommentData, PaginatedComments, CommentTargetType } from "../types/comments.types"
import { useAuth } from "@/providers/AuthProvider"
import { COMMENTS_PAGE_SIZE } from "../constants/comments.constants"

type UseCommentMutationParams = {
  targetId: string
  targetType: CommentTargetType
  pageSize?: number
}

/**
 * Custom hook to handle top-level comment mutations with optimistic updates.
 * @param targetId - The unique UUID of the parent entity (e.g., project_id).
 * @param targetType - The category used for query key mapping (e.g., "project").
 * @param pageSize - Limits the number of comments returned in a single fetch.
 * @returns An object containing `add` and `remove` mutate functions, along with their pending states.
 */
export function useCommentMutation({
  targetId,
  targetType,
  pageSize = COMMENTS_PAGE_SIZE,
}: UseCommentMutationParams) {
  const queryClient = useQueryClient()
  const queryKey = ["comments", targetType, targetId, { pageSize }]
  const countKey = ["comment-count", targetType, targetId]
  const { user, profile } = useAuth()

  /**
   * Mutation to create a new top-level comment.
   */
  const add = useMutation({
    mutationFn: addComment,
    onMutate: async (variables) => {
      if (!user || !profile) return

      await queryClient.cancelQueries({ queryKey })
      await queryClient.cancelQueries({ queryKey: countKey })

      const previous = queryClient.getQueryData<InfiniteData<PaginatedComments>>(queryKey)
      const previousCount = queryClient.getQueryData<number>(countKey)

      const optimisticCommentData: CommentData = {
        id: `temp-${Date.now()}`,
        content: variables.content,
        user_id: user.id,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
        parent_id: variables.parentId ?? null,
        recipient_id: variables.recipientId ?? null,
        reply_to_id: variables.replyToId ?? null,
        author: profile,
        recipient: null,
        reply_count: 0,
        reaction_summary: {
          userReaction: null,
          allReactions: [],
          totalReactions: 0,
          totalEmojis: 0,
        },
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
    onError: (_err, _variables, context) => {
      if (context?.previous) queryClient.setQueryData(queryKey, context.previous)
      if (context?.previousCount !== undefined)
        queryClient.setQueryData(countKey, context.previousCount)
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey })
      queryClient.invalidateQueries({ queryKey: countKey })
    },
  })

  /**
   * Mutation to delete a specific comment.
   */
  const remove = useMutation({
    mutationFn: deleteComment,
    onMutate: async ({ commentId }) => {
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
            data: page.data.filter((c) => c.id !== commentId),
          })),
        }
      })

      queryClient.setQueryData<number>(countKey, (old) => Math.max(0, (old ?? 0) - 1))

      return { previous, previousCount }
    },
    onError: (_err, _variables, context) => {
      if (context?.previous) queryClient.setQueryData(queryKey, context.previous)
      if (context?.previousCount !== undefined)
        queryClient.setQueryData(countKey, context.previousCount)
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey })
      queryClient.invalidateQueries({ queryKey: countKey })
    },
  })

  return {
    add: add.mutate,
    remove: remove.mutate,
    isAdding: add.isPending,
    isRemoving: remove.isPending,
  }
}
