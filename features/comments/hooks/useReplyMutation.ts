import { InfiniteData, useMutation, useQueryClient } from "@tanstack/react-query"
import { addComment, deleteComment } from "../services/comments"
import { CommentData, PaginatedComments } from "../types/comments"
import { useAuth } from "@/providers/AuthProvider"
import { addReply, deleteReply } from "../services/replies"

type UseReplyMutationParams = {
  targetId: string 
  targetType: string
}

export function useReplyMutation({
  targetId,
  targetType
}: UseReplyMutationParams) {
  const queryClient = useQueryClient()
  const mainCommentsKey = ["comments", targetType, targetId]
  const { user, profile } = useAuth()

  const add = useMutation({
    mutationFn: addReply,
    onMutate: async (variables) => {
      if (!user || !profile) return
      
      const pId = variables.parentId
      const repliesKey = ["replies", pId]

      await queryClient.cancelQueries({ queryKey: repliesKey })
      await queryClient.cancelQueries({ queryKey: mainCommentsKey })

      const previousReplies = queryClient.getQueryData<InfiniteData<PaginatedComments>>(repliesKey)
      const previousMain = queryClient.getQueryData<InfiniteData<PaginatedComments>>(mainCommentsKey)

      const optimisticReply: CommentData = {
        id: `temp-${Date.now()}`,
        content: variables.content,
        user_id: user.id,
        created_at: new Date().toISOString(),
        replies_count: 0,
        author: profile,
        recipient: variables.optimisticRecipient,
        parent_id: pId,
        updated_at: new Date().toISOString()
      }
      
      // Update Cache Replies
      queryClient.setQueryData<InfiniteData<PaginatedComments>>(repliesKey, (old) => {
        if (!old) return old
        return {
          ...old,
          pages: old.pages.map((page, i) => 
            i === 0 ? { ...page, data: [...page.data, optimisticReply] } : page
          )
        }
      })

      // Update Count di Cache Utama
      queryClient.setQueryData<InfiniteData<PaginatedComments>>(mainCommentsKey, (old) => {
        if (!old) return old
        return {
          ...old,
          pages: old.pages.map((page) => ({
            ...page,
            data: page.data.map((c) => 
              c.id === pId ? { ...c, replies_count: (c.replies_count || 0) + 1 } : c
            )
          }))
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
      // Gunakan await agar transisi optimistic ke server data mulus
      await Promise.all([
        queryClient.invalidateQueries({ queryKey: ["replies", pId] }),
        queryClient.invalidateQueries({ queryKey: mainCommentsKey })
      ])
    }
  })

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
            data: page.data.filter((c) => c.id !== variables.commentId)
          }))
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
            )
          }))
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
        queryClient.invalidateQueries({ queryKey: mainCommentsKey })
      ])
    }
  })

  return {
    add: add.mutate,
    remove: remove.mutate,
    isAdding: add.isPending,
    isRemoving: remove.isPending
  }
}