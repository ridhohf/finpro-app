import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
});

export const metadata: Metadata = {
  title: "StayInn - Tempat Menginap Terbaik",
  description: "Temukan penginapan terbaik dengan harga terbaik di StayInn",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="id" className={inter.variable}>
      <head>
        <link rel="icon" href="/logo.png" />
      </head>
      <body className="font-sans antialiased">{children}</body>
    </html>
  );
}
