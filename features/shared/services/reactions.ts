"use server"

import { createClient } from "@/lib/supabase/server"
import { revalidatePath } from "next/cache"

export async function toggleReaction({
  targetId,
  targetType,
  emoji,
}: {
  targetId: number
  targetType: string
  emoji: string
}) {
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()
  if (!user) throw new Error("Unauthorized")

  const { data: existing, error: fetchError } = await supabase
    .from("reactions")
    .select("id, emoji")
    .match({
      user_id: user.id,
      target_id: targetId,
      target_type: targetType,
    })
    .maybeSingle()

  if (fetchError) throw fetchError

  if (existing?.emoji === emoji) {
    const { error: deleteError } = await supabase.from("reactions").delete().eq("id", existing.id)

    if (deleteError) throw deleteError
  } else {
    const { error: upsertError } = await supabase.from("reactions").upsert(
      {
        ...(existing ? { id: existing.id } : {}),
        user_id: user.id,
        target_id: targetId,
        target_type: targetType,
        emoji,
      },
      {
        onConflict: "user_id,target_id,target_type",
      }
    )

    if (upsertError) throw upsertError
  }

  revalidatePath("/", "layout")
}
