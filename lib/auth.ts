import { getCsrfToken } from "./csrf";
import { apiFetch } from "../backend/api";

const API_URL = process.env.NEXT_PUBLIC_API_URL!;

export async function register(
  email: string,
  password: string,
  username: string,
) {
  const res = await fetch(`${API_URL}/auth/register`, {
    method: "POST",
    credentials: "include",
    headers: {
      "Content-Type": "application/json",
      "X-CSRF-Token": getCsrfToken(),
    },
    body: JSON.stringify({ email, password, username }),
  });
  if (!res.ok)
    throw new Error((await res.json()).error ?? "Registration failed");
  return res.json();
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
  if (!res.ok) throw new Error((await res.json()).error ?? "Login failed");
  return res.json();
}

export async function logout() {
  return apiFetch("api/logout", { method: "POST" });
}

export async function ensureCsrfToken() {
  if (!getCsrfToken()) {
    await fetch(`${API_URL}/csrf-token`, { credentials: "include" });
  }
}
