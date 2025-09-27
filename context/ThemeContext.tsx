"use client";

import React, { createContext, useContext, useState, ReactNode } from "react";
import { MantineProvider } from "@mantine/core";
import { themes, ThemeName, getTheme } from "../theme/themes";

interface ThemeContextType {
  currentTheme: ThemeName;
  setTheme: (theme: ThemeName) => void;
  availableThemes: Array<{
    name: string;
    description: string;
    theme: unknown;
    colors: unknown;
    cssVariables: string;
  }>;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

interface ThemeProviderProps {
  children: ReactNode;
  defaultTheme?: ThemeName;
}

export function ThemeProvider({
  children,
  defaultTheme = "original",
}: ThemeProviderProps) {
  const [currentTheme, setCurrentTheme] = useState<ThemeName>(defaultTheme);

  // Load theme from localStorage on mount
  //   useEffect(() => {
  //     const savedTheme = localStorage.getItem("theme") as ThemeName;
  //     console.log("Loading saved theme:", savedTheme);
  //     if (savedTheme && themes[savedTheme]) {
  //       setCurrentTheme(savedTheme);
  //     }
  //   }, []);

  // Save theme to localStorage when it changes
  const setTheme = (theme: ThemeName) => {
    console.log("Setting theme to:", theme);
    setCurrentTheme(theme);
    // localStorage.setItem("theme", theme);
  };

  const currentThemeConfig = getTheme(currentTheme);

  const value: ThemeContextType = {
    currentTheme,
    setTheme,
    availableThemes: Object.values(themes),
  };

  return (
    <ThemeContext.Provider value={value}>
      <MantineProvider theme={currentThemeConfig.theme}>
        {children}
      </MantineProvider>
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error("useTheme must be used within a ThemeProvider");
  }
  return context;
}
