import { createTheme, MantineColorsTuple } from "@mantine/core";

// Define alternative color palette - Modern Professional Theme
const primaryColor: MantineColorsTuple = [
  "#f0f4ff", // 0 - lightest
  "#e0e7ff", // 1
  "#c7d2fe", // 2
  "#a5b4fc", // 3
  "#818cf8", // 4
  "#6366f1", // 5 - main primary (indigo)
  "#4f46e5", // 6
  "#4338ca", // 7
  "#3730a3", // 8
  "#312e81", // 9 - darkest
];

const darkColor: MantineColorsTuple = [
  "#f8fafc", // 0 - lightest
  "#f1f5f9", // 1
  "#e2e8f0", // 2
  "#cbd5e1", // 3
  "#94a3b8", // 4
  "#64748b", // 5
  "#475569", // 6
  "#334155", // 7
  "#1e293b", // 8
  "#0f172a", // 9 - darkest (same as original for consistency)
];

const accentColor: MantineColorsTuple = [
  "#f0fdf4", // 0 - lightest
  "#dcfce7", // 1
  "#bbf7d0", // 2
  "#86efac", // 3
  "#4ade80", // 4
  "#22c55e", // 5 - main accent (emerald)
  "#16a34a", // 6
  "#15803d", // 7
  "#166534", // 8
  "#14532d", // 9 - darkest
];

const bollingerColor: MantineColorsTuple = [
  "#fef3c7", // 0 - lightest
  "#fde68a", // 1
  "#fcd34d", // 2 - secondary (middle band)
  "#fbbf24", // 3
  "#f59e0b", // 4 - primary (upper/lower bands)
  "#d97706", // 5
  "#b45309", // 6
  "#92400e", // 7
  "#78350f", // 8
  "#451a03", // 9 - darkest
];

const donchianColor: MantineColorsTuple = [
  "#fdf2f8", // 0 - lightest
  "#fce7f3", // 1
  "#fbcfe8", // 2 - secondary (middle channel)
  "#f9a8d4", // 3
  "#f472b6", // 4 - primary (upper/lower channels)
  "#ec4899", // 5
  "#db2777", // 6
  "#be185d", // 7
  "#9d174d", // 8
  "#831843", // 9 - darkest
];

const stochasticColor: MantineColorsTuple = [
  "#f0f9ff", // 0 - lightest
  "#e0f2fe", // 1
  "#bae6fd", // 2
  "#7dd3fc", // 3
  "#38bdf8", // 4 - primary (%K line) - bright blue
  "#0ea5e9", // 5
  "#0284c7", // 6
  "#0369a1", // 7
  "#075985", // 8
  "#0c4a6e", // 9 - darkest
];

const stochasticSecondaryColor: MantineColorsTuple = [
  "#f0fdf4", // 0 - lightest
  "#dcfce7", // 1
  "#bbf7d0", // 2
  "#86efac", // 3
  "#4ade80", // 4 - secondary (%D line) - emerald green
  "#22c55e", // 5
  "#16a34a", // 6
  "#15803d", // 7
  "#166534", // 8
  "#14532d", // 9 - darkest
];

// Candle size colors - modern professional theme
const candleSize1MinColor: MantineColorsTuple = [
  "#fef3c7", // 0 - lightest
  "#fde68a", // 1
  "#fcd34d", // 2
  "#fbbf24", // 3
  "#f59e0b", // 4 - primary (1min candles) - amber
  "#d97706", // 5
  "#b45309", // 6
  "#92400e", // 7
  "#78350f", // 8
  "#451a03", // 9 - darkest
];

const candleSize5MinColor: MantineColorsTuple = [
  "#ecfdf5", // 0 - lightest
  "#d1fae5", // 1
  "#a7f3d0", // 2
  "#6ee7b7", // 3
  "#34d399", // 4 - primary (5min candles) - emerald
  "#10b981", // 5
  "#059669", // 6
  "#047857", // 7
  "#065f46", // 8
  "#064e3b", // 9 - darkest
];

const candleSize15MinColor: MantineColorsTuple = [
  "#ecfdf5", // 0 - lightest
  "#d1fae5", // 1
  "#a7f3d0", // 2
  "#6ee7b7", // 3
  "#34d399", // 4 - primary (15min candles) - emerald
  "#10b981", // 5
  "#059669", // 6
  "#047857", // 7
  "#065f46", // 8
  "#064e3b", // 9 - darkest
];

const candleSize1HourColor: MantineColorsTuple = [
  "#fef3c7", // 0 - lightest
  "#fde68a", // 1
  "#fcd34d", // 2
  "#fbbf24", // 3
  "#f59e0b", // 4 - primary (1hour candles) - amber
  "#d97706", // 5
  "#b45309", // 6
  "#92400e", // 7
  "#78350f", // 8
  "#451a03", // 9 - darkest
];

const candleSize4HourColor: MantineColorsTuple = [
  "#f3e8ff", // 0 - lightest
  "#e9d5ff", // 1
  "#ddd6fe", // 2
  "#c4b5fd", // 3
  "#a78bfa", // 4 - primary (4hour candles) - violet
  "#8b5cf6", // 5
  "#7c3aed", // 6
  "#6d28d9", // 7
  "#5b21b6", // 8
  "#4c1d95", // 9 - darkest
];

const candleSize1DayColor: MantineColorsTuple = [
  "#fdf2f8", // 0 - lightest
  "#fce7f3", // 1
  "#fbcfe8", // 2
  "#f9a8d4", // 3
  "#f472b6", // 4 - primary (1day candles) - pink
  "#ec4899", // 5
  "#db2777", // 6
  "#be185d", // 7
  "#9d174d", // 8
  "#831843", // 9 - darkest
];

// Create the alternative theme
export const alternativeTheme = createTheme({
  colors: {
    primary: primaryColor,
    dark: darkColor,
    accent: accentColor,
    bollinger: bollingerColor,
    donchian: donchianColor,
    stochastic: stochasticColor,
    stochasticSecondary: stochasticSecondaryColor,
    candleSize1Min: candleSize1MinColor,
    candleSize5Min: candleSize5MinColor,
    candleSize15Min: candleSize15MinColor,
    candleSize1Hour: candleSize1HourColor,
    candleSize4Hour: candleSize4HourColor,
    candleSize1Day: candleSize1DayColor,
  },
  primaryColor: "primary",
  primaryShade: 5,

  // Component styles - more modern and rounded
  components: {
    Container: {
      defaultProps: {
        size: "xl",
      },
    },
    Paper: {
      defaultProps: {
        shadow: "lg",
        radius: "lg",
      },
    },
    Button: {
      defaultProps: {
        radius: "lg",
      },
    },
    Card: {
      defaultProps: {
        shadow: "md",
        radius: "lg",
      },
    },
    Modal: {
      defaultProps: {
        radius: "lg",
        shadow: "xl",
      },
    },
  },

  // Spacing
  spacing: {
    xs: "0.5rem",
    sm: "0.75rem",
    md: "1rem",
    lg: "1.5rem",
    xl: "2rem",
  },

  // Radius
  radius: {
    xs: "0.25rem",
    sm: "0.375rem",
    md: "0.5rem",
    lg: "0.75rem",
    xl: "1rem",
  },

  // Shadows - more dramatic for depth
  shadows: {
    xs: "0 1px 2px 0 rgba(0, 0, 0, 0.05)",
    sm: "0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06)",
    md: "0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)",
    lg: "0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)",
    xl: "0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)",
  },

  // Font family - more modern
  fontFamily:
    "Inter, -apple-system, BlinkMacSystemFont, Segoe UI, Roboto, sans-serif",
  fontFamilyMonospace: "JetBrains Mono, Fira Code, Consolas, monospace",
});

// Theme color variables for CSS custom properties
export const alternativeThemeColors = {
  // Primary colors (Indigo)
  primary: {
    50: "#f0f4ff",
    100: "#e0e7ff",
    200: "#c7d2fe",
    300: "#a5b4fc",
    400: "#818cf8",
    500: "#6366f1", // main
    600: "#4f46e5",
    700: "#4338ca",
    800: "#3730a3",
    900: "#312e81",
  },
  // Dark colors (same as original for consistency)
  dark: {
    50: "#f8fafc",
    100: "#f1f5f9",
    200: "#e2e8f0",
    300: "#cbd5e1",
    400: "#94a3b8",
    500: "#64748b",
    600: "#475569",
    700: "#334155",
    800: "#1e293b", // main dark
    900: "#0f172a", // darkest
  },
  // Accent colors (Emerald)
  accent: {
    50: "#f0fdf4",
    100: "#dcfce7",
    200: "#bbf7d0",
    300: "#86efac",
    400: "#4ade80",
    500: "#22c55e", // main accent
    600: "#16a34a",
    700: "#15803d",
    800: "#166534",
    900: "#14532d",
  },
  // Bollinger Bands colors (Amber)
  bollinger: {
    50: "#fef3c7",
    100: "#fde68a",
    200: "#fcd34d", // secondary (middle band)
    300: "#fbbf24",
    400: "#f59e0b", // primary (upper/lower bands)
    500: "#d97706",
    600: "#b45309",
    700: "#92400e",
    800: "#78350f",
    900: "#451a03",
  },
  // Donchian Channels colors (Pink)
  donchian: {
    50: "#fdf2f8",
    100: "#fce7f3",
    200: "#fbcfe8", // secondary (middle channel)
    300: "#f9a8d4",
    400: "#f472b6", // primary (upper/lower channels)
    500: "#ec4899",
    600: "#db2777",
    700: "#be185d",
    800: "#9d174d",
    900: "#831843",
  },
  // Stochastic colors (Bright Blue)
  stochastic: {
    50: "#f0f9ff",
    100: "#e0f2fe",
    200: "#bae6fd",
    300: "#7dd3fc",
    400: "#38bdf8", // primary (%K line) - bright blue
    500: "#0ea5e9",
    600: "#0284c7",
    700: "#0369a1",
    800: "#075985",
    900: "#0c4a6e",
  },
  // Stochastic secondary colors (Emerald Green)
  stochasticSecondary: {
    50: "#f0fdf4",
    100: "#dcfce7",
    200: "#bbf7d0",
    300: "#86efac",
    400: "#4ade80", // secondary (%D line) - emerald green
    500: "#22c55e",
    600: "#16a34a",
    700: "#15803d",
    800: "#166534",
    900: "#14532d",
  },

  // Semantic colors
  success: "#22c55e",
  warning: "#f59e0b",
  error: "#ef4444",
  info: "#3b82f6",
};

// CSS custom properties for Tailwind integration
export const alternativeCssVariables = `
  :root {
    /* Primary colors (Indigo) */
    --color-primary-50: ${alternativeThemeColors.primary[50]};
    --color-primary-100: ${alternativeThemeColors.primary[100]};
    --color-primary-200: ${alternativeThemeColors.primary[200]};
    --color-primary-300: ${alternativeThemeColors.primary[300]};
    --color-primary-400: ${alternativeThemeColors.primary[400]};
    --color-primary-500: ${alternativeThemeColors.primary[500]};
    --color-primary-600: ${alternativeThemeColors.primary[600]};
    --color-primary-700: ${alternativeThemeColors.primary[700]};
    --color-primary-800: ${alternativeThemeColors.primary[800]};
    --color-primary-900: ${alternativeThemeColors.primary[900]};
    
    /* Dark colors */
    --color-dark-50: ${alternativeThemeColors.dark[50]};
    --color-dark-100: ${alternativeThemeColors.dark[100]};
    --color-dark-200: ${alternativeThemeColors.dark[200]};
    --color-dark-300: ${alternativeThemeColors.dark[300]};
    --color-dark-400: ${alternativeThemeColors.dark[400]};
    --color-dark-500: ${alternativeThemeColors.dark[500]};
    --color-dark-600: ${alternativeThemeColors.dark[600]};
    --color-dark-700: ${alternativeThemeColors.dark[700]};
    --color-dark-800: ${alternativeThemeColors.dark[800]};
    --color-dark-900: ${alternativeThemeColors.dark[900]};
    
    /* Accent colors (Emerald) */
    --color-accent-50: ${alternativeThemeColors.accent[50]};
    --color-accent-100: ${alternativeThemeColors.accent[100]};
    --color-accent-200: ${alternativeThemeColors.accent[200]};
    --color-accent-300: ${alternativeThemeColors.accent[300]};
    --color-accent-400: ${alternativeThemeColors.accent[400]};
    --color-accent-500: ${alternativeThemeColors.accent[500]};
    --color-accent-600: ${alternativeThemeColors.accent[600]};
    --color-accent-700: ${alternativeThemeColors.accent[700]};
    --color-accent-800: ${alternativeThemeColors.accent[800]};
    --color-accent-900: ${alternativeThemeColors.accent[900]};
    
    /* Semantic colors */
    --color-success: ${alternativeThemeColors.success};
    --color-warning: ${alternativeThemeColors.warning};
    --color-error: ${alternativeThemeColors.error};
    --color-info: ${alternativeThemeColors.info};
    
    /* Background gradients - more sophisticated */
    --gradient-primary: linear-gradient(135deg, var(--color-primary-900) 0%, var(--color-primary-700) 50%, var(--color-primary-900) 100%);
    --gradient-primary-button: linear-gradient(90deg, var(--color-primary-500) 0%, var(--color-primary-600) 100%);
    --gradient-primary-button-hover: linear-gradient(90deg, var(--color-primary-600) 0%, var(--color-primary-700) 100%);
    --gradient-primary-button-disabled: linear-gradient(90deg, var(--color-primary-200) 0%, var(--color-primary-300) 100%);
    
    /* Glass morphism - more subtle */
    --glass-bg: rgba(255, 255, 255, 0.08);
    --glass-border: rgba(255, 255, 255, 0.15);
    --glass-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.3);
    
    /* Additional modern effects */
    --gradient-accent: linear-gradient(135deg, var(--color-accent-500) 0%, var(--color-accent-600) 100%);
    --gradient-warm: linear-gradient(135deg, #fbbf24 0%, #f59e0b 100%);
    --gradient-cool: linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%);
  }
`;
