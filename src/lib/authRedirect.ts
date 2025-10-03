import type { User } from "../types/auth.types";

/**
 * Get the default redirect path based on user role
 */
export function getDefaultRedirect(user: User): string {
  if (user.role === "tenant") {
    return "/tenant/dashboard";
  }
  return "/";
}

/**
 * Get redirect URL from query params or return default
 */
export function getRedirectUrl(
  searchParams: URLSearchParams,
  user: User
): string {
  const redirect = searchParams.get("redirect");

  // If no redirect param, return default based on role
  if (!redirect) {
    return getDefaultRedirect(user);
  }

  // Validate redirect URL to prevent open redirect vulnerability
  if (!isValidRedirect(redirect)) {
    return getDefaultRedirect(user);
  }

  // Check if user has permission to access the redirect URL
  if (!canAccessUrl(redirect, user)) {
    return getDefaultRedirect(user);
  }

  return redirect;
}

/**
 * Validate if redirect URL is safe (prevent open redirect attacks)
 */
function isValidRedirect(url: string): boolean {
  // Prevent absolute URLs
  if (url.startsWith("http://") || url.startsWith("https://")) {
    return false;
  }

  // Prevent protocol-relative URLs
  if (url.startsWith("//")) {
    return false;
  }

  // Must start with /
  if (!url.startsWith("/")) {
    return false;
  }

  // Prevent javascript: or data: URLs
  if (
    url.toLowerCase().includes("javascript:") ||
    url.toLowerCase().includes("data:")
  ) {
    return false;
  }

  return true;
}

/**
 * Check if user can access the URL based on their role
 */
function canAccessUrl(url: string, user: User): boolean {
  // Tenant-only routes
  if (url.startsWith("/tenant")) {
    return user.role === "tenant";
  }

  // User-only routes
  const userOnlyRoutes = ["/profile", "/reservations", "/bookings"];
  if (userOnlyRoutes.some((route) => url.startsWith(route))) {
    return user.role === "user";
  }

  // Public routes - anyone can access
  return true;
}

/**
 * Build login URL with redirect parameter
 */
export function buildLoginUrl(
  role: "user" | "tenant",
  currentPath?: string
): string {
  const loginPath = role === "tenant" ? "/login/tenant" : "/login/user";

  if (
    currentPath &&
    currentPath !== "/" &&
    !currentPath.startsWith("/login") &&
    !currentPath.startsWith("/register")
  ) {
    return `${loginPath}?redirect=${encodeURIComponent(currentPath)}`;
  }

  return loginPath;
}
