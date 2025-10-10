"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Button } from "@/components/ui/button";
import {
  Home,
  Search,
  Calendar,
  Heart,
  User,
  LogOut,
  Building2,
  LayoutDashboard,
  Settings,
} from "lucide-react";

interface MobileMenuProps {
  isOpen: boolean;
  onClose: () => void;
  isAuthenticated: boolean;
  user: any;
  onLogout: () => void;
}

export function MobileMenu({
  isOpen,
  onClose,
  isAuthenticated,
  user,
  onLogout,
}: MobileMenuProps) {
  const pathname = usePathname();

  if (!isOpen) return null;

  const isActive = (path: string) => pathname === path;

  const userMenuItems = [
    { label: "Home", href: "/", icon: Home },
    { label: "Properties", href: "/properties", icon: Search },
    { label: "My Bookings", href: "/bookings", icon: Calendar },
    { label: "Favorites", href: "/favorites", icon: Heart },
    { label: "Profile", href: "/profile", icon: User },
    { label: "Settings", href: "/settings", icon: Settings },
  ];

  const tenantMenuItems = [
    { label: "Dashboard", href: "/tenant/dashboard", icon: LayoutDashboard },
    { label: "Properties", href: "/tenant/properties", icon: Building2 },
    { label: "Bookings", href: "/tenant/bookings", icon: Calendar },
    { label: "Settings", href: "/tenant/settings", icon: Settings },
  ];

  const guestMenuItems = [
    { label: "Home", href: "/", icon: Home },
    { label: "Properties", href: "/properties", icon: Search },
  ];

  const menuItems = !isAuthenticated
    ? guestMenuItems
    : user?.role === "tenant"
    ? tenantMenuItems
    : userMenuItems;

  return (
    <div className="fixed inset-0 z-40 md:hidden">
      {/* Overlay */}
      <div
        className="fixed inset-0 bg-black/50 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Menu Panel */}
      <div className="fixed top-20 left-0 right-0 bottom-0 bg-white overflow-y-auto">
        <div className="p-4">
          {/* User Info */}
          {isAuthenticated && user && (
            <div className="mb-6 p-4 bg-gradient-to-br from-blue-50 to-purple-50 rounded-2xl">
              <div className="flex items-center gap-3">
                <div className="w-14 h-14 rounded-full bg-gradient-to-br from-blue-600 to-purple-600 flex items-center justify-center text-white font-bold text-lg shadow-lg">
                  {user?.avatar ? (
                    <img
                      src={user.avatar}
                      alt={user.name}
                      className="w-full h-full rounded-full object-cover"
                    />
                  ) : (
                    user?.name?.charAt(0).toUpperCase()
                  )}
                </div>
                <div>
                  <p className="font-bold text-gray-900">{user?.name}</p>
                  <p className="text-sm text-gray-600">{user?.email}</p>
                  <span className="inline-block mt-1 px-2 py-0.5 bg-blue-100 text-blue-700 text-xs font-semibold rounded-full capitalize">
                    {user?.role}
                  </span>
                </div>
              </div>
            </div>
          )}

          {/* Menu Items */}
          <nav className="space-y-2 mb-6">
            {menuItems.map((item) => {
              const Icon = item.icon;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={onClose}
                  className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-colors ${
                    isActive(item.href)
                      ? "bg-blue-50 text-blue-600"
                      : "text-gray-700 hover:bg-gray-100"
                  }`}
                >
                  <Icon className="w-5 h-5" />
                  <span className="font-medium">{item.label}</span>
                </Link>
              );
            })}
          </nav>

          {/* Auth Buttons */}
          {!isAuthenticated ? (
            <div className="space-y-3 pt-4 border-t border-gray-200">
              <Link href="/login/user" onClick={onClose}>
                <Button className="w-full h-12 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 rounded-xl shadow-lg">
                  Login as User
                </Button>
              </Link>
              <Link href="/register/user" onClick={onClose}>
                <Button
                  variant="outline"
                  className="w-full h-12 rounded-xl border-2"
                >
                  Sign Up
                </Button>
              </Link>
              <Link href="/login/tenant" onClick={onClose}>
                <Button
                  variant="outline"
                  className="w-full h-12 rounded-xl border-2"
                >
                  <Building2 className="w-4 h-4 mr-2" />
                  Login as Tenant
                </Button>
              </Link>
            </div>
          ) : (
            <div className="pt-4 border-t border-gray-200">
              <button
                onClick={() => {
                  onClose();
                  onLogout();
                }}
                className="flex items-center gap-3 px-4 py-3 text-red-600 hover:bg-red-50 rounded-xl transition-colors w-full"
              >
                <LogOut className="w-5 h-5" />
                <span className="font-medium">Logout</span>
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}