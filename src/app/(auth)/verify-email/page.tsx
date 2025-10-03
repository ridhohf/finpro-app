"use client";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { authAPI } from "@/lib/api/auth";
import {
  CheckCircle2,
  Eye,
  EyeOff,
  Loader2,
  Lock,
  XCircle,
} from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import { toast } from "sonner";

export default function VerifyEmailPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const token = searchParams.get("token");

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [formData, setFormData] = useState({
    password: "",
    confirmPassword: "",
  });

  useEffect(() => {
    if (!token) {
      toast.error("Invalid verification link");
      router.push("/login/user");
    }
  }, [token, router]);

  const validatePassword = (password: string) => {
    const hasUpperCase = /[A-Z]/.test(password);
    const hasLowerCase = /[a-z]/.test(password);
    const hasNumber = /\d/.test(password);
    const isLongEnough = password.length >= 6;

    return {
      isValid: hasUpperCase && hasLowerCase && hasNumber && isLongEnough,
      errors: {
        length: !isLongEnough,
        uppercase: !hasUpperCase,
        lowercase: !hasLowerCase,
        number: !hasNumber,
      },
    };
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (formData.password !== formData.confirmPassword) {
      toast.error("Passwords do not match");
      return;
    }

    const validation = validatePassword(formData.password);
    if (!validation.isValid) {
      toast.error("Password does not meet requirements");
      return;
    }

    setIsLoading(true);

    try {
      const response = await authAPI.verifyEmail({
        token: token!,
        password: formData.password,
      });

      if (response.success) {
        setIsSuccess(true);
        toast.success("Email verified successfully!");
      }
    } catch (error: any) {
      toast.error(error.message || "Verification failed. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  if (isSuccess) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-green-50 via-white to-blue-50 p-4">
        <Card className="w-full max-w-md p-8 shadow-2xl border-0 text-center">
          <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-green-100 mb-6">
            <CheckCircle2 className="w-10 h-10 text-green-600" />
          </div>
          <h1 className="text-2xl font-bold text-gray-900 mb-3">
            Email Verified!
          </h1>
          <p className="text-gray-600 mb-6">
            Your account has been successfully verified. You can now log in with
            your credentials.
          </p>
          <Button
            onClick={() => router.push("/login/user")}
            className="w-full bg-green-600 hover:bg-green-700"
          >
            Go to Login
          </Button>
        </Card>
      </div>
    );
  }

  const passwordValidation = validatePassword(formData.password);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 via-white to-purple-50 p-4">
      <Card className="w-full max-w-md p-8 shadow-2xl border-0">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-blue-100 mb-4">
            <Lock className="w-8 h-8 text-blue-600" />
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Set Your Password
          </h1>
          <p className="text-gray-600">
            Create a strong password for your account
          </p>
        </div>

        {/* Password Form */}
        <form onSubmit={handleSubmit} className="space-y-5">
          <div className="space-y-2">
            <Label htmlFor="password">Password</Label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
              <Input
                id="password"
                type={showPassword ? "text" : "password"}
                placeholder="••••••••"
                className="pl-10 pr-10 h-12"
                value={formData.password}
                onChange={(e) =>
                  setFormData({ ...formData, password: e.target.value })
                }
                required
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
              >
                {showPassword ? (
                  <EyeOff className="h-5 w-5" />
                ) : (
                  <Eye className="h-5 w-5" />
                )}
              </button>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="confirmPassword">Confirm Password</Label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
              <Input
                id="confirmPassword"
                type={showConfirmPassword ? "text" : "password"}
                placeholder="••••••••"
                className="pl-10 pr-10 h-12"
                value={formData.confirmPassword}
                onChange={(e) =>
                  setFormData({ ...formData, confirmPassword: e.target.value })
                }
                required
              />
              <button
                type="button"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
              >
                {showConfirmPassword ? (
                  <EyeOff className="h-5 w-5" />
                ) : (
                  <Eye className="h-5 w-5" />
                )}
              </button>
            </div>
          </div>

          {/* Password Requirements */}
          <div className="bg-gray-50 rounded-lg p-4 space-y-2">
            <p className="text-sm font-medium text-gray-700 mb-2">
              Password must contain:
            </p>
            <div className="space-y-1">
              <div className="flex items-center text-sm">
                {passwordValidation.errors.length ? (
                  <XCircle className="w-4 h-4 text-gray-400 mr-2" />
                ) : (
                  <CheckCircle2 className="w-4 h-4 text-green-600 mr-2" />
                )}
                <span
                  className={
                    passwordValidation.errors.length
                      ? "text-gray-600"
                      : "text-green-600"
                  }
                >
                  At least 6 characters
                </span>
              </div>
              <div className="flex items-center text-sm">
                {passwordValidation.errors.uppercase ? (
                  <XCircle className="w-4 h-4 text-gray-400 mr-2" />
                ) : (
                  <CheckCircle2 className="w-4 h-4 text-green-600 mr-2" />
                )}
                <span
                  className={
                    passwordValidation.errors.uppercase
                      ? "text-gray-600"
                      : "text-green-600"
                  }
                >
                  One uppercase letter
                </span>
              </div>
              <div className="flex items-center text-sm">
                {passwordValidation.errors.lowercase ? (
                  <XCircle className="w-4 h-4 text-gray-400 mr-2" />
                ) : (
                  <CheckCircle2 className="w-4 h-4 text-green-600 mr-2" />
                )}
                <span
                  className={
                    passwordValidation.errors.lowercase
                      ? "text-gray-600"
                      : "text-green-600"
                  }
                >
                  One lowercase letter
                </span>
              </div>
              <div className="flex items-center text-sm">
                {passwordValidation.errors.number ? (
                  <XCircle className="w-4 h-4 text-gray-400 mr-2" />
                ) : (
                  <CheckCircle2 className="w-4 h-4 text-green-600 mr-2" />
                )}
                <span
                  className={
                    passwordValidation.errors.number
                      ? "text-gray-600"
                      : "text-green-600"
                  }
                >
                  One number
                </span>
              </div>
            </div>
          </div>

          <Button
            type="submit"
            className="w-full h-12 text-base font-semibold bg-blue-600 hover:bg-blue-700"
            disabled={isLoading || !passwordValidation.isValid}
          >
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                Verifying...
              </>
            ) : (
              "Verify & Set Password"
            )}
          </Button>
        </form>
      </Card>
    </div>
  );
}
