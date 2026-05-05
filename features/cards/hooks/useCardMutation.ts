"use client"

import { useMutation, useQueryClient, InfiniteData } from "@tanstack/react-query";
import { Card, PaginatedCards } from "../types/cards.types";
import { nanoid } from "nanoid";
import { createCard, updateCard, deleteCard } from "../services/cards";
import { useAuth } from "@/providers/AuthProvider";

export function useCardsMutation() {
  const queryClient = useQueryClient();
  const { user, profile } = useAuth();

  // Helper to check auth before mutation
  const checkAuth = () => {
    if (!user || !profile) {
      throw new Error("Unauthorized: Please login to perform this action");
    }
  };

  // --- CREATE CARD ---
  const create = useMutation({
    mutationFn: createCard,
    onMutate: async (variables) => {
      checkAuth();
      
      const queryKey = ["cards", { status: variables.status }];
      await queryClient.cancelQueries({ queryKey: ["cards"] });
      const previousCards = queryClient.getQueriesData({ queryKey: ["cards"] });

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
          userReaction: null,
          allReactions: [],
          totalReactions: 0,
          totalEmojis: 0,
        }
      };

      queryClient.setQueryData<InfiniteData<PaginatedCards>>(queryKey, (old) => {
        if (!old) return old;
        return {
          ...old,
          pages: old.pages.map((page, i) =>
            i === 0 ? { ...page, data: [optimisticCard, ...page.data] } : page
          ),
        };
      });

      return { previousCards };
    },
    onError: (err: any, variables, context) => {
      if (context?.previousCards) {
        context.previousCards.forEach(([key, data]) => queryClient.setQueryData(key, data));
      }
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ["cards"] });
    },
  });

  // --- UPDATE CARD (Status & Content) ---
  const update = useMutation({
    mutationFn: updateCard,
    onMutate: async ({ cardId, payload }) => {
      checkAuth();

      await queryClient.cancelQueries({ queryKey: ["cards"] });
      const allPrevious = queryClient.getQueriesData({ queryKey: ["cards"] });

      let movedCard: Card | undefined;

      queryClient.setQueriesData<InfiniteData<PaginatedCards>>({ queryKey: ["cards"] }, (old) => {
        if (!old) return old;
        return {
          ...old,
          pages: old.pages.map((page) => ({
            ...page,
            data: page.data.filter((card) => {
              if (card.id === cardId) {
                movedCard = { ...card, ...payload };
                return !payload.status; 
              }
              return true;
            }).map((card) => (card.id === cardId ? { ...card, ...payload } : card)),
          })),
        };
      });

      if (payload.status && movedCard) {
        const destKey = ["cards", { status: payload.status }];
        queryClient.setQueryData<InfiniteData<PaginatedCards>>(destKey, (old) => {
          if (!old) return old;
          const newPages = [...old.pages];
          newPages[0] = { ...newPages[0], data: [movedCard!, ...newPages[0].data] };
          return { ...old, pages: newPages };
        });
      }

      return { allPrevious };
    },
    onError: (err: any, variables, context) => {
      if (context?.allPrevious) {
        context.allPrevious.forEach(([key, data]) => queryClient.setQueryData(key, data));
      }
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ["cards"] });
    },
  });

  // --- DELETE CARD ---
  const remove = useMutation({
    mutationFn: deleteCard,
    onMutate: async ({ cardId }) => {
      checkAuth();

      await queryClient.cancelQueries({ queryKey: ["cards"] });
      const previous = queryClient.getQueriesData({ queryKey: ["cards"] });

      queryClient.setQueriesData<InfiniteData<PaginatedCards>>({ queryKey: ["cards"] }, (old) => {
        if (!old) return old;
        return {
          ...old,
          pages: old.pages.map((page) => ({
            ...page,
            data: page.data.filter((card) => card.id !== cardId),
          })),
        };
      });

      return { previous };
    },
    onError: (err: any, variables, context) => {
      if (context?.previous) {
        context.previous.forEach(([key, data]) => queryClient.setQueryData(key, data));
      }
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ["cards"] });
    },
  });

  return {
    createCard: create.mutateAsync,
    updateCard: update.mutateAsync,
    deleteCard: remove.mutateAsync,
    isPending: create.isPending || update.isPending || remove.isPending,
  };
}