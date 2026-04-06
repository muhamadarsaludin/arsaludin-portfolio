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
 * Custom hook to handle reply mutations (add and delete) with Optimistic Updates.
 * Manages cache synchronization between the specific reply thread and the main comment list.
 * @param targetId - The ID of the parent entity.
 * @param targetType - The category of the parent entity for query key mapping.
 */
export function useReplyMutation({ targetId, targetType }: UseReplyMutationParams) {
  const queryClient = useQueryClient()
  const mainCommentsKey = ["comments", targetType, targetId]
  const { user, profile } = useAuth()

  /**
   * Helper to update infinite query pages efficiently.
   * Uses reference equality to skip re-renders for pages that haven't changed.
   */
  const updateCachePages = (
    old: InfiniteData<PaginatedComments> | undefined,
    parentId: string,
    updateFn: (data: CommentData[]) => CommentData[]
  ) => {
    if (!old) return old
    return {
      ...old,
      pages: old.pages.map((page) => {
        // MEMORY OPTIMIZATION:
        // If parentId is not in this page, return the original page reference.
        // This prevents unnecessary object creation and memory allocation.
        const hasTarget = page.data.some((c) => c.id === parentId)
        if (!hasTarget && page.data.length > 0) return page

        return {
          ...page,
          data: updateFn(page.data),
        }
      }),
    }
  }

  /**
   * Mutation to add a new reply.
   * Performs an optimistic update on both the specific reply thread and the parent comment's reply count.
   */
  const add = useMutation({
    mutationFn: addReply,
    onMutate: async (variables) => {
      if (!user || !profile) return

      const pId = variables.parentId
      const repliesKey = ["replies", pId]

      await queryClient.cancelQueries({ queryKey: repliesKey })
      await queryClient.cancelQueries({ queryKey: mainCommentsKey })

      const previousReplies = queryClient.getQueryData<InfiniteData<PaginatedComments>>(repliesKey)
      const previousMain =
        queryClient.getQueryData<InfiniteData<PaginatedComments>>(mainCommentsKey)

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
      }

      queryClient.setQueryData<InfiniteData<PaginatedComments>>(repliesKey, (old) => {
        if (!old) return old
        return {
          ...old,
          pages: old.pages.map((page, i) =>
            i === 0 ? { ...page, data: [...page.data, optimisticReply] } : page
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
              c.id === pId ? { ...c, replies_count: (c.replies_count || 0) + 1 } : c
            ),
          })),
        }
      })

      return { previousReplies, previousMain, pId }
    },
    onError: (_err, _vars, context) => {
      if (context?.pId) {
        queryClient.setQueryData(["replies", context.pId], context.previousReplies)
      }
      queryClient.setQueryData(mainCommentsKey, context?.previousMain)
    },
    onSettled: async (_data, _error, variables) => {
      const pId = variables.parentId
      await Promise.all([
        queryClient.invalidateQueries({ queryKey: ["replies", pId] }),
        queryClient.invalidateQueries({ queryKey: mainCommentsKey }),
      ])
    },
  })

  /**
   * Mutation to delete a reply.
   * Optimistically removes the reply from the thread and decrements the parent's reply count.
   */
  const remove = useMutation({
    mutationFn: deleteReply,
    onMutate: async (variables) => {
      const pId = variables.parentId
      const repliesKey = ["replies", pId]

      await queryClient.cancelQueries({ queryKey: repliesKey })
      await queryClient.cancelQueries({ queryKey: mainCommentsKey })

      const previousReplies = queryClient.getQueryData(repliesKey)
      const previousMain = queryClient.getQueryData(mainCommentsKey)

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
              c.id === pId ? { ...c, replies_count: Math.max(0, (c.replies_count || 0) - 1) } : c
            ),
          })),
        }
      })

      return { previousReplies, previousMain, pId }
    },
    onError: (_err, _vars, context) => {
      if (context?.pId) {
        queryClient.setQueryData(["replies", context.pId], context.previousReplies)
      }
      queryClient.setQueryData(mainCommentsKey, context?.previousMain)
    },
    onSettled: async (_data, _error, variables) => {
      const pId = variables.parentId
      await Promise.all([
        queryClient.invalidateQueries({ queryKey: ["replies", pId] }),
        queryClient.invalidateQueries({ queryKey: mainCommentsKey }),
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
