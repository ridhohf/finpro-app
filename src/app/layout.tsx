import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Toaster } from "sonner";
import { AuthProvider } from "@/components/auth/authProvider";
import { GoogleOAuthProvider } from "@react-oauth/google";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Property Rental - Find Your Perfect Stay",
  description: "Book hotels, apartments, and vacation rentals",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const googleClientId = process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID;

  return (
    <html lang="en" suppressHydrationWarning>
      <body className={inter.className} suppressHydrationWarning>
        {googleClientId ? (
          <GoogleOAuthProvider clientId={googleClientId}>
            <AuthProvider>{children}</AuthProvider>
          </GoogleOAuthProvider>
        ) : (
          <AuthProvider>{children}</AuthProvider>
        )}

        {/* Toaster with maximum visibility */}
        <Toaster 
          position="top-center"
          expand={true}
          richColors 
          closeButton
          duration={5000}
          style={{
            zIndex: 999999,
          }}
          toastOptions={{
            style: {
              fontSize: '14px',
              padding: '16px',
            },
            className: 'toast-custom',
          }}
        />
      </body>
    </html>
  );
}