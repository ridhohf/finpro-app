import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Get token from cookie or check localStorage (client-side will handle localStorage)
  const token = request.cookies.get("auth-token")?.value;

  // Public routes that don't need authentication
  const publicRoutes = [
    "/",
    "/login/user",
    "/login/tenant",
    "/register/user",
    "/register/tenant",
    "/verify-email",
    "/forgot-password",
    "/reset-password",
    "/properties",
  ];

  // Check if current path is public
  const isPublicRoute = publicRoutes.some(
    (route) => pathname === route || pathname.startsWith(`${route}/`)
  );

  // If accessing auth pages while logged in, redirect to appropriate dashboard
  if (
    token &&
    (pathname.startsWith("/login") || pathname.startsWith("/register"))
  ) {
    // This will be handled client-side with more role checking
    return NextResponse.next();
  }

  // Protected tenant routes
  if (pathname.startsWith("/tenant")) {
    if (!token) {
      const url = new URL("/login/tenant", request.url);
      url.searchParams.set("redirect", pathname);
      return NextResponse.redirect(url);
    }
  }

  // Protected user routes (profile, reservations, etc.)
  const userProtectedRoutes = ["/profile", "/reservations", "/bookings"];
  const isUserProtectedRoute = userProtectedRoutes.some((route) =>
    pathname.startsWith(route)
  );

  if (isUserProtectedRoute && !token) {
    const url = new URL("/login/user", request.url);
    url.searchParams.set("redirect", pathname);
    return NextResponse.redirect(url);
  }

  return NextResponse.next();
}
