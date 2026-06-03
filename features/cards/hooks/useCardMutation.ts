"use client"

import type { InfiniteData } from "@tanstack/react-query"
import { useMutation, useQueryClient } from "@tanstack/react-query"
import type { Card, PaginatedCards } from "../types/cards.types"
import { nanoid } from "nanoid"
import { createCard, updateCard, deleteCard } from "../services/cards"
import { useAuth } from "@/providers/AuthProvider"

export function useCardsMutation() {
  const queryClient = useQueryClient()
  const { user, profile, isLoading } = useAuth()

  const checkAuth = () => {
    if (isLoading) {
      throw new Error("Authentication is initializing, please wait a millisecond.")
    }
    if (!user || !profile) {
      throw new Error("Unauthorized: Please login to perform this action")
    }
  }

  // --- CREATE CARD ---
  const create = useMutation({
    mutationFn: createCard,
    onMutate: async (variables) => {
      checkAuth()

      const queryKey = ["cards", { status: variables.status }]
      await queryClient.cancelQueries({ queryKey: ["cards"] })
      const previousCards = queryClient.getQueriesData({ queryKey: ["cards"] })

      const optimisticCard: Card = {
        ...variables,
        id: `temp-${nanoid()}`,
        slug: `temp-${nanoid()}`,
        user_id: user!.id,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
        order_index: 0,
        author: profile!,
        comment_count: 0,
        reaction_summary: {
          allReactions: [],
          totalReactions: 0,
          totalEmojis: 0,
        },
      }

      queryClient.setQueryData<InfiniteData<PaginatedCards>>(queryKey, (old) => {
        if (!old) return old
        return {
          ...old,
          pages: old.pages.map((page, i) =>
            i === 0 ? { ...page, data: [optimisticCard, ...page.data] } : page
          ),
        }
      })

      return { previousCards }
    },
    onError: (_err, _variables, context) => {
      if (context?.previousCards) {
        context.previousCards.forEach(([key, data]) => queryClient.setQueryData(key, data))
      }
    },
    onSettled: (_data, _error, variables) => {
      queryClient.invalidateQueries({ queryKey: ["cards", { status: variables.status }] })
    },
  })

  // --- UPDATE CARD ---
  const update = useMutation({
    mutationFn: updateCard,
    onMutate: async ({ cardId, payload }) => {
      checkAuth()

      await queryClient.cancelQueries({ queryKey: ["cards"] })
      const allPrevious = queryClient.getQueriesData({ queryKey: ["cards"] })

      let originalCard: Card | undefined

      queryClient
        .getQueriesData<InfiniteData<PaginatedCards>>({ queryKey: ["cards"] })
        .forEach(([_, data]) => {
          if (data) {
            data.pages.forEach((page) => {
              const found = page.data.find((c) => c.id === cardId)
              if (found) originalCard = found
            })
          }
        })

      const isStatusChanging =
        payload.status && originalCard && originalCard.status !== payload.status

      queryClient.setQueriesData<InfiniteData<PaginatedCards>>({ queryKey: ["cards"] }, (old) => {
        if (!old) return old
        return {
          ...old,
          pages: old.pages.map((page) => ({
            ...page,
            data: isStatusChanging
              ? page.data.filter((card) => card.id !== cardId)
              : page.data.map((card) => (card.id === cardId ? { ...card, ...payload } : card)),
          })),
        }
      })

      if (isStatusChanging && originalCard) {
        const movedCard = { ...originalCard, ...payload }
        const destKey = ["cards", { status: payload.status }]

        queryClient.setQueryData<InfiniteData<PaginatedCards>>(destKey, (old) => {
          if (!old) return old
          return {
            ...old,
            pages: old.pages.map((page, i) =>
              i === 0 ? { ...page, data: [movedCard, ...page.data] } : page
            ),
          }
        })
      }

      return { allPrevious }
    },
    onError: (_err, _variables, context) => {
      if (context?.allPrevious) {
        context.allPrevious.forEach(([key, data]) => queryClient.setQueryData(key, data))
      }
    },
    onSettled: (_data, _error, _variables) => {
      queryClient.invalidateQueries({ queryKey: ["cards"] })
    },
  })

  // --- DELETE CARD ---
  const remove = useMutation({
    mutationFn: deleteCard,
    onMutate: async ({ cardId }) => {
      checkAuth()

      await queryClient.cancelQueries({ queryKey: ["cards"] })
      const previous = queryClient.getQueriesData({ queryKey: ["cards"] })

      queryClient.setQueriesData<InfiniteData<PaginatedCards>>({ queryKey: ["cards"] }, (old) => {
        if (!old) return old
        return {
          ...old,
          pages: old.pages.map((page) => ({
            ...page,
            data: page.data.filter((card) => card.id !== cardId),
          })),
        }
      })

      return { previous }
    },
    onError: (_err, _variables, context) => {
      if (context?.previous) {
        context.previous.forEach(([key, data]) => queryClient.setQueryData(key, data))
      }
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ["cards"] })
    },
  })

  return {
    createCard: create.mutateAsync,
    updateCard: update.mutateAsync,
    deleteCard: remove.mutateAsync,
    isPending: create.isPending || update.isPending || remove.isPending,
  }
}
