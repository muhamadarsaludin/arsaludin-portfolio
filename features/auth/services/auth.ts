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
    const redirectTo = process.env.NEXT_PUBLIC_SUPABASE_REDIRECT_URL

    const { error } = await supabase.auth.signInWithOAuth({
      provider: "google",
      options: { redirectTo },
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
