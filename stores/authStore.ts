"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";
import { User } from "../types/User";

interface AuthState {
  // Authentication state
  isAuthenticated: boolean;
  user: User | null;

  // Actions
  setUser: (user: User | null) => void;
  login: (userData: User) => void;
  logout: () => void;
  setAuthenticated: (authenticated: boolean) => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      isAuthenticated: false,
      user: null,

      setUser: (user: User | null) => {
        set({ user, isAuthenticated: !!user });
      },

      login: (userData: User) => {
        set({
          user: userData,
          isAuthenticated: true,
        });
      },

      logout: () => {
        set({
          user: null,
          isAuthenticated: false,
        });
      },

      setAuthenticated: (authenticated: boolean) => {
        set({ isAuthenticated: authenticated });
      },
    }),
    {
      name: "auth-storage",
      // Only persist user data, not the SDK instance
      partialize: (state) => ({
        user: state.user,
        isAuthenticated: state.isAuthenticated,
      }),
    }
  )
);
