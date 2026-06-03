import type { InfiniteData } from "@tanstack/react-query"
import { useMutation, useQueryClient } from "@tanstack/react-query"
import type { CommentData, PaginatedComments, CommentTargetType } from "../types/comments.types"
import { useAuth } from "@/providers/AuthProvider"
import { addReply, deleteReply } from "../services/replies"
import { COMMENTS_PAGE_SIZE, REPLIES_PAGE_SIZE } from "../constants/comments.constants"

type UseReplyMutationParams = {
  targetId: string
  targetType: CommentTargetType
  commentPageSize?: number
  replyPageSize?: number
}

/**
 * Hook to manage reply mutations with multi-layered Optimistic Updates.
 * * Synchronizes three layers of cache:
 * 1. **Replies Thread**: The specific list of replies for a parent comment.
 * 2. **Main Comment List**: The parent comment's `reply_count` property.
 * 3. **Global Counter**: The total interaction count for the target entity.
 */
export function useReplyMutation({
  targetId,
  targetType,
  commentPageSize = COMMENTS_PAGE_SIZE,
  replyPageSize = REPLIES_PAGE_SIZE,
}: UseReplyMutationParams) {
  const queryClient = useQueryClient()

  const mainCommentsKey = ["comments", targetType, targetId, { pageSize: commentPageSize }]
  const countKey = ["comment-count", targetType, targetId]

  const { user, profile } = useAuth()

  const add = useMutation({
    mutationFn: addReply,
    onMutate: async (variables) => {
      if (!user || !profile) return

      const pId = variables.parentId
      const repliesKey = ["replies", pId, { pageSize: replyPageSize }]

      await queryClient.cancelQueries({ queryKey: repliesKey })
      await queryClient.cancelQueries({ queryKey: mainCommentsKey })
      await queryClient.cancelQueries({ queryKey: countKey })

      const previousReplies = queryClient.getQueryData<InfiniteData<PaginatedComments>>(repliesKey)
      const previousMain =
        queryClient.getQueryData<InfiniteData<PaginatedComments>>(mainCommentsKey)
      const previousCount = queryClient.getQueryData<number>(countKey)

      const optimisticReply: CommentData = {
        id: `temp-${Date.now()}`,
        content: variables.content,
        user_id: user.id,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
        parent_id: pId,
        recipient_id: variables.recipientId ?? null,
        reply_to_id: variables.replyToId ?? null,
        author: profile,
        recipient: variables.optimisticRecipient ?? null,
        reply_count: 0,
        reaction_summary: {
          allReactions: [],
          totalReactions: 0,
          totalEmojis: 0,
        },
      }

      queryClient.setQueryData<InfiniteData<PaginatedComments>>(repliesKey, (old) => {
        if (!old) {
          return {
            pages: [{ data: [optimisticReply], hasMore: false, nextCursor: null }],
            pageParams: [undefined],
          }
        }

        const lastPageIndex = old.pages.length - 1

        return {
          ...old,
          pages: old.pages.map((page, i) =>
            i === lastPageIndex ? { ...page, data: [...page.data, optimisticReply] } : page
          ),
        }
      })

      queryClient.setQueryData<InfiniteData<PaginatedComments>>(mainCommentsKey, (old) => {
        if (!old) return old
        return {
          ...old,
          pages: old.pages.map((page) => ({
            ...page,
            data: page.data.map((c) =>
              c.id === pId ? { ...c, reply_count: (c.reply_count || 0) + 1 } : c
            ),
          })),
        }
      })

      queryClient.setQueryData<number>(countKey, (old) => (old ?? 0) + 1)

      return { previousReplies, previousMain, previousCount, repliesKey }
    },
    onError: (_err, _vars, context) => {
      if (context?.repliesKey) queryClient.setQueryData(context.repliesKey, context.previousReplies)
      if (context?.previousMain) queryClient.setQueryData(mainCommentsKey, context.previousMain)
      if (context?.previousCount !== undefined)
        queryClient.setQueryData(countKey, context.previousCount)
    },
    onSettled: (_data, _error, variables) => {
      const repliesKey = ["replies", variables.parentId, { pageSize: replyPageSize }]
      queryClient.invalidateQueries({ queryKey: repliesKey })
      queryClient.invalidateQueries({ queryKey: mainCommentsKey })
      queryClient.invalidateQueries({ queryKey: countKey })
    },
  })

  const remove = useMutation({
    mutationFn: deleteReply,
    onMutate: async (variables) => {
      const pId = variables.parentId
      const repliesKey = ["replies", pId, { pageSize: replyPageSize }]

      await queryClient.cancelQueries({ queryKey: repliesKey })
      await queryClient.cancelQueries({ queryKey: mainCommentsKey })
      await queryClient.cancelQueries({ queryKey: countKey })

      const previousReplies = queryClient.getQueryData<InfiniteData<PaginatedComments>>(repliesKey)
      const previousMain =
        queryClient.getQueryData<InfiniteData<PaginatedComments>>(mainCommentsKey)
      const previousCount = queryClient.getQueryData<number>(countKey)

      let totalDeleted = 1
      if (previousReplies) {
        for (const page of previousReplies.pages) {
          const targetReply = page.data.find((c) => c.id === variables.commentId)
          if (targetReply) {
            totalDeleted += targetReply.reply_count || 0
            break
          }
        }
      }

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

      queryClient.setQueryData<InfiniteData<PaginatedComments>>(mainCommentsKey, (old) => {
        if (!old) return old
        return {
          ...old,
          pages: old.pages.map((page) => ({
            ...page,
            data: page.data.map((c) =>
              c.id === pId ? { ...c, reply_count: Math.max(0, (c.reply_count || 0) - totalDeleted) } : c
            ),
          })),
        }
      })

      queryClient.setQueryData<number>(countKey, (old) => Math.max(0, (old ?? 0) - totalDeleted))

      return { previousReplies, previousMain, previousCount, repliesKey }
    },
    onError: (_err, _vars, context) => {
      if (context?.repliesKey) queryClient.setQueryData(context.repliesKey, context.previousReplies)
      if (context?.previousMain) queryClient.setQueryData(mainCommentsKey, context.previousMain)
      if (context?.previousCount !== undefined)
        queryClient.setQueryData(countKey, context.previousCount)
    },
    onSettled: (_data, _error, variables) => {
      const repliesKey = ["replies", variables.parentId, { pageSize: replyPageSize }]
      queryClient.invalidateQueries({ queryKey: repliesKey })
      queryClient.invalidateQueries({ queryKey: mainCommentsKey })
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