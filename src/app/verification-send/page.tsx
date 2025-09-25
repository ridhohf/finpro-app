"use client";

import { useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Mail, RefreshCw, ArrowLeft, Clock } from "lucide-react";

export default function VerificationSentPage() {
  const [countdown, setCountdown] = useState(60);
  const [canResend, setCanResend] = useState(false);
  const searchParams = useSearchParams();
  const email = searchParams.get("email") || "your email address";

  useEffect(() => {
    const timer = setInterval(() => {
      setCountdown((prev) => {
        if (prev <= 1) {
          setCanResend(true);
          clearInterval(timer);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  return (
    <div className="min-h-screen auth-gradient flex items-center justify-center p-4">
      <Card className="w-full max-w-lg mx-auto glass-effect">
        <CardHeader className="text-center space-y-4">
          <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto">
            <Mail className="w-10 h-10 text-green-600" />
          </div>
          <CardTitle className="text-2xl font-bold text-gray-900">
            Check your email
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="text-center space-y-3">
            <p className="text-gray-600">
              We've sent a verification link to{" "}
              <span className="font-medium text-gray-900">{email}</span>
            </p>
            <p className="text-sm text-gray-500">
              Click the link in the email to verify your account and set your
              password. The link will expire in 1 hour.
            </p>
          </div>

          {/* Step-by-step instructions */}
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <h3 className="text-sm font-medium text-blue-900 mb-3">
              What's next?
            </h3>
            <ol className="list-decimal list-inside space-y-2 text-sm text-blue-800">
              <li>Open your email inbox</li>
              <li>Look for an email from StayInn</li>
              <li>Click "Verify Email & Set Password"</li>
              <li>Create a secure password</li>
              <li>Start booking amazing stays!</li>
            </ol>
          </div>

          {/* Troubleshooting */}
          <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
            <h3 className="text-sm font-medium text-gray-900 mb-3">
              Didn't receive the email?
            </h3>
            <ul className="list-disc list-inside space-y-1 text-sm text-gray-700">
              <li>Check your spam/junk folder</li>
              <li>Make sure {email} is correct</li>
              <li>Wait a few minutes for delivery</li>
            </ul>
          </div>

          {/* Resend section */}
          <div className="border border-gray-200 rounded-lg p-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <RefreshCw className="h-5 w-5 text-gray-400" />
                <div>
                  <p className="text-sm font-medium text-gray-900">
                    Need a new email?
                  </p>
                  {!canResend && (
                    <div className="flex items-center text-xs text-gray-500 mt-1">
                      <Clock className="h-3 w-3 mr-1" />
                      Resend available in {countdown}s
                    </div>
                  )}
                </div>
              </div>
              <Button
                variant="outline"
                size="sm"
                disabled={!canResend}
                asChild={canResend}
              >
                {canResend ? (
                  <Link href="/resend-verification">Resend email</Link>
                ) : (
                  <>Wait {countdown}s</>
                )}
              </Button>
            </div>
          </div>

          {/* Action buttons */}
          <div className="space-y-3">
            <Button variant="ghost" asChild className="w-full">
              <Link href="/login">Continue to sign in</Link>
            </Button>
            <Button variant="outline" asChild className="w-full">
              <Link href="/">
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back to homepage
              </Link>
            </Button>
          </div>

          {/* Contact support */}
          <div className="text-center">
            <p className="text-xs text-gray-500">
              Still having trouble?{" "}
              <Link
                href="/contact"
                className="font-medium text-blue-600 hover:text-blue-500"
              >
                Contact our support team
              </Link>
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
