// features/services/auth/googleLogin.js
import { createClient } from '@/lib/supabase/client';

const supabase = createClient();

export async function loginWithGoogle() {
  try {
    const redirectTo = process.env.NEXT_PUBLIC_SUPABASE_REDIRECT_URL;

    const { error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: { redirectTo },
    });

    if (error) {
      console.error('Google login error:', error.message);
      throw error;
    }
  } catch (err) {
    console.error('Unexpected login error:', err);
    throw err;
  }
}

export async function logout() {
  try {
    const { error } = await supabase.auth.signOut();
    if (error) {
      console.error('Logout error:', error.message);
      throw error;
    }
  } catch (err) {
    console.error('Unexpected logout error:', err);
    throw err;
  }
}