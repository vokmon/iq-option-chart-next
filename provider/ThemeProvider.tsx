"use client";

import { type ReactNode, useEffect, useState } from "react";
import { MantineProvider } from "@mantine/core";
import { useThemeStore } from "../stores/themeStore";
import { getTheme } from "../theme/themes";

export const ThemeProvider = ({ children }: { children: ReactNode }) => {
  const [isHydrated, setIsHydrated] = useState(false);
  const currentTheme = useThemeStore((state) => state.currentTheme);

  useEffect(() => {
    setIsHydrated(true);
  }, []);

  // Use default theme during SSR, stored theme after hydration
  const theme = isHydrated
    ? getTheme(currentTheme).theme
    : getTheme("original").theme; // Default theme for SSR

  return <MantineProvider theme={theme}>{children}</MantineProvider>;
};
