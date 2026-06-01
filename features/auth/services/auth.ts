import { createClient } from "@/lib/supabase/client"

const supabase = createClient()

/**
 * Initiates the Google OAuth sign-in using Supabase.
 *
 * This function triggers a redirect to Google's consent screen.
 * After successful authentication, Supabase will redirect the user back
 * to the URL defined in the NEXT_PUBLIC_SUPABASE_REDIRECT_URL environment variable.
 *
 * @throws {Error} If the OAuth provider fails or the redirect URL is misconfigured.
 */
export async function signInWithGoogle() {
  try {
    const baseUrl = process.env.NEXT_PUBLIC_SUPABASE_REDIRECT_URL
    const currentPath = window.location.pathname + window.location.search
    const finalRedirectTo = `${baseUrl}?next=${encodeURIComponent(currentPath)}`

    const { error } = await supabase.auth.signInWithOAuth({
      provider: "google",
      options: {
        redirectTo: finalRedirectTo,
        queryParams: {
          access_type: "offline",
          prompt: "select_account",
        },
      },
    })

    if (error) {
      console.error("Sign in with Google error:", error.message)
      throw error
    }
  } catch (err) {
    console.error("Unexpected login error:", err)
    throw err
  }
}

/**
 * Signs out the currently authenticated user.
 * This will clear the session from both the Supabase auth store and the browser's local storage/cookies.
 * @throws {Error} If the sign-out process encounters a Supabase internal error.
 */
export async function signOut() {
  try {
    const { error } = await supabase.auth.signOut()
    if (error) {
      console.error("Sign out error:", error.message)
      throw error
    }
  } catch (err) {
    console.error("Unexpected sign out error:", err)
    throw err
  }
}

/**
 * Request account deletion for the currently authenticated user.
 *
 * This function works by inserting the user's ID into the `delete_requests` table.
 * A database trigger in Supabase (PostgreSQL) will catch this insert and
 * execute the actual account deletion using service_role privileges.
 *
 * After a successful request, it will sign the user out to clear local session data.
 *
 * @param {string} userId - The unique identifier of the user to be deleted.
 * @throws {Error} If the database insert fails or the user is not authorized.
 * @returns {Promise<void>}
 */
export async function deleteAccount(userId: string): Promise<void> {
  try {
    // 1. Insert ke tabel perantara untuk mentrigger fungsi DB
    const { error: deleteError } = await supabase.from("delete_requests").insert({ id: userId })

    if (deleteError) {
      console.error("Failed to request account deletion:", deleteError.message)
      throw deleteError
    }

    // 2. Sign out untuk membersihkan session di client side
    await signOut()
  } catch (err) {
    console.error("Unexpected error during account deletion:", err)
    throw err
  }
}
