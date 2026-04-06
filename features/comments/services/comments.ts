"use server"

import { createClient } from "@/lib/supabase/server"
import { revalidatePath } from "next/cache"
import { CommentData, CommentTargetType, PaginatedComments } from "../types/comments"
import { COMMENTS_PAGE_SIZE } from "../constants/comments"
import { Cursor } from "@/features/shared/types"

type GetCommentsParams = {
  targetId: string
  targetType: CommentTargetType
  cursor?: Cursor
  pageSize?: number
}
export async function getComments({
  targetId, 
  targetType,
  cursor,
  pageSize = COMMENTS_PAGE_SIZE
}: GetCommentsParams): Promise<PaginatedComments> {
  const supabase = await createClient()

  const targetColumn = `${targetType}_id`

  let query = supabase 
    .from("comments")
    .select(`
      id,
      content,
      created_at,
      user_id,
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
      hasMore: false
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
    nextCursor: hasMore ? {
      createdAt: lastItem.created_at,
      id: lastItem.id
    } : null,
    hasMore
  }
}

type AddCommentParams = {
  targetId: string
  targetType: string
  content: string
  parentId: string | null
  recipientId: string | null
  replyToId: string | null
}
export async function addComment({
  targetId, 
  targetType,
  content,
  parentId,
  recipientId,
  replyToId
}:AddCommentParams) {
  const supabase = await createClient()
  const targetColumn = `${targetType}_id`
  
  const { data: { user } } = await supabase.auth.getUser()
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
        reply_to_id: replyToId
      },
    ])
    .select()
    .single()

  if (error) throw error
  revalidatePath("/", "layout")
}

export async function deleteComment({commentId}: {commentId: string}) {
  const supabase = await createClient()
  
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) throw new Error("Unauthorized")
  
  const [comment, { data: profile }] = await Promise.all([
    getComment({commentId}),
    supabase
      .from("profiles")
      .select("role")
      .eq("id", user.id)
      .single()
  ])
  if (!comment) throw new Error("Comment not found")
  
  const isOwner = comment.user_id === user.id
  const isAdmin = profile?.role === "admin"

  if (!isOwner && !isAdmin) {
    throw new Error("Unauthorized: You don't have permission to delete this")
  }
  
  const { error } = await supabase
    .from("comments")
    .delete()
    .eq("id", commentId)

  if (error) throw error
  revalidatePath("/", "layout")
}

export async function getComment({commentId}: {commentId: string}) {
  const supabase = await createClient()

  const { data, error } = await supabase
    .from("comments")
    .select("*")
    .eq("id", commentId)
    .single()

  if (error) throw error
  return data
}