"use server"

import { createClient } from "@/lib/supabase/server"
import type { CommentData, PaginatedComments } from "../types/comments"
import { REPLIES_PAGE_SIZE } from "../constants/comments"
import type { GetRepliesParams } from "../types/replies"
import type { AddCommentParams} from "./comments"
import { addComment, deleteComment } from "./comments"
import type { Profile } from "@/features/profile/types/profiles"

export async function getReplies({ 
  parentId, 
  cursor,
  pageSize = REPLIES_PAGE_SIZE,
}: GetRepliesParams): Promise<PaginatedComments> {
  const supabase = await createClient()

  let query = supabase
    .from("comments")
    .select(`
      id,
      content,
      created_at,
      user_id,
      parent_id,
      reply_to_id,
      author:user_id (
        id,
        email,
        full_name,
        role,
        avatar_url
      ),
      recipient:recipient_id(
        id,
        email,
        full_name,
        role,
        avatar_url
      )
    `)
    .eq("parent_id", parentId)
    .order("created_at", { ascending: true }) 
    .order("id", { ascending: false })
    .limit(pageSize + 1) // add 1 additional data to check if there is more data.

  if (cursor) {
    query = query.or(
      `created_at.lt."${cursor.createdAt}",and(created_at.eq."${cursor.createdAt}",id.lt.${cursor.id})`
    )
  }

  const { data, error } = await query

  if (error) {
    console.error("[getReplies] Error fetching replies:", error.message)
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
  const mappedData: CommentData[] = trimmedData.map((reply: any) => ({
    id: reply.id,
    content: reply.content,
    user_id: reply.user_id,
    author: reply.author,
    created_at: reply.created_at,
    updated_at: reply.updated_at ?? null,
    parent_id: reply.parent_id ?? null,
    recipient: reply.recipient ?? null,
    replies_count: reply.replies_count?.[0].count ?? 0,
  })) 
  const lastItem = mappedData[mappedData.length - 1]

  return {
    data: mappedData,
    nextCursor: hasMore ? {
      createdAt: lastItem.created_at,
      id: lastItem.id
    } : null,
    hasMore
  }
}


type AddReplyParams = AddCommentParams & {
  optimisticRecipient: Profile 
}
export async function addReply({
  targetId, 
  targetType,
  content,
  parentId,
  recipientId,
  replyToId,
  optimisticRecipient // FOR OPTIMISTIC ONLY
}:AddReplyParams) {
  await addComment({
    targetId, 
    targetType,
    content,
    parentId,
    recipientId,
    replyToId
  })
}

type DeleteReplyParams = {
  commentId: string
  parentId: string
}
export async function deleteReply({
  commentId, 
  parentId // FOR TANSTACK QUERY CACHE KEY ONLY
}: DeleteReplyParams) {
  await deleteComment({commentId})
}