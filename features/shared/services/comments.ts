"use server"

import { createClient } from "@/lib/supabase/server"
import { revalidatePath } from "next/cache"
import { CommentData } from "../types/comments"
import { Reaction, ReactionCount } from "../types/reactions"
import { TOP_REACTIONS_AMOUNT } from "../constants/reactions"

export async function getComments(
  targetId: number, 
  targetType: string,
  topReactionsAmount: number = TOP_REACTIONS_AMOUNT
): Promise<CommentData[]> {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  const { data, error } = await supabase
    .from("comments")
    .select(`
      *,
      author:user_id (*),
      replied_user:reply_to_id (*),
      comment_reaction_counts(
        emoji,
        count
      ),
      reactions(
        emoji,
        user_id
      )
    `)
    .eq("target_id", targetId)
    .eq("target_type", targetType)
    .eq("reactions.target_type", "comment")
    .order("created_at", { ascending: false }) 
    
  console.log("rawData comment", data)
  if (error) {
    console.error("Supabase Error:", error)
    throw error
  }
  if (!data) return []

  return data.map((comment) => {
    const userReaction = user
    ? ((comment.reactions as Reaction[])?.find((r) => r.user_id === user.id) ?? null)
    : null
    const reactionCounts = (comment.project_reaction_counts as ReactionCount[]) ?? []
    const sortedReactionCounts = [...reactionCounts].sort((a, b) => b.count - a.count)

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
      reaction_summary: {
        hasReactions: reactionCounts.length > 0,
        userReaction: userReaction,
        totalReactions: sortedReactionCounts.reduce((sum, r) => sum + r.count, 0),
        all: sortedReactionCounts,
        top: sortedReactionCounts.slice(0, topReactionsAmount),
        total: reactionCounts.length,
        remaining: reactionCounts.length - topReactionsAmount,
      }
    }
  })
}

export async function addComment(formData: {
  targetId: number
  targetType: string
  content: string
  parentId?: number | null
  replyToId?: string | null
  replyId?: number | null
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
        reply_to_id: formData.replyToId,
        reply_id: formData.replyId
      },
    ])
    .select()
    .single()

  if (error) throw error
  revalidatePath("/", "layout")
}

export async function deleteComment(commentId: number) {
  const supabase = await createClient()
  
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) throw new Error("Unauthorized")
  
  const [comment, { data: profile }] = await Promise.all([
    getComment(commentId),
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

export async function getComment(commentId: number) {
  const supabase = await createClient()

  const { data, error } = await supabase
    .from("comments")
    .select("*")
    .eq("id", commentId)
    .single()

  if (error) throw error
  return data
}