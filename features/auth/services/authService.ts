import { createClient } from '@/lib/supabase/client';

const supabase = createClient();

export async function signInWithGoogle() {
  try {
    const redirectTo = process.env.NEXT_PUBLIC_SUPABASE_REDIRECT_URL;

    const { error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: { redirectTo },
    });

    if (error) {
      console.error('Sign in with Google error:', error.message);
      throw error;
    }
  } catch (err) {
    console.error('Unexpected login error:', err);
    throw err;
  }
}

export async function signOut() {
  try {
    const { error } = await supabase.auth.signOut();
    if (error) {
      console.error('Sign out error:', error.message);
      throw error;
    }
  } catch (err) {
    console.error('Unexpected sign out error:', err);
    throw err;
  }
}