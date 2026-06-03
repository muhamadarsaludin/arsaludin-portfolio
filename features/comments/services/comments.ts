"use server"

import { supabase } from "@/lib/supabase/public"
import { createClient } from "@/lib/supabase/server"
import { revalidatePath } from "next/cache"
import type {
  CommentData,
  CommentEntity,
  CommentTargetType,
  PaginatedComments,
} from "../types/comments.types"
import { COMMENTS_PAGE_SIZE } from "../constants/comments.constants"
import type { Cursor } from "@/features/shared/types/index.types"
import type { Profile } from "@/features/profile/types/profiles.types"
import type { Reaction, ReactionCount } from "@/features/reactions/types/reactions.types"

type GetPaginatedCommentsParams = {
  targetId: string
  targetType: CommentTargetType
  cursor?: Cursor
  pageSize?: number
}

export type GetPaginatedCommentsResponse = Pick<
  CommentEntity,
  | "id"
  | "content"
  | "user_id"
  | "created_at"
  | "updated_at"
  | "parent_id"
  | "recipient_id"
  | "reply_to_id"
> & {
  author: Profile
  recipient: Profile | null
  replies: { count: number }[]
  reaction_counts: ReactionCount[]
  reactions: Reaction[]
}

export type AddCommentParams = {
  targetId: string
  targetType: string
  content: string
  parentId: string | null
  recipientId: string | null
  replyToId: string | null
}

type GetCommentCountParams = {
  targetId: string
  targetType: CommentTargetType
}

/**
 * Fetches a paginated list of top-level comments for a specific target entity.
 * @param targetId - The unique ID of the target entity (e.g., Post ID).
 * @param targetType - The category of the target, used to dynamically build the database query.
 * @param cursor - Pagination metadata (createdAt & id) used for cursor-based fetching.
 * @param pageSize - Number of items to retrieve. Defaults to COMMENTS_PAGE_SIZE.
 * @returns A promise that resolves to a PaginatedComments object containing the data and pagination state.
 */
export async function getPaginatedComments({
  targetId,
  targetType,
  cursor,
  pageSize = COMMENTS_PAGE_SIZE,
}: GetPaginatedCommentsParams): Promise<PaginatedComments> {
  const targetColumn = `${targetType}_id`
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
    replies:comments!parent_id(count),
    reaction_counts:comment_reaction_counts(
      emoji,
      count
    )
  `

  let query = supabase
    .from("comments")
    .select<string, GetPaginatedCommentsResponse>(columns)
    .eq(targetColumn, targetId)
    .is("parent_id", null)
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
    console.error(`[getPaginatedComments] Error fetching ${targetType} comments:`, error)
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

  const mappedData: CommentData[] = trimmedData.map((comment) => {
    const replyCount = comment.replies?.[0]?.count ?? 0
    const allReactions = comment.reaction_counts || []

    return {
      id: comment.id,
      content: comment.content,
      user_id: comment.user_id,
      created_at: comment.created_at,
      updated_at: comment.updated_at,
      parent_id: comment.parent_id ?? null,
      recipient_id: comment.recipient_id ?? null,
      reply_to_id: comment.reply_to_id ?? null,
      author: comment.author,
      recipient: comment.recipient ?? null,
      reply_count: replyCount,
      reaction_summary: {
        allReactions,
        totalReactions: allReactions.reduce((acc, curr) => acc + (curr.count || 0), 0),
        totalEmojis: allReactions.length
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
    hasMore
  }
}

/**
 * Retrieves a single comment record by its ID.
 * @param commentId - The ID of the comment to retrieve.
 * @returns The raw comment data from the database.
 */
export async function getComment({ commentId }: { commentId: string }) {
  const { data, error } = await supabase.from("comments").select("*").eq("id", commentId).single()
  if (error) throw error
  return data
}

/**
 * Fetches the total number of comments and replies for a specific target entity.
 * @param {GetCommentCountParams} params - The target identification parameters.
 * @param {string} params.targetId - The unique UUID of the entity (e.g., project_id).
 * @param {CommentTargetType} params.targetType - The classification of the target (e.g., "project").
 * @returns {Promise<number>} A promise that resolves to the total count of comments and replies.
 * Defaults to 0 if an error occurs.
 */
export async function getCommentCount({
  targetId,
  targetType,
}: GetCommentCountParams): Promise<number> {
  const targetColumn = `${targetType}_id`
  
  try {
    const { count, error } = await supabase
      .from("comments")
      .select("id", { count: "exact", head: true })
      .eq(targetColumn, targetId)

    if (error) {
      console.error(`[getCommentCount] Error fetching count for ${targetType} (${targetId}):`, error)
      return 0
    }

    return count ?? 0
  } catch (err) {
    console.error(`[getCommentCount] Unexpected error:`, err)
    return 0
  }
}

/**
 * Creates a new comment or reply.
 * @param targetId - The entity ID to associate the comment with.
 * @param targetType - The type of target entity (determines the table column).
 * @param content - The textual content of the comment.
 * @param parentId - The ID of the parent comment if this is a reply.
 * @param recipientId - The user receiving the reply.
 * @param replyToId - The specific comment ID being responded to.
 * @throws {Error} If the user is not authenticated.
 */
export async function addComment({
  targetId,
  targetType,
  content,
  parentId,
  recipientId,
  replyToId,
}: AddCommentParams) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) throw new Error("Unauthorized: User must be authenticated to add comment.")

  const targetColumn = `${targetType}_id`

  const { error } = await supabase
    .from("comments")
    .insert([
      {
        [targetColumn]: targetId,
        content: content,
        parent_id: parentId,
        user_id: user.id,
        recipient_id: recipientId,
        reply_to_id: replyToId,
      },
    ])
    .select()
    .single()

  if (error) {
    console.error("[addComment] Failed to add comment:", error)
    throw error
  }
  revalidatePath("/", "layout")
}

/**
 * Deletes a specific comment after verifying ownership or administrative privileges.
 * @param commentId - The unique identifier of the comment to delete.
 * @throws {Error} If the user is unauthorized or the comment does not exist.
 */
export async function deleteComment({ commentId }: { commentId: string }) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) throw new Error("Unauthorized: User must be authenticated to delete comment.")

  const [comment, { data: profile }] = await Promise.all([
    getComment({ commentId }),
    supabase.from("profiles").select("role").eq("id", user.id).single(),
  ])
  
  if (!comment) throw new Error("Comment not found.")

  const isOwner = comment.user_id === user.id
  const isAdmin = profile?.role === "admin"

  if (!isOwner && !isAdmin) {
    throw new Error("Unauthorized: You don't have permission to delete this comment")
  }

  const { error } = await supabase.from("comments").delete().eq("id", commentId)

  if (error) {
    console.error("[deleteComment] Failed to delete comment:", error)
    throw error
  }

  revalidatePath("/", "layout")
}
