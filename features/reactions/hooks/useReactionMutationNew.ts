"use client"

import { useMutation, useQueryClient } from "@tanstack/react-query"
import { useAuth } from "@/providers/AuthProvider"
import { toggleReactionAction } from "../services/reactions"
import type { ReactionSummary, ReactionTargetType, Reaction } from "../types/reactions.types"

type UseBatchReactionMutationParams = {
  targetId: string
  targetType: ReactionTargetType
  targetIds: string[]
}

type BatchReactionsData = Record<
  string,
  {
    summary: ReactionSummary
    userReaction: Reaction | null
  }
>

export function useBatchReactionMutation({ targetId, targetType, targetIds }: UseBatchReactionMutationParams) {
  const queryClient = useQueryClient()
  const { user, profile } = useAuth()

  const serializedIds = targetIds.join(",")
  const batchQueryKey = ["reactions-batch", targetType, serializedIds]

  const mutation = useMutation({
    mutationFn: (variables: { emoji: string }) =>
      toggleReactionAction({ targetId, targetType, emoji: variables.emoji }),
      
    onMutate: async ({ emoji }) => {
      if (!user || !profile) {
        throw new Error("Unauthorized: Authentication state missing.")
      }

      // 1. Amankan laci dari background fetching biar gak tabrakan state
      await queryClient.cancelQueries({ queryKey: batchQueryKey })

      // 2. Ambil snapshot data lama satu bundle gede
      const prevBatchData = queryClient.getQueryData<BatchReactionsData>(batchQueryKey)

      // 3. Cari data spesifik milik SATU kartu proyek yang sedang diklik
      const currentItem = prevBatchData?.[targetId]
      const prevSummary = currentItem?.summary || { allReactions: [], totalReactions: 0, totalEmojis: 0 }
      const prevReaction = currentItem?.userReaction || null

      const isRemoving = prevReaction?.emoji === emoji

      // 4. 🔥 LOGIKA IMMUTABLE MANIPULATION (Optimistic UI)
      let updatedReactions = [...prevSummary.allReactions]

      // A. Kurangi count emoji lama kalau user ganti emoji / hapus reaksi
      if (prevReaction) {
        updatedReactions = updatedReactions
          .map((r) => (r.emoji === prevReaction.emoji ? { ...r, count: r.count - 1 } : r))
          .filter((r) => r.count > 0)
      }

      // B. Tambah count emoji baru kalau tujuannya bukan menghapus
      if (!isRemoving) {
        const existingIndex = updatedReactions.findIndex((r) => r.emoji === emoji)
        if (existingIndex > -1) {
          updatedReactions[existingIndex] = {
            ...updatedReactions[existingIndex],
            count: updatedReactions[existingIndex].count + 1,
          }
        } else {
          updatedReactions.push({ emoji, count: 1 })
        }
      }

      // C. Hitung ulang total kalkulasi
      const totalReactions = updatedReactions.reduce((acc, r) => acc + r.count, 0)
      const totalEmojis = updatedReactions.length

      const nextSummary: ReactionSummary = {
        allReactions: updatedReactions,
        totalReactions,
        totalEmojis,
      }

      const nextReaction: Reaction | null = isRemoving
        ? null
        : {
            id: `temp-${Date.now()}`,
            emoji,
            user_id: user.id,
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString(),
            author: profile,
          }

      // 5. 🔥 SUNTIKKAN PERUBAHAN KE DALAM OBJEK KARTU SPESIFIK DI KUNCI BATCH
      queryClient.setQueryData<BatchReactionsData>(batchQueryKey, (oldBatch) => {
        return {
          ...oldBatch,
          [targetId]: {
            summary: nextSummary,
            userReaction: nextReaction,
          },
        }
      })

      // Kembalikan data lama buat kebutuhan rollback pas error
      return { prevBatchData }
    },

    onError: (_err, _variables, context) => {
      // Rollback ke satu bundle data lama kalau hit API gagal total
      if (context?.prevBatchData) {
        queryClient.setQueryData(batchQueryKey, context.prevBatchData)
      }
    },
    
    onSettled: () => {
      // Validasi ulang kueri batch biar disinkronkan sama data mutlak di Supabase
      queryClient.invalidateQueries({ queryKey: batchQueryKey })
    },
  })

  return {
    toggle: mutation.mutate,
    isPending: mutation.isPending,
  }
}