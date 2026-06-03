"use server"

import type { Profile } from "@/features/profile/types/profiles.types"
import type { Reaction, ReactionCount } from "@/features/reactions/types/reactions.types"
import type { Cursor } from "@/features/shared/types/index.types"
import { createClient } from "@/lib/supabase/server"
import { revalidatePath } from "next/cache"
import type { Message, MessageEntity, PaginatedMessages } from "../types/messages.types"
import { MESSAGES_PAGE_SIZE } from "../constants/messages.constants"
import { supabase } from "@/lib/supabase/public"

type MessageRawResponse = MessageEntity & {
  author: Profile
  recipient: Profile | null
  replied_message: {
    id: string
    content: string
  } | null
  reaction_counts: ReactionCount[]
  reactions: Reaction[]
}

type GetPaginatedMessagesParams = {
  cursor?: Cursor
  pageSize?: number
}

type SendMessageParams = {
  content: string
  recipientId: string | null
  replyToId: string | null
  recipient: Profile | null
  repliedMessage: {
    id: string
    content: string
  } | null
}

const MESSAGE_COLUMNS = `
  id,
  type,
  content,
  user_id,
  recipient_id,
  reply_to_id,
  created_at,
  updated_at,
  author:user_id (
    id, 
    email, 
    full_name, 
    role, 
    avatar_url
  ),
  recipient:recipient_id (
    id, 
    email, 
    full_name, 
    role, 
    avatar_url
  ),
  replied_message:reply_to_id(
    id,
    content
  ),
  reaction_counts:message_reaction_counts(
    emoji,
    count
  )
`

const mapToMessage = (message: MessageRawResponse): Message => {
  const allReactions = message.reaction_counts || []
  const repliedMessage = message.replied_message ?? null

  return {
    ...message,
    recipient_id: message.recipient_id ?? null,
    reply_to_id: message.reply_to_id ?? null,
    recipient: message.recipient ?? null,
    replied_message: repliedMessage,
    reaction_summary: {
      allReactions,
      totalReactions: allReactions.reduce((acc, curr) => acc + (curr.count || 0), 0),
      totalEmojis: allReactions.length,
    },
  }
}

export async function getPaginatedMessages({
  cursor,
  pageSize = MESSAGES_PAGE_SIZE,
}: GetPaginatedMessagesParams = {}): Promise<PaginatedMessages> {
  let query = supabase
    .from("messages")
    .select<string, MessageRawResponse>(MESSAGE_COLUMNS)
    .order("created_at", { ascending: false })
    .order("id", { ascending: false })
    .limit(pageSize + 1)

  if (cursor) {
    query = query.or(
      `created_at.lt.${cursor.created_at},and(created_at.eq.${cursor.created_at},id.lt.${cursor.id})`
    )
  }

  const { data, error } = await query

  if (error) {
    console.error("[getPaginatedMessages] Error fetching messages:", error)
    throw error
  }

  if (!data || data.length === 0) {
    return {
      data: [],
      nextCursor: null,
      hasMore: false,
    }
  }

  const hasMore = data.length > pageSize
  const trimmedData = hasMore ? data.slice(0, pageSize) : data
  const mappedData = trimmedData.map(mapToMessage)
  const lastItem = mappedData[mappedData.length - 1]

  return {
    data: mappedData,
    nextCursor: hasMore
      ? {
          created_at: lastItem.created_at,
          id: lastItem.id,
        }
      : null,
    hasMore,
  }
}

export async function getMessage({ messageId }: { messageId: string }): Promise<Message| null> {
  const { data, error } = await supabase
    .from("messages")
    .select<string, MessageRawResponse>(MESSAGE_COLUMNS)
    .eq("id", messageId)
    .single()

  if (error) {
    console.error("[getMessage] Error fetching message:", error)
    throw error
  }
  
  return data ? mapToMessage(data) : null
}

export async function sendMessage({
  content,
  recipientId,
  replyToId,
  // FOR OPTIMISTIC
  recipient: _recipient,
  repliedMessage: _repliedMessage,
}: SendMessageParams) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) throw new Error("Unauthorized: User must be authenticated to send message.")

  const { error } = await supabase
    .from("messages")
    .insert([
      {
        content,
        user_id: user.id,
        reply_to_id: replyToId ?? null,
        recipient_id: recipientId ?? null,
      },
    ])
    .select()
    .single()

  if (error) {
    console.error("[sendMessage] Failed to send message:", error)
    throw error
  }

  revalidatePath("/", "layout")
}

export async function deleteMessage({ messageId }: { messageId: string }) {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()
  if (!user) throw new Error("Unauthorized: User must be authenticated to delete message.")

  const [message, { data: profile }] = await Promise.all([
    getMessage({ messageId }),
    supabase.from("profiles").select("role").eq("id", user.id).single(),
  ])
  if (!message) throw new Error("Message not found!")

  const isAuthor = message.user_id === user.id
  const isAdmin = profile?.role === "admin"

  if (!isAuthor && !isAdmin) {
    throw new Error("Unauthorized: You don't have permission to delete this")
  }

  const { error } = await supabase.from("messages").delete().eq("id", messageId)

  if (error) {
    console.error("[deleteMessage] Failed to delete message:", error)
    throw error
  }
  revalidatePath("/", "layout")
}
