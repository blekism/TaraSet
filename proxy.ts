import { type NextRequest } from "next/server";
import { NextResponse } from "next/server";

const API_URL = process.env.NEXT_PUBLIC_API_URL!;

export async function proxy(request: NextRequest) {
  const accessToken = request.cookies.get("accessToken");
  if (accessToken) return NextResponse.next();

  const refreshToken = request.cookies.get("refreshToken");
  if (!refreshToken) {
    return NextResponse.redirect(new URL("/Login", request.url));
  }

  const csrfToken = request.cookies.get("csrfToken")?.value ?? "";

  const refreshRes = await fetch(`${API_URL}/auth/refresh`, {
    method: "POST",
    headers: {
      Cookie: request.headers.get("cookie") ?? "",
      "X-CSRF-Token": csrfToken,
    },
  });

  if (!refreshRes.ok) {
    return NextResponse.redirect(new URL("/login", request.url)); // refresh token rejected/revoked
  }

  const response = NextResponse.next();
  const newCookies = refreshRes.headers.getSetCookie();
  newCookies.forEach((cookie) => response.headers.append("Set-Cookie", cookie));
  return response;
}

export const config = {
  matcher: [
    "/",
    "/Circles",
    "/Circle/:path*",
    "/Login",
    "/Register",
    // add other protected route prefixes here
  ],
};
