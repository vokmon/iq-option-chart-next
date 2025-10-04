import { useEffect, useRef } from "react";
import { useThemeStore } from "../stores/themeStore";

export function useThemeChange() {
  const currentTheme = useThemeStore((state) => state.currentTheme);
  const previousThemeRef = useRef<string | null>(null);
  const themeChangeCallbacksRef = useRef<Set<() => void>>(new Set());

  useEffect(() => {
    if (
      previousThemeRef.current !== null &&
      previousThemeRef.current !== currentTheme
    ) {
      // Theme has changed, trigger all callbacks
      themeChangeCallbacksRef.current.forEach((callback) => {
        try {
          callback();
        } catch (error) {
          console.warn("Error in theme change callback:", error);
        }
      });
    }
    previousThemeRef.current = currentTheme;
  }, [currentTheme]);

  const onThemeChange = (callback: () => void) => {
    themeChangeCallbacksRef.current.add(callback);

    // Return cleanup function
    return () => {
      themeChangeCallbacksRef.current.delete(callback);
    };
  };

  return { onThemeChange };
}
