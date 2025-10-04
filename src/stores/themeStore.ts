"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";
import { themes, ThemeName, getTheme } from "../theme/themes";

interface ThemeState {
  currentTheme: ThemeName;
  setTheme: (theme: ThemeName) => void;
  availableThemes: Array<{
    name: string;
    description: string;
    theme: unknown;
    colors: unknown;
    cssVariables: string;
  }>;
  getCurrentThemeConfig: () => ReturnType<typeof getTheme>;
}

export const useThemeStore = create<ThemeState>()(
  persist(
    (set, get) => ({
      currentTheme: "original",
      setTheme: (theme: ThemeName) => {
        set({ currentTheme: theme });
      },
      availableThemes: Object.values(themes),
      getCurrentThemeConfig: () => {
        const { currentTheme } = get();
        return getTheme(currentTheme);
      },
    }),
    {
      name: "theme-storage",
      // Only persist the currentTheme, not the entire state
      partialize: (state) => ({ currentTheme: state.currentTheme }),
    }
  )
);
