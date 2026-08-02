import * as auth from "@/repositories/auth";
import { SupabaseClient } from "@supabase/supabase-js";

export async function login(supabase: SupabaseClient) {
  const { data, error } = await auth.SignIn(supabase);

  if (error) {
    console.log(error, "is error");
    return {
      code: 500,
      message: "Could not sign in. Please try again.i",
    };
  }

  return {
    code: 200,
    message: "Login Successful",
  };
}
