import * as auth from "@/repositories/auth";
import { createClient } from "@/lib/server";
import { register, login } from "@/lib/auth";
import { redirect } from "next/navigation";

// export type User = { id: string; email: string; name: string };

export async function Register(_previousState: any, formdata: FormData) {
  const email = formdata.get("email") as string;
  const password = formdata.get("password") as string;
  const name = formdata.get("name") as string;

  if (!email.trim() || !password.trim() || !name.trim()) {
    return {
      success: false,
      message: "Email, Password, and Username are required.",
    };
  }

  if (name.trim().length < 2) {
    return {
      success: false,
      message: "Username cannot be shorter than 2 characters.",
    };
  }

  if (password.length < 8) {
    return {
      success: false,
      message: "Password must at least be 8 characters.",
    };
  }

  let data;

  try {
    data = await register(email, password, name.trim());
  } catch (error) {
    return {
      success: false,
      message: "An error has occurred, please try again later.",
    };
  }

  if (data.status === 500) {
    return {
      success: false,
      message: data.data.error,
    };
  }

  redirect("/");
}

export async function Login(_previousState: any, formdata: FormData) {
  const email = formdata.get("email") as string;
  const password = formdata.get("password") as string;

  if (!email.trim() || !password.trim()) {
    return {
      success: false,
      message: "Email and Password are required.",
    };
  }

  let data;

  try {
    data = await login(email, password);
  } catch (error) {
    console.error(error);
    return {
      success: false,
      message: "An error has occured, please try again later.",
    };
  }

  if (data.status !== 200) {
    console.log(data, "in if else");
    return {
      success: false,
      message: data.data.error,
    };
  }
  console.log(data, "in redirect");
  redirect("/dashboard");
}

// import * as auth from "@/repositories/auth";
// import { SupabaseClient } from "@supabase/supabase-js";

// export async function login(supabase: SupabaseClient) {
//   const { data, error } = await auth.SignIn(supabase);

//   if (error) {
//     console.log(error, "is error");
//     return {
//       code: 500,
//       message: "Could not sign in. Please try again.i",
//     };
//   }

//   return {
//     code: 200,
//     message: "Login Successful",
//   };
// }
