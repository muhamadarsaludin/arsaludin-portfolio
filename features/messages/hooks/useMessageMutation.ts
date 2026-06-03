import type { InfiniteData } from "@tanstack/react-query"
import { useMutation, useQueryClient } from "@tanstack/react-query"
import { useAuth } from "@/providers/AuthProvider"
import type { Message, MessageType, PaginatedMessages } from "../types/messages.types"
import { MESSAGES_PAGE_SIZE } from "../constants/messages.constants"
import { deleteMessage, sendMessage } from "../services/messages"

type UseMessageMutationParams = {
  type: MessageType
  pageSize?: number
}

/**
 * Custom hook to handle message mutations with optimistic updates.
 * @param type - The conversation scope, defining if it's a 'group' or 'personal' message.
 * @param pageSize - Limits the number of messages returned in a single fetch.
 * @returns An object containing `add` and `remove` mutate functions, along with their pending states.
 */
export function useMessageMutation({
  type,
  pageSize = MESSAGES_PAGE_SIZE,
}: UseMessageMutationParams) {
  const queryClient = useQueryClient()
  const queryKey = ["messages", type, { pageSize }]

  const { user, profile } = useAuth()

  /**
   * Mutation to create a new message with optimistic update
   */
  const send = useMutation({
    mutationFn: sendMessage,
    onMutate: async (variables) => {
      if (!user || !profile) return

      await queryClient.cancelQueries({ queryKey })
      const previous = queryClient.getQueryData<InfiniteData<PaginatedMessages>>(queryKey)

      const optimisticMessage: Message = {
        id: `temp-${Date.now()}`,
        type,
        content: variables.content,
        user_id: user.id,
        recipient_id: variables.recipientId ?? null,
        reply_to_id: variables.replyToId ?? null,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
        author: profile,
        recipient: variables.recipient ?? null,
        replied_message: variables.repliedMessage ?? null,
        reaction_summary: {
          // userReaction: null,
          allReactions: [],
          totalReactions: 0,
          totalEmojis: 0,
        },
      }

      queryClient.setQueryData<InfiniteData<PaginatedMessages>>(queryKey, (old) => {
        if (!old) return old
        return {
          ...old,
          pages: old.pages.map((page, i) =>
            i === 0 ? { ...page, data: [optimisticMessage, ...page.data] } : page
          ),
        }
      })

      return { previous }
    },
    onError: (_err, _variables, context) => {
      if (context?.previous) queryClient.setQueryData(queryKey, context.previous)
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey })
    },
  })

  /**
   * Mutation to delete a message with optimistic update
   */
  const remove = useMutation({
    mutationFn: deleteMessage,
    onMutate: async ({ messageId }) => {
      await queryClient.cancelQueries({ queryKey })

      const previous = queryClient.getQueryData<InfiniteData<PaginatedMessages>>(queryKey)

      queryClient.setQueryData<InfiniteData<PaginatedMessages>>(queryKey, (old) => {
        if (!old) return old
        return {
          ...old,
          pages: old.pages.map((page) => ({
            ...page,
            data: page.data.filter((m) => m.id !== messageId),
          })),
        }
      })

      return { previous }
    },
    onError: (_err, _variables, context) => {
      if (context?.previous) queryClient.setQueryData(queryKey, context.previous)
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey })
    },
  })

  return {
    send: send.mutate,
    remove: remove.mutate,
    isSending: send.isPending,
    isRemoving: remove.isPending,
  }
}
