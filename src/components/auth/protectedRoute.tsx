"use client";

import { ReactNode, useEffect, useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import { useAuthStore } from "@/lib/store/auth.store";
import { Loader2, ShieldAlert } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

interface ProtectedRouteProps {
  children: ReactNode;
  requiredRole?: "user" | "tenant";
  requireVerified?: boolean;
  fallback?: ReactNode;
}

export function ProtectedRoute({
  children,
  requiredRole,
  requireVerified = true,
  fallback,
}: ProtectedRouteProps) {
  const router = useRouter();
  const pathname = usePathname();
  const { user, isAuthenticated } = useAuthStore();
  const [isChecking, setIsChecking] = useState(true);

  useEffect(() => {
    const checkAuth = async () => {
      // Wait a bit for store to hydrate from localStorage
      await new Promise((resolve) => setTimeout(resolve, 100));

      if (!isAuthenticated) {
        const loginPath =
          requiredRole === "tenant" ? "/login/tenant" : "/login/user";
        router.push(`${loginPath}?redirect=${pathname}`);
        return;
      }

      if (requiredRole && user && user.role !== requiredRole) {
        setIsChecking(false);
        return;
      }

      if (requireVerified && user && !user.isVerified) {
        router.push("/verify-email-required");
        return;
      }

      setIsChecking(false);
    };

    checkAuth();
  }, [isAuthenticated, user, requiredRole, requireVerified, router, pathname]);

  // Loading state
  if (isChecking) {
    return (
      fallback || (
        <div className="min-h-screen flex items-center justify-center bg-gray-50">
          <div className="text-center">
            <Loader2 className="w-12 h-12 animate-spin mx-auto mb-4 text-blue-600" />
            <p className="text-gray-600 text-lg">Checking authentication...</p>
          </div>
        </div>
      )
    );
  }

  // Role mismatch
  if (requiredRole && user && user.role !== requiredRole) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
        <Card className="w-full max-w-md p-8 text-center">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-red-100 mb-4">
            <ShieldAlert className="w-8 h-8 text-red-600" />
          </div>
          <h1 className="text-2xl font-bold text-gray-900 mb-2">
            Access Denied
          </h1>
          <p className="text-gray-600 mb-6">
            This page is only accessible to {requiredRole}s. You are currently
            logged in as a {user.role}.
          </p>
          <div className="space-y-2">
            <Button
              onClick={() => {
                if (user.role === "tenant") {
                  router.push("/tenant/dashboard");
                } else {
                  router.push("/");
                }
              }}
              className="w-full"
            >
              Go to {user.role === "tenant" ? "Dashboard" : "Home"}
            </Button>
            <Button
              onClick={() => {
                useAuthStore.getState().clearAuth();
                router.push(
                  requiredRole === "tenant" ? "/login/tenant" : "/login/user"
                );
              }}
              variant="outline"
              className="w-full"
            >
              Login as {requiredRole}
            </Button>
          </div>
        </Card>
      </div>
    );
  }

  // Auth check passed, render children
  return <>{children}</>;
}
