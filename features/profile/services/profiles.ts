"use server"

import { createClient } from "@/lib/supabase/server"
import type { Profile } from "../types/profiles.types"

/**
 * Fetches a single user profile from the "profiles" table by its unique ID.
 * This is a server-side function.
 * @param id - The unique UUID of the user to fetch.
 * @returns A Promise that resolves to the Profile object, or null if not found.
 * @throws Will throw an error if the Supabase query fails (e.g., network issues, permission denied).
 * * @example
 * const profile = await getProfile({ id: 'user-uuid-123' });
 */
export async function getProfile({ id }: { id: string }): Promise<Profile> {
  const supabase = await createClient()
  const { data, error } = await supabase.from("profiles").select("*").eq("id", id).maybeSingle()

  if (error) throw error
  return data
}
