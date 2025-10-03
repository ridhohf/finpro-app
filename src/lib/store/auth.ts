// src/lib/store/auth.store.ts
// Updated with cookie support for middleware

import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { User } from "../../types/auth";
import Cookies from "js-cookie";

interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  setAuth: (user: User, token: string) => void;
  clearAuth: () => void;
  updateUser: (user: Partial<User>) => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      token: null,
      isAuthenticated: false,

      setAuth: (user, token) => {
        // Set cookie for middleware (expires in 7 days)
        Cookies.set("auth-token", token, {
          expires: 7,
          sameSite: "strict",
          secure: process.env.NODE_ENV === "production",
        });

        set({
          user,
          token,
          isAuthenticated: true,
        });
      },

      clearAuth: () => {
        // Remove cookie
        Cookies.remove("auth-token");

        set({
          user: null,
          token: null,
          isAuthenticated: false,
        });
      },

      updateUser: (userData) =>
        set((state) => ({
          user: state.user ? { ...state.user, ...userData } : null,
        })),
    }),
    {
      name: "auth-storage",
      // On hydration, sync token to cookie if exists
      onRehydrateStorage: () => (state) => {
        if (state?.token) {
          Cookies.set("auth-token", state.token, {
            expires: 7,
            sameSite: "strict",
            secure: process.env.NODE_ENV === "production",
          });
        }
      },
    }
  )
);
