"use server"

import { supabase } from "@/lib/supabase/public"
import { createClient } from "@/lib/supabase/server"
import type {
  PaginatedReactions,
  Reaction,
  ReactionCount,
  ReactionSummary,
  ReactionTargetType,
} from "../types/reactions.types"
import type { Cursor } from "@/features/shared/types/index.types"
import { REACTIONS_PAGE_SIZE } from "../constants/reactions.constants"

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

type GetBatchReactionsParams = {
  targetIds: string[]
  targetType: ReactionTargetType
}

type GetBatchReactionsResult = Record<string, { summary: ReactionSummary; userReaction: Reaction | null }>

type GetBatchUserReactionsParams = GetBatchReactionsParams

type GetBatchUserReactionsResult = Record<string, Reaction | null>

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
  targetType,
}: GetReactionSummaryParams): Promise<ReactionSummary> {
  // Dynamic schema mapping based on target entity type
  const targetColumn = `${targetType}_id`
  const viewTable = `${targetType}_reaction_counts`

  const { data, error } = await supabase
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
  targetType,
}: GetUserReactionParams): Promise<Reaction | null> {
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()
  if (!user) return null

  const targetColumn = `${targetType}_id`

  const { data, error } = await supabase
    .from("reactions")
    .select<string, Reaction>(
      `
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
    `
    )
    .eq(targetColumn, targetId)
    .eq("user_id", user.id)
    .maybeSingle()

  if (error) {
    console.error("[getUserReaction] failed to fetch user reaction:", error)
    throw error
  }

  return data
}

/**
 * Fetches a paginated list of reactions with author profiles for a specific target.
 * @param params - The query configuration parameters object.
 * @param params.targetId - The unique identifier of the entity that was reacted to (e.g., project UUID, comment ID).
 * @param params.targetType - The entity type (e.g., 'project', 'blog') used to dynamically map columns.
 * @param params.cursor - The pagination pointer containing the boundary timestamp and ID from the previous page.
 * @param params.pageSize - The maximum number of reaction records to retrieve per page lifecycle.
 * @returns A promise that resolves to a {@link PaginatedReactions} object containing the record slice and the next cursor pointer.
 * @example
 * const targetReactions = await getPaginatedReactions({
 * targetId: "achievement_123",
 * targetType: "achievement",
 * cursor: currentCursor,
 * pageSize: 10,
 * });
 */
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
 * Fetches reaction summaries and the active user's specific reaction state for multiple targets simultaneously.
 * Leverages high-performance parallel execution and broad array matching (.in()) to completely resolve N+1 query bottlenecks.
 * @param params - The batch query configuration parameters object.
 * @param params.targetIds - An array of unique identifiers for the entities receiving reactions (e.g., array of achievement UUIDs).
 * @param params.targetType - The entity classification ('achievement', 'project', or 'blog') used to dynamically compute database relations and view mappings.
 * @returns A promise that resolves to a heavily indexed lookup hash Map where keys are target IDs, allowing O(1) retrieval complexity down the UI tree.
 * * @example
 * const batchReactions = await getBatchReactions({
 * targetIds: ["achievement_a", "achievement_b", "achievement_c"],
 * targetType: "achievement",
 * });
 */
export async function getBatchReactions({
  targetIds,
  targetType,
}: GetBatchReactionsParams): Promise<
  GetBatchReactionsResult
> {
  if (!targetIds || targetIds.length === 0) return {}
  
  const clientSupabase = await createClient()
  const targetColumn = `${targetType}_id`
  const viewTable = `${targetType}_reaction_counts`

  const {
    data: { user },
  } = await clientSupabase.auth.getUser()

  const [summariesResponse, userReactionsResponse] = await Promise.all([
    supabase
      .from(viewTable)
      .select<string, ReactionCount & { [key: string]: string }>(`emoji, count, ${targetColumn}`)
      .in(targetColumn, targetIds),

    user
      ? clientSupabase
          .from("reactions")
          .select<string, Reaction & { [key: string]: string }>(
            `
            id,
            emoji,
            user_id,
            created_at,
            updated_at,
            ${targetColumn},
            author:profiles!inner(
              id,
              full_name,
              email,
              role,
              avatar_url
            )
          `
          )
          .eq("user_id", user.id)
          .in(targetColumn, targetIds)
      : Promise.resolve({ data: [], error: null }),
  ])

  if (summariesResponse.error) {
    console.error("[getBatchReactions] Failed to fetch batch summaries:", summariesResponse.error)
    throw summariesResponse.error
  }

  if (userReactionsResponse.error) {
    console.error("[getBatchReactions] Failed to fetch batch user reactions:", userReactionsResponse.error)
    throw userReactionsResponse.error
  }

  const allSummaries = summariesResponse.data || []
  const allUserReactions = userReactionsResponse.data || []

  // 2. Mapping result query { [targetId]: { summary, userReaction } }
  const result = targetIds.reduce((acc, id) => {
    const itemReactionCounts = allSummaries
      .filter((item) => item[targetColumn] === id)
      .map((item) => ({ emoji: item.emoji, count: item.count }))

    const totalReactions = itemReactionCounts.reduce((sum, curr) => sum + (curr.count ?? 0), 0)
    const itemUserReaction = allUserReactions.find((react) => react[targetColumn] === id) || null

    acc[id] = {
      summary: {
        allReactions: itemReactionCounts,
        totalReactions,
        totalEmojis: itemReactionCounts.length,
      },
      userReaction: itemUserReaction,
    }

    return acc
  }, {} as GetBatchReactionsResult)

  return result
}

/**
 * Fetches only the active user's specific reaction state for multiple targets simultaneously
 * to completely eliminate client-side N+1 query bottlenecks for session-based private data.
 * @remarks
 * **FUTURE MIGRATION CONSIDERATION (HYBRID APPROACH):**
 * Current architecture is Hybrid (Summary from server, User Reaction batched here). It prevents N+1 
 * but risks minor UI flickering when server-side SSG data is stale. To achieve 100% zero-flickering 
 * and a clean Single Source of Truth for Optimistic Updates, remove the reaction summary from the 
 * server query, use an empty state blueprint for the initial UI, and switch back to the original batch function.
 * @param params - The batch configuration parameters including target IDs and type.
 * @param params.targetIds - An array of unique identifiers for the entities receiving reactions (e.g., array of achievement UUIDs).
 * @param params.targetType - The entity classification ('achievement', 'project', or 'blog') used to dynamically compute database relations and view mappings.
 * @returns A promise that resolves to an indexed lookup hash Map for O(1) user reaction retrieval.
 * @see {@link getBatchReactions} for the full client-side summary + reaction batching alternative.
 */
export async function getBatchUserReactions({
  targetIds,
  targetType,
}: GetBatchUserReactionsParams): Promise<GetBatchUserReactionsResult> {
  if (!targetIds || targetIds.length === 0) return {};

  const clientSupabase = await createClient();
  const targetColumn = `${targetType}_id`;

  const {
    data: { user },
  } = await clientSupabase.auth.getUser();

  if (!user) {
    return targetIds.reduce((acc, id) => {
      acc[id] = null
      return acc
    }, {} as GetBatchUserReactionsResult)
  }

  const { data: userReactions, error } = await clientSupabase
    .from("reactions")
    .select<string, Reaction & { [key: string]: string }>(
      `
      id,
      emoji,
      user_id,
      created_at,
      updated_at,
      ${targetColumn},
      author:profiles!inner(
        id,
        full_name,
        email,
        role,
        avatar_url
      )
    `
    )
    .eq("user_id", user.id)
    .in(targetColumn, targetIds)

  if (error) {
    console.error("[getBatchUserReactions] Failed to fetch batch user reactions:", error)
    throw error
  }

  const allUserReactions = userReactions || []

  const result = targetIds.reduce((acc, id) => {
    const itemUserReaction = allUserReactions.find((react) => react[targetColumn] === id) || null
    acc[id] = itemUserReaction 
    return acc
  }, {} as GetBatchUserReactionsResult)

  return result
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
export async function toggleReactionAction({ targetId, targetType, emoji }: ToggleReactionParams) {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()
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
      return
    }

    const { error: addError } = await supabase.from("reactions").insert({
      [targetColumn]: targetId,
      user_id: user.id,
      emoji,
    })

    if (addError) {
      console.error("[toggleReactionAction] Failed to add reaction:", addError)
      throw addError
    }
  } catch (error) {
    console.error("[toggleReactionAction] Failed to toggle reaction:", error)
    throw error
  }
}
