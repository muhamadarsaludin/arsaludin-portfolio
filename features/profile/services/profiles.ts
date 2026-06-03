import { supabase } from "@/lib/supabase/client"
import type { Profile } from "../types/profiles.types"

/**
 * Fetches a single user profile from the "profiles" table by its unique ID.
 * @param id - The unique UUID of the user to fetch.
 * @returns A Promise that resolves to the Profile object, or null if not found.
 * @throws Will throw an error if the Supabase query fails (e.g., network issues, permission denied).
 * @example
 * const profile = await getProfile({ id: 'user-uuid-123' });
 */
export async function getProfile({ id }: { id: string }): Promise<Profile | null> {
  const { data, error } = await supabase
    .from("profiles")
    .select<string, Profile>(
      `
      id,
      full_name,
      email,
      role,
      avatar_url
    `
    )
    .eq("id", id)
    .maybeSingle()

  if (error) {
    console.error("[getProfile] Failed to fetch profile:", error.message)
    throw error
  }

  return data
}
