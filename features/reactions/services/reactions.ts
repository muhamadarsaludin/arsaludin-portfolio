"use server"

import { createClient } from "@/lib/supabase/server"
import type { 
  ReactionSummary, 
  ReactionTargetType, 
  PaginatedReactions, 
  Reaction 
} from "../types/reactions.types"
import type { Cursor } from "@/features/shared/types/index.types"
import { MAX_TOP_REACTIONS } from "../constants/reactions.constants"

type GetReactionSummaryParams = {
  targetId: string
  targetType: ReactionTargetType
  topReactionsCount?: number
}

type GetReactionsParams = { 
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
 * Fetches unified reaction statistics and the current authenticated user's reaction status.
 * Optimized for Server-Side Rendering (SSR) and initial hydration.
 * Uses database views to achieve an O(1) query performance for counts.
 * @param params - The configuration object.
 * @param params.targetId - The UUID of the target entity (e.g., project or comment ID).
 * @param params.targetType - The classification of the target ("project" | "comment").
 * @returns {Promise<ReactionSummary>} An aggregated summary including total counts, 
 * top emojis, the complete list of emojis used, and the user's current reaction.
 * @throws Will throw an error if the Supabase query fails.
 */
export async function getReactionSummary({
  targetId,
  targetType,
  topReactionsCount = MAX_TOP_REACTIONS,
}: GetReactionSummaryParams): Promise<ReactionSummary> {
  const supabase = await createClient()
  const targetColumn = `${targetType}_id`
  const viewTable = `${targetType}_reaction_counts`

  const { data: { user } } = await supabase.auth.getUser()

  const [countsRes, userRes] = await Promise.all([
    supabase
      .from(viewTable)
      .select("emoji, count")
      .eq(targetColumn, targetId)
      .order("count", { ascending: false }),
    user 
      ? supabase
          .from("reactions")
          .select(`
            id, emoji, user_id, created_at, updated_at,
            author:profiles!inner (id, email, full_name, role, avatar_url)
          `)
          .eq(targetColumn, targetId)
          .eq("user_id", user.id)
          .maybeSingle() 
      : Promise.resolve({ data: null, error: null })
  ])

  const allReactions = countsRes.data || []
  const rawUserReaction: any = userRes.data
  const userReaction = rawUserReaction ? {
    ...rawUserReaction,
    author: Array.isArray(rawUserReaction.author) ? rawUserReaction.author[0] : rawUserReaction.author
  } : null

  return {
    userReaction,
    allReactions,
    totalReactions: allReactions.reduce((acc, curr) => acc + curr.count, 0),
    topReactions: allReactions.slice(0, topReactionsCount),
    totalEmojis: allReactions.length,
    remainingEmojis: Math.max(0, allReactions.length - topReactionsCount),
  }
}

/**
 * Fetches a paginated list of users who reacted to a specific target.
 * Designed exclusively for detailed views (like a "See who reacted" modal) 
 * to prevent over-fetching on the initial page load.
 * @param params - The configuration object.
 * @param params.targetId - The UUID of the target entity.
 * @param params.targetType - The classification of the target ("project" | "comment").
 * @param params.cursor - The timestamp cursor for cursor-based pagination. Pass `null` for the first page.
 * @param params.pageSize - The number of records to fetch per page (defaults to 10).
 * @returns {Promise<PaginatedReactions>} A paginated list of Reaction objects with `hasMore` and `nextCursor` states.
 * @throws Will throw an error if the Supabase query fails.
 */
export async function getReactions({
  targetId,
  targetType,
  cursor,
  pageSize = 10,
}: GetReactionsParams): Promise<PaginatedReactions> {
  const supabase = await createClient()
  const targetColumn = `${targetType}_id`

  let query = supabase
    .from("reactions")
    .select(`
      id, emoji, user_id, created_at, updated_at,
      author:profiles!inner (id, email, full_name, role, avatar_url)
    `)
    .eq(targetColumn, targetId)
    .order("created_at", { ascending: false })
    .limit(pageSize + 1)

  if (cursor) {
    query = query.lt("created_at", cursor)
  }

  const { data, error } = await query
  if (error) throw error

  const hasMore = data.length > pageSize
  const trimmedData = hasMore ? data.slice(0, pageSize) : data
  const lastItem = trimmedData[trimmedData.length - 1]

  // Type mapping safety
  const formattedData: Reaction[] = trimmedData.map((item: any) => ({
    ...item,
    author: Array.isArray(item.author) ? item.author[0] : item.author
  }))
  

  return {
    data: formattedData,
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
 * Toggles a user's reaction on a specific target. 
 * Automatically handles Add, Remove, and Update (change emoji) operations based on the user's current state.
 * * @param params - The configuration object.
 * @param params.targetId - The UUID of the target entity.
 * @param params.targetType - The classification of the target ("project" | "comment").
 * @param params.emoji - The string representation of the emoji to toggle.
 * @returns {Promise<any>} The result of the Supabase mutation.
 * @throws Will throw an Error if the user is unauthorized or the database operation fails.
 */
export async function toggleReaction({
  targetId,
  targetType,
  emoji
}: ToggleReactionParams) {
  const supabase = await createClient()
  const targetColumn = `${targetType}_id`
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) throw new Error("Unauthorized")

  // Check existing reaction
  const { data: existing } = await supabase
    .from("reactions")
    .select("id, emoji")
    .eq(targetColumn, targetId)
    .eq("user_id", user.id)
    .maybeSingle()

  if (existing) {
    if (existing.emoji === emoji) {
      // Remove if same emoji
      return supabase.from("reactions").delete().eq("id", existing.id)
    } else {
      // Update if different emoji
      return supabase.from("reactions").update({ emoji, updated_at: new Date().toISOString() }).eq("id", existing.id)
    }
  }

  // Insert new reaction
  return supabase.from("reactions").insert({
    [targetColumn]: targetId,
    user_id: user.id,
    emoji,
  })
}