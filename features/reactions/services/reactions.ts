"use server"

import { supabase } from "@/lib/supabase/public"
import { createClient } from "@/lib/supabase/server"
import { PaginatedReactions, Reaction, ReactionCount, ReactionSummary, ReactionTargetType } from "../types/reactions.types"
import { Cursor } from "@/features/shared/types/index.types"
import { REACTIONS_PAGE_SIZE } from "../constants/reactions.constants"
import { revalidatePath } from "next/cache"

type GetReactionSummaryParams = {
  targetId: string
  targetType: ReactionTargetType
}

type GetUserReactionParams = {
  targetId: string
  targetType: ReactionTargetType
}

type GetPaginatedReactionsParams = {
  targetId: string
  targetType: ReactionTargetType
  cursor?: Cursor | null
  pageSize?: number
}


type ToggleReactionParams = {
  targetId: string
  targetType: ReactionTargetType
  emoji: string
}


/**
 * Fetches reaction summary data for a specific target (e.g. project, article, etc).
 * @param params - The query configuration parameters object.
 * @param params.targetId - The unique identifier of the entity receiving reactions (e.g., project UUID, blog slug).
 * @param params.targetType - The entity type (e.g., 'project', 'blog') used to dynamically map columns and view tables.
 * @returns A promise that resolves to a {@link ReactionSummary} object containing the user state and aggregated metadata.
 * @example
 * // Used for client-side hydration on static portfolio pages (SSG)
 * const summary = await getReactionSummary({
 * targetId: "project_123",
 * targetType: "project",
 * });
 */
export async function getReactionSummary({
  targetId,
  targetType
}: GetReactionSummaryParams): Promise<ReactionSummary> {
  // Dynamic schema mapping based on target entity type
  const targetColumn = `${targetType}_id`
  const viewTable = `${targetType}_reaction_counts`

  const {data, error} = await supabase
    .from(viewTable)
    .select<string, ReactionCount>("emoji, count")
    .eq(targetColumn, targetId)
    .order("count", { ascending: false })

  if (error) {
    console.error("[getReactionSummary] Failed to fetch reaction summary:", error)
    throw error
  }

  const allReactions = data ?? []
  const totalReactions = allReactions.reduce((acc, curr) => acc + (curr.count ?? 0), 0)

  return {
    allReactions,
    totalReactions,
    totalEmojis: allReactions.length,
  }
}

/**
 * Fetches the specific reaction details made by a user on a given target.
 * @param params - The query configuration parameters object.
 * @param params.targetId - The unique identifier of the entity that was reacted to (e.g., project UUID, comment ID).
 * @param params.targetType - The entity type (e.g., 'project', 'comment') used to dynamically map columns.
 * @param params.userId - The unique identifier of the user whose reaction is being checked.
 * @returns A promise that resolves to the {@link Reaction} object if found, or `null` if the user has not reacted.
 * @example
 * // Used to determine if the active user should see an active/highlighted state on a reaction button
 * const userReaction = await getUserReaction({
 *   targetId: "project_123",
 *   targetType: "project",
 *   userId: "user_abc",
 * });
 */
export async function getUserReaction({
  targetId,   
  targetType
}:GetUserReactionParams): Promise<Reaction | null> {
  const supabase = await createClient()

  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return null

  const targetColumn = `${targetType}_id`

  const { data, error } = await supabase
    .from("reactions")
    .select<string, Reaction>(`
      id,
      emoji,
      user_id,
      created_at,
      updated_at,
      author:profiles!inner(
        id,
        full_name,
        email,
        role,
        avatar_url
      )
    `)
    .eq(targetColumn, targetId)
    .eq("user_id", user.id)
    .maybeSingle()

  if (error) {
    console.error("[getUserReaction] failed to fetch user reaction:", error)
    throw error
  }

  return data
}

export async function getPaginatedReactions({
  targetId,
  targetType,
  cursor,
  pageSize = REACTIONS_PAGE_SIZE,
}: GetPaginatedReactionsParams): Promise<PaginatedReactions> {
  const targetColumn = `${targetType}_id`

  let query = supabase
    .from("reactions")
    .select<string, Reaction>(
      `
      id, 
      emoji, 
      user_id,
      created_at, 
      updated_at,
      author:profiles!inner (
        id, 
        email, 
        full_name, 
        role, 
        avatar_url
      )
    `
    )
    .eq(targetColumn, targetId)
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
    console.error("[getPaginatedReactions] failed to fetch paginated reactions:", error)
    throw error
  }

  const hasMore = data.length > pageSize
  const trimmedData = hasMore ? data.slice(0, pageSize) : data
  const lastItem = trimmedData[trimmedData.length - 1]

  return {
    data: trimmedData,
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
 * Server Action to handle toggling user reactions (Insert / Delete / Update) on a target entity.
 * Enforces a strict boundary constraint: One active user can only have a single reaction 
 * mapped to a specific target at any given time.
 * @param params - The configuration parameters object for mutation.
 * @param params.targetId - The unique UUID of the target entity receiving the reaction.
 * @param params.targetType - The classification of the entity ('project' or 'blog').
 * @param params.emoji - The actual raw string of the emoji icon selected by the user.
 * @returns A promise that resolves to void once the database operation synchronizes.
 */
export async function toggleReactionAction({
  targetId,
  targetType,
  emoji,
}: ToggleReactionParams) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) throw new Error("Unauthorized: User must be authenticated to toggle reactions.")

  const targetColumn = `${targetType}_id`

  try {
    const { data: existingReaction } = await supabase
      .from("reactions")
      .select("id, emoji")
      .eq(targetColumn, targetId)
      .eq("user_id", user.id)
      .maybeSingle()

    if (existingReaction && existingReaction.emoji === emoji) {
      const { error: deleteError } = await supabase
        .from("reactions")
        .delete()
        .eq("id", existingReaction.id)

      if (deleteError) {
        console.error("[toggleReactionAction] Failed to delete reaction:", deleteError)
        throw deleteError
      } 
      revalidatePath("/", "layout")
      return
    }

    if (existingReaction && existingReaction.emoji !== emoji) {
      const { error: updateError } = await supabase
        .from("reactions")
        .update({ emoji, updated_at: new Date().toISOString() })
        .eq("id", existingReaction.id)

      if (updateError) {
        console.error("[toggleReactionAction] Failed to update reaction:", updateError)
        throw updateError
      }
      revalidatePath("/", "layout")
      return
    }

    const { error: addError } = await supabase
      .from("reactions")
      .insert({
        [targetColumn]: targetId,
        user_id: user.id,
        emoji
      })

    if (addError) {
      console.error("[toggleReactionAction] Failed to add reaction:", addError)
      throw addError
    }

    revalidatePath("/", "layout")
  } catch (error) {
    console.error("[toggleReactionAction] Failed to toggle reaction:", error)
    throw error
  }
}



