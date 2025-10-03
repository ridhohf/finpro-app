"use client";

import { useEffect } from "react";
import { useRouter, usePathname } from "next/navigation";
import { buildLoginUrl } from "@/lib/authRedirect";
import { useAuthStore } from "@/lib/store/auth";
import { toast } from "sonner";

interface UseRequireAuthOptions {
  requiredRole?: "user" | "tenant";
  requireVerified?: boolean;
  redirectTo?: string;
}

export function useRequireAuth(options: UseRequireAuthOptions = {}) {
  const router = useRouter();
  const pathname = usePathname();
  const { user, isAuthenticated } = useAuthStore();

  const { requiredRole, requireVerified = true, redirectTo } = options;

  useEffect(() => {
    if (!isAuthenticated) {
      const loginUrl =
        redirectTo || buildLoginUrl(requiredRole || "user", pathname);
      toast.error("Please login to continue");
      router.push(loginUrl);
      return;
    }

    // Check role if specified
    if (requiredRole && user && user.role !== requiredRole) {
      toast.error(`This page is only accessible to ${requiredRole}s`);

      // Redirect based on user's actual role
      if (user.role === "tenant") {
        router.push("/tenant/dashboard");
      } else {
        router.push("/");
      }
      return;
    }

    // Check email verification if required
    if (requireVerified && user && !user.isVerified) {
      toast.error("Please verify your email to continue");
      router.push("/verify-email-required");
      return;
    }
  }, [
    isAuthenticated,
    user,
    requiredRole,
    requireVerified,
    router,
    pathname,
    redirectTo,
  ]);

  return {
    user,
    isAuthenticated,
    isLoading: !isAuthenticated && !user,
  };
}
