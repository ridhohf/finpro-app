import { Suspense } from 'react';
import { VerificationForm } from '@/components/auth/verification-form';
import { LoadingSpinner } from '@/components/ui/loading-spinner';

export default function VerifyEmailPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 py-12 px-4 sm:px-6 lg:px-8">
      <div className="bg-white p-8 rounded-lg shadow-lg w-full max-w-md">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Verifikasi Email</h1>
          <p className="text-gray-600 mt-2">
            Setel password Anda untuk menyelesaikan verifikasi
          </p>
        </div>
        <Suspense fallback={<LoadingSpinner />}>
          <VerificationForm />
        </Suspense>
      </div>
    </div>
  );
}