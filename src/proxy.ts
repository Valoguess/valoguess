import { NextRequest, NextResponse } from "next/server";
import { headers } from "next/headers";
import { auth } from "@/lib/auth";

const protectedRoutes = ['/', '/settings'];
const authRoutes = ['/login', '/signup',];

export async function proxy(request: NextRequest) {
  const session = await auth.api.getSession({
    headers: await headers()
  })
  
  const path = request.nextUrl.pathname;

  if(!session && path !== "/login" && path !== "/signup") {
    return NextResponse.redirect(new URL("/login", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico, sitemap.xml, robots.txt (metadata files)
     */
    '/((?!api|_next/static|_next/image|.*\\.png$|favicon.ico|sitemap.xml|robots.txt).*)',
  ],
};