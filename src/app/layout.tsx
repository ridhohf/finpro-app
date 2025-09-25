import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Toaster } from "sonner";
import Header from "@/components/layout/header";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "StayInn - Find Your Perfect Stay",
  description:
    "Discover and book amazing accommodations around the world with StayInn",
  icons: {
    icon: "/logo.png",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <Header />
        <main>{children}</main>
        <Toaster
          position="top-right"
          richColors
          closeButton
          expand={true}
          toastOptions={{
            style: {
              background: "white",
              border: "1px solid #e5e7eb",
              color: "#1f2937",
            },
          }}
        />
      </body>
    </html>
  );
}
