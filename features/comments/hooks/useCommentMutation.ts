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
 * Implements high-performance Optimistic Updates by targeting specific cache pages
 * and minimizing unnecessary re-renders.
 * @param targetId - The ID of the parent entity.
 * @param targetType - The category used for query key mapping.
 */
export function useCommentMutation({ targetId, targetType }: UseCommentMutationParams) {
  const queryClient = useQueryClient()
  const queryKey = ["comments", targetType, targetId]
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
      const previous = queryClient.getQueryData<InfiniteData<PaginatedComments>>(queryKey)

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

      return { previous }
    },
    onError: (_err, _newComment, context) => {
      queryClient.setQueryData(queryKey, context?.previous)
    },
    onSettled: () => queryClient.invalidateQueries({ queryKey }),
  })

  /**
   * Mutation to delete a comment.
   * Optimistically removes the comment using a short-circuit search to save CPU.
   */
  const remove = useMutation({
    mutationFn: deleteComment,
    onMutate: async (comment) => {
      await queryClient.cancelQueries({ queryKey })
      const previous = queryClient.getQueryData<InfiniteData<PaginatedComments>>(queryKey)

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

      return { previous }
    },
    onError: (_err, _id, context) => {
      queryClient.setQueryData(queryKey, context?.previous)
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey })
    },
  })

  return {
    add: add.mutate,
    remove: remove.mutate,
    isAdding: add.isPending,
    isRemoving: remove.isPending,
  }
}
