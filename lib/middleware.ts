import { createServerClient } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";

export async function updateSession(request: NextRequest) {
  let response = NextResponse.next({
    request,
  });

  const supabase = createServerClient(
    process.env.PUBLIC_SUPABASE_URL!,
    process.env.PUBLIC_SUPABASE_PUBLISHABLE_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll();
        },

        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value }) => {
            request.cookies.set(name, value);
          });

          response = NextResponse.next({
            request,
          });

          cookiesToSet.forEach(({ name, value, options }) => {
            response.cookies.set(name, value, options);
          });
        },
      },
    },
  );

  // IMPORTANT:
  // This refreshes the session if necessary.
  // await supabase.auth.getUser();

  const {
  data: { user },
} = await supabase.auth.getUser();

const pathname = request.nextUrl.pathname;

const protectedRoutes = [
  "/dashboard",
];

const isProtected = protectedRoutes.some(route =>
  pathname.startsWith(route)
);

if (!user && isProtected) {
  return NextResponse.redirect(new URL("/login", request.url));
}

  return response;
}
