"use server"

import type { Profile } from "@/features/profile/types/profiles.types"
import type { Reaction, ReactionCount } from "@/features/reactions/types/reactions.types"
import type { Cursor } from "@/features/shared/types/index.types"
import { createClient } from "@/lib/supabase/server"
import { revalidatePath } from "next/cache"
import type { Message, MessageEntity, PaginatedMessages } from "../types/messages.types"
import { MESSAGES_PAGE_SIZE } from "../constants/messages.constants"

type GetMessagesResponse = MessageEntity & {
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
  ),
  reactions(
    id,
    emoji,
    user_id,
    created_at,
    updated_at,
    author:profiles(
      id,
      email,
      full_name,
      role,
      avatar_url
    )
  )
`

export async function getPaginatedMessages({
  cursor,
  pageSize = MESSAGES_PAGE_SIZE,
}: GetPaginatedMessagesParams = {}): Promise<PaginatedMessages> {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  const userId = user?.id ?? "00000000-0000-0000-0000-000000000000"

  let query = supabase
    .from("messages")
    .select<string, GetMessagesResponse>(MESSAGE_COLUMNS)
    .eq("reactions.user_id", userId)
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
      hasMore: false 
    }
  }

  const hasMore = data.length > pageSize
  const trimmedData = hasMore ? data.slice(0, pageSize) : data

  const mappedData: Message[] = trimmedData.map((message) => {
    const userReaction = message.reactions?.[0] ?? null
    const allReactions = message.reaction_counts || []
    const repliedMessage = message.replied_message ?? null

    return {
      id: message.id,
      type: message.type,
      content: message.content,
      user_id: message.user_id,
      recipient_id: message.recipient_id ?? null,
      reply_to_id: message.reply_to_id ?? null,
      created_at: message.created_at,
      updated_at: message.updated_at,
      author: message.author,
      recipient: message.recipient ?? null,
      replied_message: repliedMessage,
      reaction_summary: {
        userReaction,
        allReactions,
        totalReactions: allReactions.reduce((acc, curr) => acc + (curr.count || 0), 0),
        totalEmojis: allReactions.length
      }
    }
  })

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

export async function sendMessage({
  content,
  recipientId,
  replyToId,
  // FOR OPTIMISTIC
  recipient,
  repliedMessage,
}: SendMessageParams) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) throw new Error("Unauthorized")

  const { error } = await supabase
    .from("messages")
    .insert([{
      content,
      user_id: user.id,
      reply_to_id: replyToId ?? null,
      recipient_id: recipientId ?? null,
    }])
    .select()
    .single()
    
    if (error) {
      console.error("[sendMessage] Error:", error)
      throw error
    }

    revalidatePath("/", "layout")
}

export async function deleteMessage({ messageId }: { messageId: string }) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) throw new Error("Unauthorized")
  
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
  
    const { error } = await supabase
    .from("messages")
    .delete()
    .eq("id", messageId)
  
    if (error) throw error
    revalidatePath("/", "layout")
}

export async function getMessage({ messageId }: { messageId: string }): Promise<Message> {
  const supabase = await createClient()
  const { data, error } = await supabase
    .from("messages")
    .select<string, GetMessagesResponse>(MESSAGE_COLUMNS)
    .eq("id", messageId)
    .single()

  if (error) {
    console.error("[getMessage] Error:", error)
    throw error
  }
  const userReaction = data.reactions?.[0] ?? null
  const allReactions = data.reaction_counts || []
  const repliedMessage = data.replied_message ?? null

  return {
    id: data.id,
    type: data.type,
    content: data.content,
    user_id: data.user_id,
    recipient_id: data.recipient_id ?? null,
    reply_to_id: data.reply_to_id ?? null,
    created_at: data.created_at,
    updated_at: data.updated_at,
    author: data.author,
    recipient: data.recipient ?? null,
    replied_message: repliedMessage,
    reaction_summary: {
      userReaction,
      allReactions,
      totalReactions: allReactions.reduce((acc, curr) => acc + (curr.count || 0), 0),
      totalEmojis: allReactions.length
    }
  }
}