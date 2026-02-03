import { supabase } from '@/src/lib/supabase';

export async function signInWithGoogle() {
  const { data, error } = await supabase.auth.signInWithOAuth({
    provider: 'google',
    options: {
      redirectTo: 'http://localhost:8081',
    },
  });

  if (error) {
    console.error(error);
    throw error;
  }

  return data;
}
