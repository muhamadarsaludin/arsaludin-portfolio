"use server"

import { createClient } from "@/lib/supabase/server"
import { revalidatePath } from "next/cache"
import { ReactionCount, ReactionTargetType } from "../types/reactions"

type ToggleReactionParams = {
  targetId: string
  targetType: ReactionTargetType
  emoji: string
}

/**
 * Toggles a user's reaction on a specific target.
 * * Logic:
 * 1. If the user has already reacted with the exact same emoji, the reaction is removed (deleted).
 * 2. If the user has not reacted, or reacted with a different emoji, the reaction is updated or created (upserted).
 * * @param params - The target ID, target type, and emoji string.
 * @throws {Error} Throws an error if the user is unauthenticated or if the database operation fails.
 * @returns {Promise<void>}
 */
export async function toggleReaction({
  targetId,
  targetType,
  emoji,
}: ToggleReactionParams): Promise<void> {
  const supabase = await createClient()

  const { data: { user } } = await supabase.auth.getUser()
  
  if (!user) {
    console.warn("[toggleReaction] Unauthorized attempt")
    throw new Error("Unauthorized")
  }

  const targetColumn = `${targetType}_id`

  const { data: existing, error: fetchError } = await supabase
    .from("reactions")
    .select("id, emoji")
    .eq("user_id", user.id)
    .eq(targetColumn, targetId)
    .maybeSingle()

  if (fetchError) {
    console.error(`[toggleReaction] Fetch error for ${targetType}:`, fetchError)
    throw new Error("Failed to process reaction")
  }

  if (existing?.emoji === emoji) {
    const { error: deleteError } = await supabase
      .from("reactions")
      .delete()
      .eq("id", existing.id)

    if (deleteError) {
      console.error("[toggleReaction] Delete error:", deleteError)
      throw new Error("Failed to remove reaction")
    }
  } else {
    const { error: upsertError } = await supabase
      .from("reactions")
      .upsert(
        {
          ...(existing ? { id: existing.id } : {}),
          user_id: user.id,
          [targetColumn]: targetId,
          emoji,
        },
        { onConflict: `user_id,${targetColumn}` }
      )

    if (upsertError) {
      console.error("[toggleReaction] Upsert error:", upsertError)
      throw new Error("Failed to save reaction")
    }
  }

  revalidatePath("/", "layout")
}


type GetAllReactionsParams = {
  targetId: string
  targetType: ReactionTargetType
}

/**
 * Mengambil semua statistik reaksi untuk target tertentu (Project/Post/dll).
 * Data ini biasanya ditampilkan di dalam popover/modal detail reaksi.
 * * @param targetId - UUID dari project atau target reaksi.
 * @param targetType - Tipe target (untuk fleksibilitas jika ada post/comment).
 * @returns Promise berisi array ReactionCount yang sudah di-sort berdasarkan jumlah terbanyak.
 */
export async function getAllReactions({
  targetId,
  targetType,
}: GetAllReactionsParams): Promise<ReactionCount[]> {
  const supabase = await createClient()
  const targetColumn = `${targetType}_id`
  const viewTable = `${targetType}_reaction_counts`

  const { data, error } = await supabase
    .from(viewTable)
    .select("emoji, count")
    .eq(targetColumn, targetId)
    .order("count", { ascending: false })

  if (error) {
    console.error(`[getAllReactions] Error fetching ${targetType} reactions:`, error.message)
    return []
  }

  return (data as ReactionCount[]) || []
}