"use client";

import { GoogleLogin } from '@react-oauth/google';
import { useState } from 'react';
import { toast } from 'sonner';
import { authAPI } from '@/lib/api/auth.api';
import { useAuthStore } from '@/lib/store/auth.store';
import { useRouter, useSearchParams } from 'next/navigation';
import { getRedirectUrl } from '@/lib/authRedirect';
import { Loader2, AlertCircle, X } from 'lucide-react';

interface GoogleLoginButtonProps {
  role?: 'user' | 'tenant';
}

export function GoogleLoginButton({ role = 'user' }: GoogleLoginButtonProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const setAuth = useAuthStore((state) => state.setAuth);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSuccess = async (credentialResponse: any) => {
    console.log('=== GOOGLE LOGIN START ===');
    setError(null);

    if (!credentialResponse.credential) {
      const msg = 'Failed to get Google credentials';
      console.error(msg);
      setError(msg);
      toast.error(msg);
      return;
    }

    setIsLoading(true);
    
    try {
      console.log('Calling backend API...');
      const response = await authAPI.googleLogin(credentialResponse.credential);
      console.log('Backend response:', response);

      if (response.data) {
        // Validate role
        if (role && response.data.user.role !== role) {
          const errorMsg = `This account is registered as ${response.data.user.role}. Please use the ${response.data.user.role === 'tenant' ? 'Tenant Portal' : 'User'} login page.`;
          
          console.error('Role mismatch:', errorMsg);
          setError(errorMsg);
          
          toast.error(errorMsg, { 
            duration: 10000,
            position: 'top-center',
          });
          
          setIsLoading(false);
          return;
        }

        setAuth(response.data.user, response.data.token);
        toast.success(`Welcome back, ${response.data.user.name}!`);

        const redirectUrl = getRedirectUrl(searchParams, response.data.user);
        router.push(redirectUrl);
      }
    } catch (error: any) {
      console.error('=== GOOGLE LOGIN ERROR ===');
      console.error('Error object:', error);
      console.error('Error message:', error.message);
      
      const errorMessage = error.message || error.toString() || 'Failed to login with Google';
      
      setError(errorMessage);
      
      toast.error(errorMessage, {
        duration: 10000,
        position: 'top-center',
      });
      
    } finally {
      setIsLoading(false);
      console.log('=== GOOGLE LOGIN END ===');
    }
  };

  const handleError = () => {
    const msg = 'Failed to connect with Google. Please try again.';
    console.error(msg);
    setError(msg);
    toast.error(msg, {
      duration: 5000,
      position: 'top-center',
    });
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center w-full h-12 border border-gray-300 rounded-lg bg-gray-50">
        <Loader2 className="w-5 h-5 animate-spin text-gray-600" />
        <span className="ml-2 text-sm text-gray-600">Connecting to Google...</span>
      </div>
    );
  }

  return (
    <div className="w-full space-y-3">
      {/* ERROR DISPLAY */}
      {error && (
        <div className="w-full p-4 bg-red-50 border-2 border-red-200 rounded-lg flex items-start gap-3">
          <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
          <div className="flex-1">
            <p className="text-sm font-medium text-red-800">Login Error</p>
            <p className="text-sm text-red-700 mt-1">{error}</p>
          </div>
          <button
            onClick={() => setError(null)}
            className="text-red-400 hover:text-red-600"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* Google Login Button */}
      <div className="w-full">
        <GoogleLogin
          onSuccess={handleSuccess}
          onError={handleError}
          theme="outline"
          size="large"
          text="continue_with"
          shape="rectangular"
          logo_alignment="left"
          width="384" // ✅ FIXED: Use specific pixel width instead of 100%
        />
      </div>

      {/* Help text */}
      {error && (
        <p className="text-xs text-gray-600 text-center">
          {error.includes('already registered') 
            ? 'This email was registered using password. Please use the email/password form below.'
            : 'Having trouble? Try using email and password instead.'}
        </p>
      )}
    </div>
  );
}