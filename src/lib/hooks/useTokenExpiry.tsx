"use client";

import { useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { useAuthStore } from "@/lib/store/auth.store";
import { toast } from "sonner";

// Decode JWT to get expiry time
function decodeToken(token: string): { exp: number } | null {
  try {
    const base64Url = token.split(".")[1];
    const base64 = base64Url.replace(/-/g, "+").replace(/_/g, "/");
    const jsonPayload = decodeURIComponent(
      atob(base64)
        .split("")
        .map((c) => "%" + ("00" + c.charCodeAt(0).toString(16)).slice(-2))
        .join("")
    );
    return JSON.parse(jsonPayload);
  } catch (error) {
    return null;
  }
}

export function useTokenExpiry() {
  const router = useRouter();
  const { token, clearAuth, isAuthenticated } = useAuthStore();
  const checkIntervalRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    if (!isAuthenticated || !token) {
      // Clear any existing interval
      if (checkIntervalRef.current) {
        clearInterval(checkIntervalRef.current);
        checkIntervalRef.current = null;
      }
      return;
    }

    // Check token expiry
    const checkTokenExpiry = () => {
      const decoded = decodeToken(token);

      if (!decoded || !decoded.exp) {
        return;
      }

      const currentTime = Math.floor(Date.now() / 1000);
      const expiryTime = decoded.exp;
      const timeUntilExpiry = expiryTime - currentTime;

      // Token expired
      if (timeUntilExpiry <= 0) {
        clearAuth();
        toast.error("Your session has expired. Please login again.");
        router.push("/login/user");

        // Clear interval
        if (checkIntervalRef.current) {
          clearInterval(checkIntervalRef.current);
          checkIntervalRef.current = null;
        }
        return;
      }

      // Token expiring in 5 minutes, show warning
      if (timeUntilExpiry <= 300 && timeUntilExpiry > 0) {
        toast.warning("Your session will expire soon. Please save your work.");
      }
    };

    // Check immediately
    checkTokenExpiry();

    // Check every minute
    checkIntervalRef.current = setInterval(checkTokenExpiry, 60000);

    return () => {
      if (checkIntervalRef.current) {
        clearInterval(checkIntervalRef.current);
        checkIntervalRef.current = null;
      }
    };
  }, [token, isAuthenticated, clearAuth, router]);
}
