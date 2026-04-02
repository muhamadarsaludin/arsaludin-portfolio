"use server"

import { createClient } from "@/lib/supabase/server"
import { revalidatePath } from "next/cache"
import { CommentData } from "../types/comments"

export async function getComments(
  targetId: number, 
  targetType: string
): Promise<CommentData[]> {
  const supabase = await createClient()
  const { data, error } = await supabase
    .from("comments")
    .select(`
      *,
      author:user_id (*),
      replied_user:reply_to_id (*)
    `)
    .eq("target_id", targetId)
    .eq("target_type", targetType)
    .order("created_at", { ascending: false }) 

  if (error) {
    console.error("Supabase Error:", error)
    throw error
  }
  if (!data) return []

  return data.map((comment) => {
    return {
      id: comment.id,
      content: comment.content,
      user_id: comment.user_id,
      target_id: comment.target_id,
      target_type: comment.target_type,
      parent_id: comment.parent_id,
      created_at: comment.created_at, 
      author: {
        id: comment.author.id,
        full_name: comment.author.full_name,
        email: comment.author.email,
        avatar_url: comment.author.avatar_url,
        role: comment.author.role
      },
      reply_profile: comment.replied_user ? {
        id: comment.replied_user.id,
        full_name: comment.replied_user.full_name,
        email: comment.replied_user.email,
        avatar_url: comment.replied_user.avatar_url,
        role: comment.replied_user.role
      } : null,
    }
  })
}

export async function addComment(formData: {
  targetId: number
  targetType: string
  content: string
  parentId?: number | null
  replyToId?: string | null
}) {
  const supabase = await createClient()
  
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) throw new Error("Unauthorized")

  const { data, error } = await supabase
    .from("comments")
    .insert([
      {
        target_id: formData.targetId,
        target_type: formData.targetType,
        content: formData.content,
        parent_id: formData.parentId || null,
        user_id: user.id,
        reply_to_id: formData.replyToId
      },
    ])
    .select()
    .single()

  if (error) throw error
  revalidatePath("/", "layout")
}

export async function deleteComment(commentId: number, path: string) {
  try {
    const supabase = await createClient()
    
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) throw new Error("Unauthorized")

    const { error } = await supabase
      .from("comments")
      .delete()
      .eq("id", commentId)
      .eq("user_id", user.id)

    if (error) throw error

    revalidatePath(path)
    return { success: true }
  } catch (error) {
    console.error("Delete comment error:", error)
    return { success: false, error }
  }
}