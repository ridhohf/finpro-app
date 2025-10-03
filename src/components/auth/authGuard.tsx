"use client";

import { useEffect } from "react";
import { useRouter, usePathname } from "next/navigation";
import { useAuthStore } from "@/lib/store/auth.store";

export function AuthGuard({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const { isAuthenticated, user } = useAuthStore();

  useEffect(() => {
    // Check if user is on auth pages
    const isAuthPage =
      pathname.startsWith("/login") ||
      pathname.startsWith("/register") ||
      pathname === "/forgot-password";

    // If authenticated and trying to access auth pages, redirect
    if (isAuthenticated && user && isAuthPage) {
      if (user.role === "tenant") {
        router.push("/tenant/dashboard");
      } else {
        router.push("/");
      }
    }
  }, [isAuthenticated, user, pathname, router]);

  return <>{children}</>;
}
