"use server"

import { createClient } from "@/lib/supabase/server"

export async function getComments(targetId: number, targetType: string) {
  try {
    const supabase = await createClient()
    const { data, error } = await supabase
      .from("comments")
      .select("*")
      .eq("target_id", targetId)
      .eq("target_type", targetType)
      .order("created_at", { ascending: false })

    if (error) throw error
    return data
  } catch (error) {
    console.error("Failed to fetch comments:", error)
    return []
  }
}
