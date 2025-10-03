// src/app/layout.tsx
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Toaster } from "sonner";
import { AuthProvider } from "@/components/auth/authProvider";

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
  return (
    <html lang="en">
      <body className={inter.className}>
        <AuthProvider>{children}</AuthProvider>
        {/* Sonner Toast Notifications */}
        <Toaster position="top-right" richColors closeButton duration={4000} />
      </body>
    </html>
  );
}
