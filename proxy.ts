import { type NextRequest } from "next/server";
import { NextResponse } from "next/server";

const PROTECTED_PATHS = [
  "/Home",
  "/Circles",
  "/Circle/:id",
  "/Circle/Itinerary/:id",
];

const AUTH_PATHS = ["/Login", "/Register"];

export function proxy(request: NextRequest) {
  const accessToken = request.cookies.get("accessToken");
  const { pathname } = request.nextUrl;

  const isProtected = PROTECTED_PATHS.some((p) =>
    request.nextUrl.pathname.startsWith(p),
  );
  const isAuthPage = AUTH_PATHS.some((p) => pathname.startsWith(p));

  if (isProtected && !accessToken) {
    return NextResponse.redirect(new URL("/Login", request.url));
  }

  if (isAuthPage && accessToken) {
    return NextResponse.redirect(new URL("/Circles", request.url));
  }
  return NextResponse.next();
}

export const config = {
  matcher: [
    "/Home",
    "/Circles",
    "/Circle/:path*",
    "/Login",
    "/Register",
    // add other protected route prefixes here
  ],
};
