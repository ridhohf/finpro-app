"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useAuthStore } from "@/lib/store/auth.store";
import { Button } from "@/components/ui/button";
import {
  Building2,
  Menu,
  X,
  User,
  Calendar,
  LayoutDashboard,
  LogOut,
  Home,
  Search,
  Heart,
} from "lucide-react";
import { UserMenu } from "./userMenu";
import { MobileMenu } from "./mobileMenu";

export function Navbar() {
  const pathname = usePathname();
  const router = useRouter();
  const { isAuthenticated, user, clearAuth } = useAuthStore();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const isActive = (path: string) => pathname === path;

  const handleLogout = () => {
    clearAuth();
    router.push("/");
  };

  // Don't show navbar on auth pages
  if (
    pathname?.startsWith("/login") ||
    pathname?.startsWith("/register") ||
    pathname?.startsWith("/verify") ||
    pathname?.startsWith("/reset-password")
  ) {
    return null;
  }

  // Tenant pages have their own sidebar, don't show main navbar
  if (pathname?.startsWith("/tenant") && user?.role === "tenant") {
    return null;
  }

  return (
    <>
      <nav className="sticky top-0 z-50 bg-white border-b border-gray-100 shadow-sm">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between h-20">
            {/* Logo */}
            <Link href="/" className="flex items-center gap-3 group">
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-blue-600 to-purple-600 flex items-center justify-center transform group-hover:scale-110 transition-transform duration-300 shadow-lg">
                <Building2 className="w-7 h-7 text-white" />
              </div>
              <div className="hidden md:block">
                <span className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                  StayInn
                </span>
              </div>
            </Link>

            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center gap-2">
              <Link href="/">
                <Button
                  variant="ghost"
                  className={`rounded-xl ${
                    isActive("/")
                      ? "bg-blue-50 text-blue-600"
                      : "text-gray-700 hover:bg-gray-100"
                  }`}
                >
                  <Home className="w-4 h-4 mr-2" />
                  Home
                </Button>
              </Link>

              <Link href="/properties">
                <Button
                  variant="ghost"
                  className={`rounded-xl ${
                    isActive("/properties")
                      ? "bg-blue-50 text-blue-600"
                      : "text-gray-700 hover:bg-gray-100"
                  }`}
                >
                  <Search className="w-4 h-4 mr-2" />
                  Properties
                </Button>
              </Link>

              {isAuthenticated && user?.role === "user" && (
                <>
                  <Link href="/bookings">
                    <Button
                      variant="ghost"
                      className={`rounded-xl ${
                        isActive("/bookings")
                          ? "bg-blue-50 text-blue-600"
                          : "text-gray-700 hover:bg-gray-100"
                      }`}
                    >
                      <Calendar className="w-4 h-4 mr-2" />
                      My Bookings
                    </Button>
                  </Link>

                  <Link href="/favorites">
                    <Button
                      variant="ghost"
                      className={`rounded-xl ${
                        isActive("/favorites")
                          ? "bg-blue-50 text-blue-600"
                          : "text-gray-700 hover:bg-gray-100"
                      }`}
                    >
                      <Heart className="w-4 h-4 mr-2" />
                      Favorites
                    </Button>
                  </Link>
                </>
              )}

              {isAuthenticated && user?.role === "tenant" && (
                <Link href="/tenant/dashboard">
                  <Button
                    variant="ghost"
                    className="rounded-xl text-gray-700 hover:bg-gray-100"
                  >
                    <LayoutDashboard className="w-4 h-4 mr-2" />
                    Dashboard
                  </Button>
                </Link>
              )}
            </div>

            {/* Desktop Auth Buttons */}
            <div className="hidden md:flex items-center gap-3">
              {!isAuthenticated ? (
                <>
                  <Link href="/login/user">
                    <Button
                      variant="ghost"
                      className="rounded-xl text-gray-700 hover:bg-gray-100"
                    >
                      Login
                    </Button>
                  </Link>
                  <Link href="/register/user">
                    <Button className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 rounded-xl shadow-lg">
                      Sign Up
                    </Button>
                  </Link>
                  <div className="h-8 w-px bg-gray-200" />
                  <Link href="/login/tenant">
                    <Button
                      variant="outline"
                      className="rounded-xl border-2 hover:bg-gray-50"
                    >
                      <Building2 className="w-4 h-4 mr-2" />
                      For Tenants
                    </Button>
                  </Link>
                </>
              ) : (
                <UserMenu user={user} onLogout={handleLogout} />
              )}
            </div>

            {/* Mobile Menu Button */}
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="md:hidden p-2 rounded-xl hover:bg-gray-100 transition-colors"
            >
              {isMobileMenuOpen ? (
                <X className="w-6 h-6 text-gray-700" />
              ) : (
                <Menu className="w-6 h-6 text-gray-700" />
              )}
            </button>
          </div>
        </div>
      </nav>

      {/* Mobile Menu */}
      <MobileMenu
        isOpen={isMobileMenuOpen}
        onClose={() => setIsMobileMenuOpen(false)}
        isAuthenticated={isAuthenticated}
        user={user}
        onLogout={handleLogout}
      />
    </>
  );
}