"use server"

import { supabase } from "@/lib/supabase/public"
import type { CommentData, PaginatedComments } from "../types/comments.types"
import { REPLIES_PAGE_SIZE } from "../constants/comments.constants"
import type { AddCommentParams, GetPaginatedCommentsResponse } from "./comments"
import { addComment, deleteComment } from "./comments"
import type { Profile } from "@/features/profile/types/profiles.types"
import type { Cursor } from "@/features/shared/types/index.types"

type GetRepliesParams = {
  parentId: string
  cursor?: Cursor
  pageSize?: number
}

type GetPaginatedRepliesResponse = GetPaginatedCommentsResponse

type DeleteReplyParams = {
  commentId: string
  parentId: string
}

type AddReplyParams = AddCommentParams & {
  optimisticRecipient: Profile
}

/**
 * Fetches a paginated list of replies for a specific parent reply.
 * @param parentId - The unique identifier of the parent reply.
 * @param cursor - Pagination metadata (createdAt & id) for offset-based fetching.
 * @param pageSize - The number of replies to fetch. Defaults to REPLIES_PAGE_SIZE.
 */
export async function getPaginatedReplies({
  parentId,
  cursor,
  pageSize = REPLIES_PAGE_SIZE,
}: GetRepliesParams): Promise<PaginatedComments> {
  const columns = `
    id,
    content,
    user_id,
    created_at,
    updated_at,
    parent_id,
    recipient_id,
    reply_to_id,
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
    replies:comments!reply_to_id(count),
    reaction_counts:comment_reaction_counts(
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

  let query = supabase
    .from("comments")
    .select<string, GetPaginatedRepliesResponse>(columns)
    .eq("parent_id", parentId)
    .order("created_at", { ascending: true })
    .order("id", { ascending: false })
    .limit(pageSize + 1)

  if (cursor) {
    query = query.or(
      `created_at.gt.${cursor.created_at},and(created_at.eq.${cursor.created_at},id.gt.${cursor.id})`
    )
  }

  const { data, error } = await query

  if (error) {
    console.error("[getPaginatedReplies] Error fetching replies:", error.message)
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

  const mappedData: CommentData[] = trimmedData.map((reply) => {
    const replyCount = reply.replies?.[0]?.count ?? 0
    const allReactions = reply.reaction_counts || []

    return {
      id: reply.id,
      content: reply.content,
      user_id: reply.user_id,
      created_at: reply.created_at,
      updated_at: reply.updated_at,
      parent_id: reply.parent_id ?? null,
      recipient_id: reply.recipient_id ?? null,
      reply_to_id: reply.reply_to_id ?? null,
      author: reply.author,
      recipient: reply.recipient ?? null,
      reply_count: replyCount,
      reaction_summary: {
        allReactions,
        totalReactions: allReactions.reduce((acc, curr) => acc + (curr.count || 0), 0),
        totalEmojis: allReactions.length,
      },
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

/**
 * Creates a new reply for a specific reply.
 * @param params - The input params containing reply attributes.
 */
export async function addReply({
  optimisticRecipient: _optimisticRecipient,
  ...serverPayload
}: AddReplyParams) {
  await addComment(serverPayload)
}

/**
 * Deletes a specific reply and triggers cache invalidation.
 * @param params - The input parameters containing commentId.
 */
export async function deleteReply({ commentId, parentId: _parentId }: DeleteReplyParams) {
  await deleteComment({ commentId })
}
