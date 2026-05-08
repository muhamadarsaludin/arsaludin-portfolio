/**
 * Raw data from 'profiles' table.
 */
export type ProfileEntity = {
  id: string
  full_name: string
  email: string
  role: string
  avatar_url: string | null
  created_at: string
  updated_at: string
}

/**
 * Flattened Profile object.
 */
export type Profile = Pick<ProfileEntity, "id" | "full_name" | "email" | "role" | "avatar_url">
