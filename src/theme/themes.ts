import { theme as originalTheme, themeColors, cssVariables } from "./default";
import {
  alternativeTheme,
  alternativeThemeColors,
  alternativeCssVariables,
} from "./alternative";

// Theme types
export type ThemeName = "original" | "alternative";

// Theme configuration
export const themes = {
  original: {
    name: "Original",
    description: "Warm orange and teal color scheme",
    theme: originalTheme,
    colors: themeColors,
    cssVariables: cssVariables,
  },
  alternative: {
    name: "Alternative",
    description: "Modern indigo and emerald color scheme",
    theme: alternativeTheme,
    colors: alternativeThemeColors,
    cssVariables: alternativeCssVariables,
  },
} as const;

// Default theme
export const defaultTheme: ThemeName = "original";

// Helper functions
export const getTheme = (themeName: ThemeName) => themes[themeName];
export const getThemeNames = (): ThemeName[] =>
  Object.keys(themes) as ThemeName[];
export const getThemeList = () =>
  Object.entries(themes).map(([key, config]) => ({
    key: key as ThemeName,
    name: config.name,
    description: config.description,
  }));

// Re-export individual themes for convenience
export { theme as originalTheme, themeColors, cssVariables } from "./default";
export {
  alternativeTheme,
  alternativeThemeColors,
  alternativeCssVariables,
} from "./alternative";
