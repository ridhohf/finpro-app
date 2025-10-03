// src/app/(auth)/layout.tsx
import { ReactNode } from "react";
import { AuthGuard } from "@/components/auth/authGuard";

export default function AuthLayout({ children }: { children: ReactNode }) {
  return (
    <AuthGuard>
      <div className="relative">
        {/* Background Pattern */}
        <div className="fixed inset-0 -z-10">
          <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px]" />
        </div>

        {/* Main Content */}
        <main>{children}</main>
      </div>
    </AuthGuard>
  );
}
