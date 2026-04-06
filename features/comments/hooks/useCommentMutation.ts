import { InfiniteData, useMutation, useQueryClient } from "@tanstack/react-query"
import { addComment, deleteComment } from "../services/comments"
import { CommentData, PaginatedComments } from "../types/comments"
import { useAuth } from "@/providers/AuthProvider"

type UseCommentMutationParams = {
  targetId: string
  targetType: string
}

export function useCommentMutation({
  targetId, 
  targetType
}: UseCommentMutationParams ) {
  const queryClient = useQueryClient()
  const queryKey = ["comments", targetType, targetId]
  const { user, profile } = useAuth()

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
        updated_at: new Date().toISOString()
      }
      
      queryClient.setQueryData<InfiniteData<PaginatedComments>>(queryKey, (old) => {
        if (!old) return old
        return {
          ...old,
          pages: old.pages.map((page, i) => 
            i === 0 
              ? { ...page, data: [optimisticCommentData, ...page.data] } 
              : page
          )
        }
      })

      return { previous }
    },
    onError: (_err, _newComment, context) => {
      queryClient.setQueryData(queryKey, context?.previous)
    },
    onSettled: () => queryClient.invalidateQueries({ queryKey })
  })

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
            data: page.data.filter((c) => c.id !== comment.commentId)
          }))
        }
      })

      return { previous }
    },
    onError: (_err, _id, context) => {
      queryClient.setQueryData(queryKey, context?.previous)
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey })
    }
  })

  return {
    add: add.mutate,
    remove: remove.mutate,
    isAdding: add.isPending,
    isRemoving: remove.isPending
  }
}