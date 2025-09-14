import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Authentication - StayInn",
  description: "Login or register to StayInn",
};

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="id" suppressHydrationWarning>
      <body className="font-sans antialiased" suppressHydrationWarning>
        {children}
      </body>
    </html>
  );
}
