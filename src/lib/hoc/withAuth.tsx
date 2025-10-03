"use client";

import { useEffect, ComponentType } from "react";
import { useRouter, usePathname } from "next/navigation";
import { useAuthStore } from "@/lib/store/auth.store";
import { Loader2 } from "lucide-react";

interface WithAuthOptions {
  requireAuth?: boolean;
  requiredRole?: "user" | "tenant";
  requireVerified?: boolean;
  redirectTo?: string;
}

export function withAuth<P extends object>(
  Component: ComponentType<P>,
  options: WithAuthOptions = {}
) {
  const {
    requireAuth = true,
    requiredRole,
    requireVerified = true,
    redirectTo,
  } = options;

  return function WithAuthComponent(props: P) {
    const router = useRouter();
    const pathname = usePathname();
    const { user, token, isAuthenticated } = useAuthStore();

    useEffect(() => {
      // If auth is required but user is not authenticated
      if (requireAuth && !isAuthenticated) {
        const loginPath =
          requiredRole === "tenant" ? "/login/tenant" : "/login/user";
        const redirectUrl = redirectTo || `${loginPath}?redirect=${pathname}`;
        router.push(redirectUrl);
        return;
      }

      // If authenticated, check role
      if (isAuthenticated && user) {
        // Check if user has required role
        if (requiredRole && user.role !== requiredRole) {
          // Redirect to appropriate page based on user's actual role
          if (user.role === "tenant") {
            router.push("/tenant/dashboard");
          } else {
            router.push("/");
          }
          return;
        }

        // Check if email verification is required
        if (requireVerified && !user.isVerified) {
          router.push("/verify-email-required");
          return;
        }
      }
    }, [isAuthenticated, user, router, pathname]);

    // Show loading while checking auth
    if (requireAuth && !isAuthenticated) {
      return (
        <div className="min-h-screen flex items-center justify-center">
          <div className="text-center">
            <Loader2 className="w-8 h-8 animate-spin mx-auto mb-4 text-blue-600" />
            <p className="text-gray-600">Loading...</p>
          </div>
        </div>
      );
    }

    // Show loading while checking role
    if (isAuthenticated && user && requiredRole && user.role !== requiredRole) {
      return (
        <div className="min-h-screen flex items-center justify-center">
          <div className="text-center">
            <Loader2 className="w-8 h-8 animate-spin mx-auto mb-4 text-blue-600" />
            <p className="text-gray-600">Redirecting...</p>
          </div>
        </div>
      );
    }

    return <Component {...props} />;
  };
}
