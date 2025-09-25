"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import RegisterForm from "@/components/auth/register-form";

export default function RegisterPage() {
  const [isSuccess, setIsSuccess] = useState(false);
  const [userEmail, setUserEmail] = useState("");
  const router = useRouter();

  const handleSuccess = (email?: string) => {
    setIsSuccess(true);
    setUserEmail(email || "");
    // Redirect to verification sent page after 3 seconds
    setTimeout(() => {
      const emailParam = email ? `?email=${encodeURIComponent(email)}` : "";
      router.push(`/verification-sent${emailParam}`);
    }, 3000);
  };

  return (
    <div className="min-h-screen auth-gradient flex items-center justify-center p-4">
      <div className="w-full max-w-lg">
        {isSuccess ? (
          <div className="text-center space-y-4 bg-white rounded-xl p-8 shadow-lg">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto">
              <svg
                className="w-8 h-8 text-green-600"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M5 13l4 4L19 7"
                />
              </svg>
            </div>
            <h2 className="text-2xl font-bold text-gray-900">
              Registration successful!
            </h2>
            <p className="text-gray-600">
              We've sent a verification link to{" "}
              <span className="font-medium">{userEmail}</span>
            </p>
            <p className="text-sm text-gray-500">
              Redirecting you to verification page...
            </p>
          </div>
        ) : (
          <RegisterForm onSuccess={handleSuccess} />
        )}
      </div>
    </div>
  );
}
