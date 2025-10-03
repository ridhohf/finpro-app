"use client"

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAuthStore } from "@/lib/store/auth";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar } from "@/components/ui/avatar";
import {
  Menu,
  X,
  User,
  LogOut,
  Settings,
  Building2,
  Home,
  Calendar,
  LayoutDashboard,
  Package,
} from "lucide-react";
import { toast } from "sonner";

export function Navbar() {
  const router = useRouter();
  const { isAuthenticated, user, clearAuth } = useAuthStore();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const handleLogout = () => {
    clearAuth();
    toast.success("Logged out successfully");
    router.push("/");
    setIsMobileMenuOpen(false);
  };

  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);
  };

  return (
    <nav className="sticky top-0 z-50 w-full border-b bg-white/95 backdrop-blur supports-[backdrop-filter]:bg-white/60">
      <div className="container mx-auto px-4">
        <div className="flex h-16 items-center justify-between">
          {/* Logo */}
          <Link href="/" className="flex items-center space-x-2">
            <Building2 className="h-6 w-6 text-blue-600" />
            <span className="text-xl font-bold text-gray-900">
              PropertyRent
            </span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex md:items-center md:space-x-6">
            {isAuthenticated ? (
              <>
                {/* User Navigation */}
                {user?.role === "user" && (
                  <>
                    <Link
                      href="/properties"
                      className="text-sm font-medium text-gray-700 hover:text-blue-600 transition-colors"
                    >
                      Browse Properties
                    </Link>
                    <Link
                      href="/reservations"
                      className="text-sm font-medium text-gray-700 hover:text-blue-600 transition-colors"
                    >
                      My Bookings
                    </Link>
                  </>
                )}

                {/* Tenant Navigation */}
                {user?.role === "tenant" && (
                  <>
                    <Link
                      href="/tenant/dashboard"
                      className="text-sm font-medium text-gray-700 hover:text-purple-600 transition-colors"
                    >
                      Dashboard
                    </Link>
                    <Link
                      href="/tenant/properties"
                      className="text-sm font-medium text-gray-700 hover:text-purple-600 transition-colors"
                    >
                      My Properties
                    </Link>
                  </>
                )}

                {/* User Menu */}
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button
                      variant="ghost"
                      className="relative h-10 w-10 rounded-full"
                    >
                      <Avatar className="h-10 w-10">
                        {user?.avatar ? (
                          <img
                            src={user.avatar}
                            alt={user.name}
                            className="h-full w-full object-cover"
                          />
                        ) : (
                          <div className="flex h-full w-full items-center justify-center bg-blue-600 text-sm font-medium text-white">
                            {getInitials(user?.name || "U")}
                          </div>
                        )}
                      </Avatar>
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent className="w-56" align="end">
                    <DropdownMenuLabel>
                      <div className="flex flex-col space-y-1">
                        <p className="text-sm font-medium">{user?.name}</p>
                        <p className="text-xs text-gray-500">{user?.email}</p>
                        <p className="text-xs text-blue-600 font-medium capitalize">
                          {user?.role}
                        </p>
                      </div>
                    </DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    {user?.role === "user" && (
                      <>
                        <DropdownMenuItem asChild>
                          <Link href="/profile" className="cursor-pointer">
                            <User className="mr-2 h-4 w-4" />
                            Profile
                          </Link>
                        </DropdownMenuItem>
                        <DropdownMenuItem asChild>
                          <Link href="/reservations" className="cursor-pointer">
                            <Calendar className="mr-2 h-4 w-4" />
                            My Bookings
                          </Link>
                        </DropdownMenuItem>
                      </>
                    )}
                    {user?.role === "tenant" && (
                      <>
                        <DropdownMenuItem asChild>
                          <Link
                            href="/tenant/dashboard"
                            className="cursor-pointer"
                          >
                            <LayoutDashboard className="mr-2 h-4 w-4" />
                            Dashboard
                          </Link>
                        </DropdownMenuItem>
                        <DropdownMenuItem asChild>
                          <Link
                            href="/tenant/properties"
                            className="cursor-pointer"
                          >
                            <Package className="mr-2 h-4 w-4" />
                            My Properties
                          </Link>
                        </DropdownMenuItem>
                        <DropdownMenuItem asChild>
                          <Link href="/profile" className="cursor-pointer">
                            <Settings className="mr-2 h-4 w-4" />
                            Settings
                          </Link>
                        </DropdownMenuItem>
                      </>
                    )}
                    <DropdownMenuSeparator />
                    <DropdownMenuItem
                      onClick={handleLogout}
                      className="cursor-pointer text-red-600"
                    >
                      <LogOut className="mr-2 h-4 w-4" />
                      Logout
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </>
            ) : (
              <>
                <Link
                  href="/properties"
                  className="text-sm font-medium text-gray-700 hover:text-blue-600 transition-colors"
                >
                  Browse Properties
                </Link>
                <Link href="/login/user">
                  <Button variant="ghost">Sign In</Button>
                </Link>
                <Link href="/register/user">
                  <Button className="bg-blue-600 hover:bg-blue-700">
                    Sign Up
                  </Button>
                </Link>
              </>
            )}
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="md:hidden p-2 text-gray-700"
          >
            {isMobileMenuOpen ? (
              <X className="h-6 w-6" />
            ) : (
              <Menu className="h-6 w-6" />
            )}
          </button>
        </div>

        {/* Mobile Menu */}
        {isMobileMenuOpen && (
          <div className="md:hidden py-4 space-y-3 border-t">
            {isAuthenticated ? (
              <>
                {/* User Info */}
                <div className="px-2 py-3 border-b">
                  <div className="flex items-center space-x-3">
                    <Avatar className="h-12 w-12">
                      {user?.avatar ? (
                        <img
                          src={user.avatar}
                          alt={user.name}
                          className="h-full w-full object-cover"
                        />
                      ) : (
                        <div className="flex h-full w-full items-center justify-center bg-blue-600 text-white font-medium">
                          {getInitials(user?.name || "U")}
                        </div>
                      )}
                    </Avatar>
                    <div>
                      <p className="font-medium">{user?.name}</p>
                      <p className="text-sm text-gray-500">{user?.email}</p>
                      <p className="text-xs text-blue-600 font-medium capitalize">
                        {user?.role}
                      </p>
                    </div>
                  </div>
                </div>

                {/* User Links */}
                {user?.role === "user" && (
                  <>
                    <Link
                      href="/properties"
                      onClick={() => setIsMobileMenuOpen(false)}
                      className="block px-2 py-2 text-gray-700 hover:bg-gray-100 rounded-md"
                    >
                      Browse Properties
                    </Link>
                    <Link
                      href="/reservations"
                      onClick={() => setIsMobileMenuOpen(false)}
                      className="block px-2 py-2 text-gray-700 hover:bg-gray-100 rounded-md"
                    >
                      My Bookings
                    </Link>
                    <Link
                      href="/profile"
                      onClick={() => setIsMobileMenuOpen(false)}
                      className="block px-2 py-2 text-gray-700 hover:bg-gray-100 rounded-md"
                    >
                      Profile
                    </Link>
                  </>
                )}

                {/* Tenant Links */}
                {user?.role === "tenant" && (
                  <>
                    <Link
                      href="/tenant/dashboard"
                      onClick={() => setIsMobileMenuOpen(false)}
                      className="block px-2 py-2 text-gray-700 hover:bg-gray-100 rounded-md"
                    >
                      Dashboard
                    </Link>
                    <Link
                      href="/tenant/properties"
                      onClick={() => setIsMobileMenuOpen(false)}
                      className="block px-2 py-2 text-gray-700 hover:bg-gray-100 rounded-md"
                    >
                      My Properties
                    </Link>
                    <Link
                      href="/profile"
                      onClick={() => setIsMobileMenuOpen(false)}
                      className="block px-2 py-2 text-gray-700 hover:bg-gray-100 rounded-md"
                    >
                      Settings
                    </Link>
                  </>
                )}

                <button
                  onClick={handleLogout}
                  className="w-full text-left px-2 py-2 text-red-600 hover:bg-red-50 rounded-md"
                >
                  Logout
                </button>
              </>
            ) : (
              <>
                <Link
                  href="/properties"
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="block px-2 py-2 text-gray-700 hover:bg-gray-100 rounded-md"
                >
                  Browse Properties
                </Link>
                <Link
                  href="/login/user"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  <Button variant="ghost" className="w-full justify-start">
                    Sign In
                  </Button>
                </Link>
                <Link
                  href="/register/user"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  <Button className="w-full bg-blue-600 hover:bg-blue-700">
                    Sign Up
                  </Button>
                </Link>
              </>
            )}
          </div>
        )}
      </div>
    </nav>
  );
}
