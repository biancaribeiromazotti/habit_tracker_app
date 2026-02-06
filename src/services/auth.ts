import { supabase } from '@/src/lib/supabase';
import * as AuthSession from 'expo-auth-session';
import * as WebBrowser from 'expo-web-browser';

WebBrowser.maybeCompleteAuthSession();

export async function signInWithGoogle() {
  const redirectTo = AuthSession.makeRedirectUri({
    scheme: 'habitapp',
  });

  const { data, error } = await supabase.auth.signInWithOAuth({
    provider: 'google',
    options: {
      redirectTo,
    },
  });

  if (error) throw error;
  if (!data?.url) throw new Error('URL de autenticação inválida');

  const result = await WebBrowser.openAuthSessionAsync(data.url, redirectTo);

  if (result.type !== 'success' || !result.url) {
    throw new Error('Login cancelado');
  }

  // ✅ PARSE CORRETO DA URL
  const url = new URL(result.url);
  const hash = new URLSearchParams(url.hash.replace('#', ''));

  const access_token = hash.get('access_token');
  const refresh_token = hash.get('refresh_token');

  if (!access_token || !refresh_token) {
    throw new Error('Tokens não encontrados no retorno');
  }

  await supabase.auth.setSession({
    access_token,
    refresh_token,
  });
}
