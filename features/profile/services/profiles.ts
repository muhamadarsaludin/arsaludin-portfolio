"use server"

import { createClient } from "@/lib/supabase/server"
import { Profile } from "../types/profiles"

export async function getProfile({
  id
}: {
  id: string
}): Promise<Profile> {
  const supabase = await createClient()
  const { data, error } = await supabase
    .from("profiles")
    .select("*")
    .eq("id", id)
    .maybeSingle()

  if (error) throw error
  return data
}
