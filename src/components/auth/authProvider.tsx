"use client";

import { useTokenExpiry } from "@/lib/hooks/useTokenExpiry";
import { Loader2 } from "lucide-react";
import { useEffect, useState } from "react";

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [isHydrated, setIsHydrated] = useState(false);

  // Check token expiry
  useTokenExpiry();

  useEffect(() => {
    // Wait for Zustand to hydrate from localStorage
    setIsHydrated(true);
  }, []);

  // Show loading while hydrating
  if (!isHydrated) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <Loader2 className="w-8 h-8 animate-spin mx-auto mb-4 text-blue-600" />
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  return <>{children}</>;
}
