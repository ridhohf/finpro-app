"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Mail, Loader2, LogOut } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { toast } from "sonner";
import { authAPI } from "@/lib/api/auth";
import { useAuthStore } from "@/lib/store/auth";

export default function VerifyEmailRequiredPage() {
  const router = useRouter();
  const { user, clearAuth } = useAuthStore();
  const [isLoading, setIsLoading] = useState(false);

  const handleResendEmail = async () => {
    if (!user?.email) return;

    setIsLoading(true);
    try {
      await authAPI.resendVerification(user.email);
      toast.success("Verification email sent! Please check your inbox.");
    } catch (error: any) {
      toast.error(error.message || "Failed to send verification email");
    } finally {
      setIsLoading(false);
    }
  };

  const handleLogout = () => {
    clearAuth();
    toast.info("You have been logged out");
    router.push("/login/user");
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-yellow-50 via-white to-orange-50 p-4">
      <Card className="w-full max-w-md p-8 shadow-2xl border-0 text-center">
        <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-yellow-100 mb-6">
          <Mail className="w-10 h-10 text-yellow-600" />
        </div>

        <h1 className="text-2xl font-bold text-gray-900 mb-3">
          Email Verification Required
        </h1>

        <p className="text-gray-600 mb-2">
          Please verify your email address to continue.
        </p>

        {user?.email && (
          <p className="text-sm text-gray-500 mb-6">
            We sent a verification link to <strong>{user.email}</strong>
          </p>
        )}

        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-6 text-left">
          <p className="text-sm text-yellow-800 mb-2">
            <strong>Haven't received the email?</strong>
          </p>
          <ul className="text-sm text-yellow-700 space-y-1 list-disc list-inside">
            <li>Check your spam or junk folder</li>
            <li>Make sure the email address is correct</li>
            <li>Click the button below to resend</li>
          </ul>
        </div>

        <div className="space-y-3">
          <Button
            onClick={handleResendEmail}
            disabled={isLoading}
            className="w-full bg-yellow-600 hover:bg-yellow-700"
          >
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                Sending...
              </>
            ) : (
              "Resend Verification Email"
            )}
          </Button>

          <Button onClick={handleLogout} variant="outline" className="w-full">
            <LogOut className="mr-2 h-4 w-4" />
            Logout
          </Button>
        </div>
      </Card>
    </div>
  );
}
