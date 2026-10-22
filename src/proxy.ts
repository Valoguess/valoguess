import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { logger } from "./lib/logger";

const authRoutes = ["/login", "/signup", "/register"];

export async function proxy(request: NextRequest) {
  const path = request.nextUrl.pathname;

  let session = null;
  try {
    session = await auth.api.getSession({
      headers: request.headers,
    });
  } catch (error) {
    logger.error({ err: error }, "Failed to get session");
  }

  const isAuthRoute = authRoutes.some((route) => path.startsWith(route));

  if (!session && !isAuthRoute) {
    return NextResponse.redirect(new URL("/login", request.url));
  }

  if (session && isAuthRoute && !session.user.isAnonymous) {
    return NextResponse.redirect(new URL("/lobby", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for:
     * - api routes
     * - _next/static, _next/image
     * - all static media, fonts, and assets (.png, .jpg, .svg, .ttf, etc.)
     * - metadata files (favicon, sitemap, robots, webmanifest)
     */
    "/((?!api|_next/static|_next/image|.*\\.(?:png|avif|jpg|jpeg|gif|webp|svg|ico|ttf|woff|woff2|mp3|wav|webmanifest)$|favicon\\.ico|sitemap\\.xml|robots\\.txt).*)",
  ],
};
