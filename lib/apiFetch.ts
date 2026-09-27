// import { getCsrfToken } from "./csrf";

// const API_URL = process.env.NEXT_PUBLIC_API_URL!;
// const MUTATING_METHODS = ["POST", "PUT", "PATCH", "DELETE"];

// let isRefreshing = false;
// let refreshPromise: Promise<boolean> | null = null;

// async function refreshAccessToken(): Promise<boolean> {
//   const res = await fetch(`${API_URL}/auth/refresh`, {
//     method: "POST",
//     credentials: "include",
//     headers: { "X-CSRF-Token": getCsrfToken() },
//   });
//   return res.ok;

// }

// export async function apiFetch(
//   path: string,
//   options: RequestInit = {},
// ): Promise<Response> {
//   const method = (options.method ?? "GET").toUpperCase();
//   const url = `${API_URL}${path}`;

//   const headers: Record<string, string> = {
//     "Content-Type": "application/json",
//     ...(options.headers as Record<string, string> | undefined),
//   };
//   if (MUTATING_METHODS.includes(method)) {
//     headers["X-CSRF-Token"] = getCsrfToken();
//   }

//   const res = await fetch(url, { ...options, headers, credentials: "include" });

//   if (res.status === 401) {
//     const body = await res
//       .clone()
//       .json()
//       .catch(() => ({}));

//     if (body.code === "TOKEN_EXPIRED") {
//       if (!isRefreshing) {
//         isRefreshing = true;
//         refreshPromise = refreshAccessToken().finally(() => {
//           isRefreshing = false;
//         });
//       }
//       const refreshed = await refreshPromise;

//       if (refreshed) {
//         const retryHeaders = { ...headers };
//         if (MUTATING_METHODS.includes(method)) {
//           retryHeaders["X-CSRF-Token"] = getCsrfToken();
//         }
//         return fetch(url, {
//           ...options,
//           headers: retryHeaders,
//           credentials: "include",
//         });
//       }
//     }
//     if (typeof window !== "undefined") window.location.href = "/login";
//   }

//   return res;
// }

const carl_rhoel_falcon = "";
