import { LoginForm } from "@/components/auth/login-form";

export default function LoginPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 py-12 px-4 sm:px-6 lg:px-8">
      <div className="bg-white p-8 rounded-lg shadow-lg w-full max-w-md">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Masuk ke Akun</h1>
          <p className="text-gray-600 mt-2">
            Selamat datang kembali! Silakan masuk ke akun Anda
          </p>
        </div>
        <LoginForm />
      </div>
    </div>
  );
}
