import * as auth from "@/repositories/auth";
import { redirect } from "next/navigation";
import { getCsrfToken } from "../lib/csrf";
import { apiFetch } from "../backend/api";

// export type User = { id: string; email: string; name: string };

const API_URL = process.env.NEXT_PUBLIC_API_URL!;

export async function register(
  email: string,
  password: string,
  username: string,
) {
  //-------------------------execute function-------------------
  const res = await fetch(`${API_URL}/auth/register`, {
    method: "POST",
    credentials: "include",
    headers: {
      "Content-Type": "application/json",
      "X-CSRF-Token": getCsrfToken(),
    },
    body: JSON.stringify({ email, password, username }),
  });
  //-------------------------execute function-------------------

  //-------------------------throw the error--------------------
  if (!res.ok) {
    const body = await res.json().catch(() => ({}));
    throw new Error(body.error ?? "Registration failed");
  }
  //-------------------------throw the error--------------------

  //-------------------------parse json result------------------
  const message = await res.json();
  //-------------------------parse json result------------------

  //-------------------------return parsed result---------------
  return {
    status: res.status,
    data: message,
  };
  //-------------------------return parsed result---------------
}

export async function login(email: string, password: string) {
  const res = await fetch(`${API_URL}/auth/login`, {
    method: "POST",
    credentials: "include",
    headers: {
      "Content-Type": "application/json",
      "X-CSRF-Token": getCsrfToken(),
    },
    body: JSON.stringify({ email, password }),
  });

  if (!res.ok) {
    const body = await res.json().catch(() => ({}));
    throw new Error(body.error ?? "Login failed");
  }

  const message = await res.json();

  return {
    status: res.status,
    data: message,
  };
}

export async function logout() {
  return apiFetch("api/logout", { method: "POST" });
}

export async function ensureCsrfToken() {
  if (!getCsrfToken()) {
    await fetch(`${API_URL}/csrf-token`, { credentials: "include" });
  }
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
