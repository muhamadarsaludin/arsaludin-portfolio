import { useMemo } from "react"
import type { InfiniteData } from "@tanstack/react-query"
import { useMutation, useQueryClient } from "@tanstack/react-query"
import type { CommentData, PaginatedComments, CommentTargetType } from "../types/comments.types"
import { GetBatchCommentCountsResult } from "../services/comments"
import { useAuth } from "@/providers/AuthProvider"
import { addReply, deleteReply } from "../services/replies"
import { COMMENTS_PAGE_SIZE, REPLIES_PAGE_SIZE } from "../constants/comments.constants"

type UseReplyMutationParams = {
  targetId: string
  targetType: CommentTargetType
  targetIds: string[]
  commentPageSize?: number
  replyPageSize?: number
}

/**
 * Hook to manage reply mutations with multi-layered Global Wildcard Optimistic Updates.
 * Synchronizes individual reply streams, main comment metadata, and ALL shared batch counts.
 */
export function useReplyMutation({
  targetId,
  targetType,
  targetIds = [],
  commentPageSize = COMMENTS_PAGE_SIZE,
  replyPageSize = REPLIES_PAGE_SIZE,
}: UseReplyMutationParams) {
  const queryClient = useQueryClient()
  const { user, profile } = useAuth()

  // 1. Kunci kueri list komentar utama individual (Halaman Detail)
  const mainCommentsKey = ["comments", targetType, targetId, { pageSize: commentPageSize }]
  
  // 2. 🎯 KUNCI PARSIAL: Gunakan awalan ini untuk menyapu laci batching (List & Detail) sekaligus
  const batchCountPartialKey = ["comment-counts-batch", targetType]

  /**
   * Mutation to create a new reply.
   */
  const add = useMutation({
    mutationFn: addReply,
    onMutate: async (variables) => {
      if (!user || !profile) {
        throw new Error("Unauthorized: Authentication state missing.")
      }

      const pId = variables.parentId
      const repliesKey = ["replies", pId, { pageSize: replyPageSize }]

      // Batalin kueri thread balasan, list utama, dan seluruh laci batching sejenis agar tidak bentrok data
      await queryClient.cancelQueries({ queryKey: repliesKey })
      await queryClient.cancelQueries({ queryKey: mainCommentsKey })
      await queryClient.cancelQueries({ queryKey: batchCountPartialKey, exact: false })
      
      // Backup data lama list replies dan main comments
      const previousReplies = queryClient.getQueryData<InfiniteData<PaginatedComments>>(repliesKey)
      const previousMain = queryClient.getQueryData<InfiniteData<PaginatedComments>>(mainCommentsKey)
      
      // 🎯 BACKUP MASSAL: Ambil snapshot dari semua laci batching yang ada di memori browser saat ini
      const previousBatchQueries = queryClient.getQueriesData<GetBatchCommentCountsResult>({
        queryKey: batchCountPartialKey,
        exact: false,
      })

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

      // Layer 1: Tambah balasan ke ujung array thread balasan (Flat UI Friendly)
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

      // Layer 2: Update Main Comment List (Menaikkan angka reply_count di parent comment)
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

      // Layer 3: 🎯 JURUS GEDOR MASSAL (+1): Dongkrak angka proyek ini di seluruh laci batching sekaligus
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

      return { previousReplies, previousMain, previousBatchQueries, repliesKey }
    },
    onError: (_err, _vars, context) => {
      if (context?.repliesKey) queryClient.setQueryData(context.repliesKey, context.previousReplies)
      if (context?.previousMain) queryClient.setQueryData(mainCommentsKey, context.previousMain)
      
      // 🎯 ROLLBACK MASSAL: Kembalikan kondisi semua laci batching ke semula jika server error
      if (context?.previousBatchQueries) {
        context.previousBatchQueries.forEach(([key, oldData]) => {
          queryClient.setQueryData(key, oldData)
        })
      }
    },
    onSettled: (_data, _error, variables) => {
      const repliesKey = ["replies", variables.parentId, { pageSize: replyPageSize }]
      queryClient.invalidateQueries({ queryKey: repliesKey })
      queryClient.invalidateQueries({ queryKey: mainCommentsKey })
      // 🎯 INVALIDATE MASSAL: Paksa hangus semua cache batching biar disinkronkan ulang dari backend pusat
      queryClient.invalidateQueries({ queryKey: batchCountPartialKey, exact: false })
    },
  })

  /**
   * Mutation to delete a reply.
   */
  const remove = useMutation({
    mutationFn: deleteReply,
    onMutate: async (variables) => {
      const pId = variables.parentId
      const repliesKey = ["replies", pId, { pageSize: replyPageSize }]

      await queryClient.cancelQueries({ queryKey: repliesKey })
      await queryClient.cancelQueries({ queryKey: mainCommentsKey })
      await queryClient.cancelQueries({ queryKey: batchCountPartialKey, exact: false })

      const previousReplies = queryClient.getQueryData<InfiniteData<PaginatedComments>>(repliesKey)
      const previousMain = queryClient.getQueryData<InfiniteData<PaginatedComments>>(mainCommentsKey)
      
      // 🎯 BACKUP MASSAL sebelum data dipotong
      const previousBatchQueries = queryClient.getQueriesData<GetBatchCommentCountsResult>({
        queryKey: batchCountPartialKey,
        exact: false,
      })

      // 🎯 KARENA FLAT THREAD: Menghapus 1 item balasan selalu bernilai tepat 1 angka bulat!
      const totalDeleted = 1

      // Layer 1: Hapus balasan dari array list flat UI
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

      // Layer 2: Turunkan angka reply_count di parent comment utama sebanyak 1
      queryClient.setQueryData<InfiniteData<PaginatedComments>>(mainCommentsKey, (old) => {
        if (!old) return old
        return {
          ...old,
          pages: old.pages.map((page) => ({
            ...page,
            data: page.data.map((c) =>
              c.id === pId
                ? { ...c, reply_count: Math.max(0, (c.reply_count || 0) - totalDeleted) }
                : c
            ),
          })),
        }
      })

      // Layer 3: 🎯 JURUS GEDOR MASSAL (-1): Sunat angka proyek ini di seluruh laci batching sekaligus
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

      return { previousReplies, previousMain, previousBatchQueries, repliesKey }
    },
    onError: (_err, _vars, context) => {
      if (context?.repliesKey) queryClient.setQueryData(context.repliesKey, context.previousReplies)
      if (context?.previousMain) queryClient.setQueryData(mainCommentsKey, context.previousMain)
      
      // 🎯 ROLLBACK MASSAL
      if (context?.previousBatchQueries) {
        context.previousBatchQueries.forEach(([key, oldData]) => {
          queryClient.setQueryData(key, oldData)
        })
      }
    },
    onSettled: (_data, _error, variables) => {
      const repliesKey = ["replies", variables.parentId, { pageSize: replyPageSize }]
      queryClient.invalidateQueries({ queryKey: repliesKey })
      queryClient.invalidateQueries({ queryKey: mainCommentsKey })
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