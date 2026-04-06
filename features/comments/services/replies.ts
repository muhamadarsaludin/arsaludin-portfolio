"use server"

import { createClient } from "@/lib/supabase/server"
import type { CommentData, PaginatedComments } from "../types/comments.types"
import { REPLIES_PAGE_SIZE } from "../constants/comments.constants"
import type { AddCommentParams } from "./comments"
import { addComment, deleteComment } from "./comments"
import type { Profile } from "@/features/profile/types/profiles.types"
import { Cursor } from "@/features/shared/types/index.types"

// ====== TYPES ======
type GetRepliesParams = {
  parentId: string
  cursor?: Cursor
  pageSize?: number
}

type DeleteReplyParams = {
  commentId: string
  parentId: string
}

type AddReplyParams = AddCommentParams & {
  optimisticRecipient: Profile
}

// ====== SERVICES ======

/**
 * Fetches a paginated list of replies for a specific parent comment.
 * @param parentId - The unique identifier of the parent comment.
 * @param cursor - Pagination metadata (createdAt & id) for offset-based fetching.
 * @param pageSize - The number of replies to fetch. Defaults to REPLIES_PAGE_SIZE.
 */
export async function getReplies({
  parentId,
  cursor,
  pageSize = REPLIES_PAGE_SIZE,
}: GetRepliesParams): Promise<PaginatedComments> {
  const supabase = await createClient()

  let query = supabase
    .from("comments")
    .select(
      `
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
    `
    )
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
      hasMore: false,
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
    nextCursor: hasMore
      ? {
          createdAt: lastItem.created_at,
          id: lastItem.id,
        }
      : null,
    hasMore,
  }
}

/**
 * Creates a new reply for a specific comment.
 * @param params.targetId - The ID of the main entity (e.g., project_id, post_id).
 * @param params.targetType - The type of the main entity (e.g., 'project', 'post').
 * @param params.content - The actual text of the reply.
 * @param params.parentId - The ID of the top-level comment being replied to.
 * @param params.recipientId - (Optional) The ID of the user being replied to.
 * @param params.reply_to_id - (Optional) The specific reply ID if replying to a sub-comment.
 * @param params.optimisticRecipient - Profile data used strictly for UI optimistic updates.
 */
export async function addReply({
  targetId,
  targetType,
  content,
  parentId,
  recipientId,
  replyToId,
  optimisticRecipient, // FOR OPTIMISTIC ONLY
}: AddReplyParams) {
  await addComment({
    targetId,
    targetType,
    content,
    parentId,
    recipientId,
    replyToId,
  })
}

/**
 * Deletes a specific reply and triggers cache invalidation.
 * @param params.commentId - The unique UUID of the reply to be removed from the database.
 * @param params.parentId - The ID of the parent comment. Essential for identifying
 * which reply thread needs to be refetched or updated in the UI cache.
 */
export async function deleteReply({
  commentId,
  parentId, // FOR TANSTACK QUERY CACHE KEY ONLY
}: DeleteReplyParams) {
  await deleteComment({ commentId })
}
