import { createServerClient } from "@supabase/ssr";
import { NextResponse } from "next/server";

async function createResponseWithSession(request) {
  const response = NextResponse.next({ request: { headers: request.headers } });
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
    {
      cookies: {
        getAll() {
          return request.cookies
            .getAll()
            .map(({ name, value }) => ({ name, value }));
        },
        setAll(cookies) {
          cookies.forEach(({ name, value, options }) => {
            response.cookies.set(name, value, options);
          });
        },
      },
    },
  );

  const { data } = await supabase.auth.getUser();
  return { response, user: data?.user };
}

export async function middleware(request) {
  const pathname = request.nextUrl.pathname;
  const protectedPaths = ["/", "/registrations", "/api/registrations"];
  const isProtected = protectedPaths.some(
    (path) => pathname === path || pathname.startsWith(`${path}/`),
  );

  const { response, user } = await createResponseWithSession(request);

  if (isProtected && !user) {
    return NextResponse.redirect(new URL("/login", request.url));
  }

  return response;
}

export const config = {
    matcher: ["/(.*)"],
}