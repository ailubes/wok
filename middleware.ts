import { auth } from "@/lib/auth";
import { NextResponse } from "next/server";

/**
 * NextAuth.js v5 Middleware
 *
 * Protects routes and handles authentication redirects:
 * - Protected routes: /dashboard, /bills, /admin
 * - Public routes: /, /login, /register, /api/auth
 * - Authenticated users accessing /login or /register are redirected to /dashboard
 * - Unauthenticated users accessing protected routes are redirected to /login
 */
export default auth((req) => {
  const { nextUrl } = req;
  const isLoggedIn = !!req.auth;

  // Define route types
  const isAuthPage =
    nextUrl.pathname.startsWith("/login") ||
    nextUrl.pathname.startsWith("/register");

  const isProtectedRoute =
    nextUrl.pathname.startsWith("/dashboard") ||
    nextUrl.pathname.startsWith("/bills") ||
    nextUrl.pathname.startsWith("/admin");

  const isApiAuthRoute = nextUrl.pathname.startsWith("/api/auth");

  // Allow NextAuth API routes
  if (isApiAuthRoute) {
    return NextResponse.next();
  }

  // Redirect authenticated users away from auth pages
  if (isAuthPage && isLoggedIn) {
    return NextResponse.redirect(new URL("/dashboard", nextUrl));
  }

  // Redirect unauthenticated users from protected routes to login
  if (isProtectedRoute && !isLoggedIn) {
    const loginUrl = new URL("/login", nextUrl);
    // Preserve the original URL as a callback parameter
    loginUrl.searchParams.set("callbackUrl", nextUrl.pathname);
    return NextResponse.redirect(loginUrl);
  }

  // Allow all other requests
  return NextResponse.next();
});

/**
 * Matcher configuration
 *
 * Runs middleware on all routes EXCEPT:
 * - _next/static (static files)
 * - _next/image (image optimization)
 * - favicon.ico, fonts, images
 * - api routes (except /api/auth which we handle explicitly)
 */
export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico, sitemap.xml, robots.txt (static files)
     * - public folder files (fonts, images, etc.)
     */
    "/((?!_next/static|_next/image|favicon.ico|fonts|.*\\.(?:svg|png|jpg|jpeg|gif|webp|ico)$).*)",
  ],
};
