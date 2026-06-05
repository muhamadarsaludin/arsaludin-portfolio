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

  // 1. Kunci kueri list komentar individual (Halaman Detail)
  const queryKey = ["comments", targetType, targetId, { pageSize }]

  // 2. 🎯 KUNCI PARSIAL: Gunakan ini untuk menyapu bersih semua laci batching (List & Detail)
  const batchCountPartialKey = ["comment-counts-batch", targetType]

  /**
   * Mutation to create a new top-level comment.
   */
  const add = useMutation({
    mutationFn: addComment,
    onMutate: async (variables) => {
      if (!user || !profile) {
        throw new Error("Unauthorized: Authentication state missing.")
      }

      // Batalin kueri detail dan seluruh kueri batch sejenis agar tidak bentrok data
      await queryClient.cancelQueries({ queryKey })
      await queryClient.cancelQueries({ queryKey: batchCountPartialKey, exact: false })

      // Backup data lama list detail
      const previous = queryClient.getQueryData<InfiniteData<PaginatedComments>>(queryKey)
      
      // 🎯 BACKUP MASSAL: Ambil snapshot dari semua laci batching yang ada di memori browser saat ini
      const previousBatchQueries = queryClient.getQueriesData<GetBatchCommentCountsResult>({
        queryKey: batchCountPartialKey,
        exact: false,
      })

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

      // Layer 1: Update List Komentar Detail
      queryClient.setQueryData<InfiniteData<PaginatedComments>>(queryKey, (old) => {
        if (!old) return old
        return {
          ...old,
          pages: old.pages.map((page, i) =>
            i === 0 ? { ...page, data: [optimisticCommentData, ...page.data] } : page
          ),
        }
      })

      // Layer 2: 🎯 JURUS GEDOR MASSAL (+1): Dongkrak angka proyek ini di seluruh laci batching
      queryClient.setQueriesData<GetBatchCommentCountsResult>(
        { queryKey: batchCountPartialKey, exact: false },
        (old) => {
          const safeOld = old ?? {}
          return {
            ...safeOld,
            [targetId]: (safeOld[targetId] ?? 0) + 1,
          }
        }
      )

      return { previous, previousBatchQueries }
    },
    onError: (_err, _variables, context) => {
      if (context?.previous) queryClient.setQueryData(queryKey, context.previous)
      
      // 🎯 ROLLBACK MASSAL: Kembalikan kondisi semua laci batching ke semula jika server error
      if (context?.previousBatchQueries) {
        context.previousBatchQueries.forEach(([key, oldData]) => {
          queryClient.setQueryData(key, oldData)
        })
      }
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey })
      // 🎯 INVALIDATE MASSAL: Paksa hangus semua cache batching biar disinkronkan ulang dari backend pusat
      queryClient.invalidateQueries({ queryKey: batchCountPartialKey, exact: false })
    },
  })

  /**
   * Mutation to delete a specific comment.
   */
  const remove = useMutation({
    mutationFn: deleteComment,
    onMutate: async ({ commentId }) => {
      await queryClient.cancelQueries({ queryKey })
      await queryClient.cancelQueries({ queryKey: batchCountPartialKey, exact: false })

      const previous = queryClient.getQueryData<InfiniteData<PaginatedComments>>(queryKey)
      
      // 🎯 BACKUP MASSAL sebelum data dipotong
      const previousBatchQueries = queryClient.getQueriesData<GetBatchCommentCountsResult>({
        queryKey: batchCountPartialKey,
        exact: false,
      })

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

      // Layer 1: Hapus komentar dari list UI detail
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

      // Layer 2: 🎯 JURUS GEDOR MASSAL (-totalDeleted): Sunat angka proyek ini di seluruh laci batching sekaligus
      queryClient.setQueriesData<GetBatchCommentCountsResult>(
        { queryKey: batchCountPartialKey, exact: false },
        (old) => {
          const safeOld = old ?? {}
          return {
            ...safeOld,
            [targetId]: Math.max(0, (safeOld[targetId] ?? 0) - totalDeleted),
          }
        }
      )

      return { previous, previousBatchQueries }
    },
    onError: (_err, _variables, context) => {
      if (context?.previous) queryClient.setQueryData(queryKey, context.previous)
      
      // 🎯 ROLLBACK MASSAL
      if (context?.previousBatchQueries) {
        context.previousBatchQueries.forEach(([key, oldData]) => {
          queryClient.setQueryData(key, oldData)
        })
      }
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey })
      queryClient.invalidateQueries({ queryKey: batchCountPartialKey, exact: false })
    },
  })

  return {
    add: add.mutate,
    remove: remove.mutate,
    isAdding: add.isPending,
    isRemoving: remove.isPending,
  }
}