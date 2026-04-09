"use server"

import { createClient } from "@/lib/supabase/server"
import type { CommentData, PaginatedComments } from "../types/comments.types"
import { REPLIES_PAGE_SIZE } from "../constants/comments.constants"
import type { AddCommentParams } from "./comments"
import { addComment, deleteComment } from "./comments"
import type { Profile } from "@/features/profile/types/profiles.types"
import type { Cursor } from "@/features/shared/types/index.types"
import { MAX_TOP_REACTIONS } from "@/features/reactions/constants/reactions.constants"

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

  // Ambil user untuk filter reaksi pribadi
  const {
    data: { user },
  } = await supabase.auth.getUser()

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
        id, email, full_name, role, avatar_url
      ),
      recipient:recipient_id(
        id, email, full_name, role, avatar_url
      ),
      replies_count:comments!parent_id(count),
      comment_reaction_counts(
        emoji,
        count
      ),
      reactions(
        emoji,
        user_id
      )
    `
    )
    .eq("parent_id", parentId)
    // Filter reaksi milik user login
    .eq("reactions.user_id", user?.id ?? "00000000-0000-0000-0000-000000000000")
    .order("created_at", { ascending: true }) // Biasanya reply urut dari yang terlama
    .order("id", { ascending: false })
    .limit(pageSize + 1)

  if (cursor) {
    // Karena ascending: true, cursor gunakan .gt (greater than)
    query = query.or(
      `created_at.gt.${cursor.createdAt},and(created_at.eq.${cursor.createdAt},id.gt.${cursor.id})`
    )
  }

  const { data, error } = await query

  if (error) {
    console.error("[getReplies] Error fetching replies:", error.message)
    throw error
  }

  if (!data || data.length === 0) {
    return { data: [], nextCursor: null, hasMore: false }
  }

  const hasMore = data.length > pageSize
  const trimmedData = hasMore ? data.slice(0, pageSize) : data

  const mappedData: CommentData[] = trimmedData.map((reply: any) => {
    // Logic Reaction Summary
    const allReactions = reply.comment_reaction_counts || []
    const userReaction = reply.reactions?.[0] ?? null

    const totalReactions = allReactions.reduce(
      (acc: number, curr: any) => acc + (curr.count || 0),
      0
    )

    const topReactions = allReactions.slice(0, MAX_TOP_REACTIONS)
    const totalEmojis = allReactions.length
    const remainingEmojis = Math.max(0, totalEmojis - MAX_TOP_REACTIONS)

    return {
      id: reply.id,
      content: reply.content,
      user_id: reply.user_id,
      author: reply.author,
      created_at: reply.created_at,
      updated_at: reply.updated_at ?? null,
      parent_id: reply.parent_id ?? null,
      recipient: reply.recipient ?? null,
      replies_count: reply.replies_count?.[0]?.count ?? 0,
      reaction_summary: {
        allReactions,
        totalReactions,
        userReaction,
        topReactions,
        totalEmojis,
        remainingEmojis,
      },
    }
  })

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
