"use client"

import { useInfiniteQuery } from "@tanstack/react-query"
import type { CardPriority, CardStatus, CardType } from "../types/cards.types"
import type { Cursor } from "@/features/shared/types/index.types"
import { CARDS_PAGE_SIZE } from "../constants/card.constants"
import { getPaginatedCardsByStatus } from "../services/cards"

type UseInfiniteCardsParams = {
  status: CardStatus;
  search?: string;
  types?: CardType[]
  priorities?: CardPriority[]
  pageSize?: number
  cursor?: Cursor | undefined
  enabled?: boolean
};

export function useInfiniteCardsByStatus({
  status,
  search,
  types,
  priorities,
  pageSize = CARDS_PAGE_SIZE,
  enabled = true
}: UseInfiniteCardsParams) {
  return useInfiniteQuery({
    queryKey: ["cards", {status, search, types, priorities, pageSize }],
    queryFn: ({ pageParam }) =>
      getPaginatedCardsByStatus({
        status,
        search,
        types,
        priorities,
        pageSize,
        cursor: pageParam as Cursor | undefined,
      }),
    enabled: enabled, 
    initialPageParam: undefined as Cursor | undefined,
    getNextPageParam: (lastPage) => {
      return lastPage.hasMore ? lastPage.nextCursor : undefined
    },
    staleTime: 1000 * 60 * 30,
  })
}