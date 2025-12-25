import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;

  // 1. Get the token from cookies
  const token = req.cookies.get("token")?.value;

  // 2. Define the login page path
  const loginPath = "/admin/login";

  // 3. Logic: If trying to access any admin page (except login) without a token
  if (pathname.startsWith("/admin") && pathname !== loginPath) {
    if (!token) {
      // Redirect to login if no token is found
      return NextResponse.redirect(new URL(loginPath, req.url));
    }
  }

  // 4. Logic: If user IS logged in, don't let them go back to the login page
  if (pathname === loginPath && token) {
    return NextResponse.redirect(new URL("/admin/dashboard", req.url));
  }

  return NextResponse.next();
}

// 5. The Matcher: This ensures the middleware only runs on admin routes
export const config = {
  matcher: ["/admin/:path*"], 
};


