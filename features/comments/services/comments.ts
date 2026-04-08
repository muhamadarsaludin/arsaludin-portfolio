"use server"

import { createClient } from "@/lib/supabase/server"
import { revalidatePath } from "next/cache"
import type { CommentData, CommentTargetType, PaginatedComments } from "../types/comments.types"
import { COMMENTS_PAGE_SIZE } from "../constants/comments.constants"
import type { Cursor } from "@/features/shared/types/index.types"

// ====== TYPES ======
type GetCommentsParams = {
  targetId: string
  targetType: CommentTargetType
  cursor?: Cursor
  pageSize?: number
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

// ====== SERVICES ======

/**
 * Fetches a paginated list of top-level comments for a specific target entity.
 * @param targetId - The unique ID of the target entity (e.g., Post ID).
 * @param targetType - The category of the target, used to dynamically build the database query.
 * @param cursor - Pagination metadata (createdAt & id) used for cursor-based fetching.
 * @param pageSize - Number of items to retrieve. Defaults to COMMENTS_PAGE_SIZE.
 * @returns A promise that resolves to a PaginatedComments object containing the data and pagination state.
 */

export async function getComments({
  targetId,
  targetType,
  cursor,
  pageSize = COMMENTS_PAGE_SIZE,
}: GetCommentsParams): Promise<PaginatedComments> {
  const supabase = await createClient()

  const targetColumn = `${targetType}_id`

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
      ),
      replies_count:comments!parent_id(count)
    `)
    .is("parent_id", null)
    .eq(targetColumn, targetId)
    .order("created_at", { ascending: false })
    .order("id", { ascending: false })
    .limit(pageSize + 1) // add 1 additional data to check if there is more data.

  if (cursor) {
    query = query.or(
      `created_at.lt."${cursor.createdAt}",and(created_at.eq."${cursor.createdAt}",id.lt.${cursor.id})`
    )
  }

  const { data, error } = await query

  if (error) {
    console.error(`[getComments] Error fetching ${targetType} comments:`, error)
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
  const mappedData: CommentData[] = trimmedData.map((comment: any) => ({
    id: comment.id,
    content: comment.content,
    user_id: comment.user_id,
    author: comment.author,
    created_at: comment.created_at,
    updated_at: comment.updated_at ?? null,
    parent_id: comment.parent_id ?? null,
    recipient: comment.recipient ?? null,
    replies_count: comment.replies_count?.[0].count ?? 0,
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
  const targetColumn = `${targetType}_id`

  const {
    data: { user },
  } = await supabase.auth.getUser()
  if (!user) throw new Error("Unauthorized")

  const { data, error } = await supabase
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

  if (error) throw error
  revalidatePath("/", "layout")
}

/**
 * Deletes a specific comment after verifying ownership or administrative privileges.
 * @param commentId - The unique identifier of the comment to delete.
 * @throws {Error} If the user is unauthorized or the comment does not exist.
 */
export async function deleteComment({ commentId }: { commentId: string }) {
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()
  if (!user) throw new Error("Unauthorized")

  const [comment, { data: profile }] = await Promise.all([
    getComment({ commentId }),
    supabase.from("profiles").select("role").eq("id", user.id).single(),
  ])
  if (!comment) throw new Error("Comment not found")

  const isOwner = comment.user_id === user.id
  const isAdmin = profile?.role === "admin"

  if (!isOwner && !isAdmin) {
    throw new Error("Unauthorized: You don't have permission to delete this")
  }

  const { error } = await supabase.from("comments").delete().eq("id", commentId)

  if (error) throw error
  revalidatePath("/", "layout")
}

/**
 * Retrieves a single comment record by its ID.
 * * @param commentId - The ID of the comment to retrieve.
 * @returns The raw comment data from the database.
 */
export async function getComment({ commentId }: { commentId: string }) {
  const supabase = await createClient()

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
  const supabase = await createClient()
  const targetColumn = `${targetType}_id`

  return supabase
    .from("comments")
    .select("id", { count: "exact", head: true })
    .eq(targetColumn, targetId)
    .then(({ count, error }) => {
      if (error) {
        console.error(`[getCommentCount] Error fetching count for ${targetType}:`, error)
        return 0
      }
      return count ?? 0
    })
}
