import { SupabaseClient } from "@supabase/supabase-js";

export async function SignIn(supabase: SupabaseClient) {
  return await supabase.auth.signInWithOAuth({
    provider: "google",
    options: {
      redirectTo: `${window.location.origin}/auth/callback?next=/Circles`,
    },
  });
}
