import { useInfiniteQuery } from "@tanstack/react-query"
import type { Cursor } from "@/features/shared/types/index.types"
import { getPaginatedMessages } from "../services/messages"
import type { MessageType } from "../types/messages.types"
import { MESSAGES_PAGE_SIZE } from "../constants/messages.constants"

type UseInfiniteMessagesParams = {
  type: MessageType
  pageSize?: number
  enabled?: boolean
}

/**
 * A custom hook to fetch and manage infinite scrolling for messages.
 * Built on top of TanStack Query's useInfiniteQuery for robust cache and pagination management.
 * @param type - The conversation scope, defining if it's a 'group' or 'personal' message.
 * @param pageSize - Limits the number of messages returned in a single fetch.
 * @param enabled - Conditional flag to control the query execution.
 * @returns An infinite query object containing data pages, fetch status, and pagination helpers.
 */
export function useInfiniteMessages({
  type,
  pageSize = MESSAGES_PAGE_SIZE,
  enabled = true,
}: UseInfiniteMessagesParams) {
  return useInfiniteQuery({
    queryKey: ["messages", type, { pageSize }],
    queryFn: async ({ pageParam }) => {
      return getPaginatedMessages({
        cursor: pageParam as Cursor | undefined,
        pageSize,
      })
    },
    enabled: !!type && enabled,
    initialPageParam: undefined as Cursor | undefined,
    getNextPageParam: (lastPage) => {
      return lastPage.hasMore ? lastPage.nextCursor : undefined
    }
  })
}
