import { useMemo } from "react"
import type { InfiniteData } from "@tanstack/react-query"
import { useMutation, useQueryClient } from "@tanstack/react-query"
import { addComment, deleteComment, GetBatchCommentCountsResult } from "../services/comments"
import type { CommentData, PaginatedComments, CommentTargetType } from "../types/comments.types"
import { useAuth } from "@/providers/AuthProvider"
import { COMMENTS_PAGE_SIZE } from "../constants/comments.constants"

type UseCommentMutationParams = {
  targetId: string
  targetType: CommentTargetType
  targetIds: string[]
  pageSize?: number
}

export function useCommentMutation({
  targetId,
  targetType,
  targetIds = [],
  pageSize = COMMENTS_PAGE_SIZE,
}: UseCommentMutationParams) {
  const queryClient = useQueryClient()
  const { user, profile } = useAuth()

  const serializedIds = targetIds.join(",")
  const batchCountKey = ["comment-counts-batch", targetType, serializedIds]
  const queryKey = ["comments", targetType, targetId, { pageSize }]

  /**
   * Mutation to create a new top-level comment.
   */
  const add = useMutation({
    mutationFn: addComment,
    onMutate: async (variables) => {
      if (!user || !profile) {
        throw new Error("Unauthorized: Authentication state missing.")
      }

      await queryClient.cancelQueries({ queryKey })
      await queryClient.cancelQueries({ queryKey: batchCountKey })

      const previous = queryClient.getQueryData<InfiniteData<PaginatedComments>>(queryKey)
      const previousBatchComments = queryClient.getQueryData<GetBatchCommentCountsResult>(batchCountKey)

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

      queryClient.setQueryData<GetBatchCommentCountsResult>(batchCountKey, (old) => {
        if (!old) return old
        return {
          ...old,
          [targetId]: (old[targetId] ?? 0) + 1,
        }
      })

      return { previous, previousBatchComments }
    },
    onError: (_err, _variables, context) => {
      if (context?.previous) queryClient.setQueryData(queryKey, context.previous)
      if (context?.previousBatchComments) {
        queryClient.setQueryData(batchCountKey, context.previousBatchComments)
      }
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey })
      queryClient.invalidateQueries({ queryKey: batchCountKey })
    },
  })

  /**
   * Mutation to delete a specific comment.
   */
  const remove = useMutation({
    mutationFn: deleteComment,
    onMutate: async ({ commentId }) => {
      await queryClient.cancelQueries({ queryKey })
      await queryClient.cancelQueries({ queryKey: batchCountKey })

      const previous = queryClient.getQueryData<InfiniteData<PaginatedComments>>(queryKey)
      const previousBatchComments = queryClient.getQueryData<GetBatchCommentCountsResult>(batchCountKey)

      let totalDeleted = 1
      if (previous) {
        for (const page of previous.pages) {
          const targetComment = page.data.find((c) => c.id === commentId)
          if (targetComment) {
            totalDeleted += targetComment.reply_count || 0
            break
          }
        }
      }

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

      queryClient.setQueryData<GetBatchCommentCountsResult>(batchCountKey, (old) => {
        if (!old) return old
        return {
          ...old,
          [targetId]: Math.max(0, (old[targetId] ?? 0) - totalDeleted),
        }
      })

      return { previous, previousBatchComments }
    },
    onError: (_err, _variables, context) => {
      if (context?.previous) queryClient.setQueryData(queryKey, context.previous)
      if (context?.previousBatchComments) {
        queryClient.setQueryData(batchCountKey, context.previousBatchComments)
      }
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey })
      queryClient.invalidateQueries({ queryKey: batchCountKey })
    },
  })

  return {
    add: add.mutate,
    remove: remove.mutate,
    isAdding: add.isPending,
    isRemoving: remove.isPending,
  }
}