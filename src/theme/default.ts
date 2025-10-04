import { createTheme, MantineColorsTuple } from "@mantine/core";

// Define custom color palette
const primaryColor: MantineColorsTuple = [
  "#fff7ed", // 0 - lightest
  "#ffedd5", // 1
  "#fed7aa", // 2
  "#fdba74", // 3
  "#fb923c", // 4
  "#f97316", // 5 - main primary
  "#ea580c", // 6
  "#dc2626", // 7
  "#b91c1c", // 8
  "#991b1b", // 9 - darkest
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
  "#1e293b", // 8 - main dark
  "#0f172a", // 9 - darkest
];

const accentColor: MantineColorsTuple = [
  "#f0fdfa", // 0 - lightest
  "#ccfbf1", // 1
  "#99f6e4", // 2
  "#5eead4", // 3
  "#2dd4bf", // 4
  "#14b8a6", // 5 - main accent
  "#0d9488", // 6
  "#0f766e", // 7
  "#115e59", // 8
  "#134e4a", // 9 - darkest
];

const bollingerColor: MantineColorsTuple = [
  "#e3f2fd", // 0 - lightest
  "#bbdefb", // 1
  "#90caf9", // 2 - secondary (middle band)
  "#64b5f6", // 3
  "#42a5f5", // 4 - primary (upper/lower bands)
  "#2196f3", // 5
  "#1e88e5", // 6
  "#1976d2", // 7
  "#1565c0", // 8
  "#0d47a1", // 9 - darkest
];

const donchianColor: MantineColorsTuple = [
  "#f3e5f5", // 0 - lightest
  "#e1bee7", // 1
  "#ce93d8", // 2 - secondary (middle channel)
  "#ba68c8", // 3
  "#ab47bc", // 4 - primary (upper/lower channels)
  "#9c27b0", // 5
  "#8e24aa", // 6
  "#7b1fa2", // 7
  "#6a1b9a", // 8
  "#4a148c", // 9 - darkest
];

const stochasticColor: MantineColorsTuple = [
  "#ffebee", // 0 - lightest
  "#ffcdd2", // 1
  "#ef9a9a", // 2
  "#e57373", // 3
  "#ff6b6b", // 4 - primary (%K line)
  "#f44336", // 5
  "#e53935", // 6
  "#d32f2f", // 7
  "#c62828", // 8
  "#b71c1c", // 9 - darkest
];

const stochasticSecondaryColor: MantineColorsTuple = [
  "#e0f2f1", // 0 - lightest
  "#b2dfdb", // 1
  "#80cbc4", // 2
  "#4db6ac", // 3
  "#4ecdc4", // 4 - secondary (%D line)
  "#26a69a", // 5
  "#00897b", // 6
  "#00796b", // 7
  "#00695c", // 8
  "#004d40", // 9 - darkest
];

const supportResistanceColor: MantineColorsTuple = [
  "#f0fdf4", // 0 - lightest (light green)
  "#dcfce7", // 1
  "#bbf7d0", // 2
  "#86efac", // 3
  "#10b981", // 4 - primary (resistance - green)
  "#059669", // 5
  "#047857", // 6
  "#065f46", // 7
  "#064e3b", // 8
  "#022c22", // 9 - darkest (dark green)
];

const supportResistanceSupportColor: MantineColorsTuple = [
  "#fef2f2", // 0 - lightest (light red)
  "#fee2e2", // 1
  "#fecaca", // 2
  "#fca5a5", // 3
  "#ef4444", // 4 - primary (support - red)
  "#dc2626", // 5
  "#b91c1c", // 6
  "#991b1b", // 7
  "#7f1d1d", // 8
  "#450a0a", // 9 - darkest (dark red)
];

const rsiColor: MantineColorsTuple = [
  "#faf5ff", // 0 - lightest
  "#f3e8ff", // 1
  "#e9d5ff", // 2
  "#ddd6fe", // 3
  "#c4b5fd", // 4 - primary (RSI line)
  "#a78bfa", // 5
  "#8b5cf6", // 6
  "#7c3aed", // 7
  "#6d28d9", // 8
  "#5b21b6", // 9 - darkest
];

// Candle size colors - different colors for different timeframes
const candleSize1MinColor: MantineColorsTuple = [
  "#fef2f2", // 0 - lightest
  "#fee2e2", // 1
  "#fecaca", // 2
  "#fca5a5", // 3
  "#f87171", // 4 - primary (1min candles) - red
  "#ef4444", // 5
  "#dc2626", // 6
  "#b91c1c", // 7
  "#991b1b", // 8
  "#7f1d1d", // 9 - darkest
];

const candleSize5MinColor: MantineColorsTuple = [
  "#f0f9ff", // 0 - lightest
  "#e0f2fe", // 1
  "#bae6fd", // 2
  "#7dd3fc", // 3
  "#38bdf8", // 4 - primary (5min candles) - blue
  "#0ea5e9", // 5
  "#0284c7", // 6
  "#0369a1", // 7
  "#075985", // 8
  "#0c4a6e", // 9 - darkest
];

const candleSize15MinColor: MantineColorsTuple = [
  "#f0fdf4", // 0 - lightest
  "#dcfce7", // 1
  "#bbf7d0", // 2
  "#86efac", // 3
  "#4ade80", // 4 - primary (15min candles)
  "#22c55e", // 5
  "#16a34a", // 6
  "#15803d", // 7
  "#166534", // 8
  "#14532d", // 9 - darkest
];

const candleSize1HourColor: MantineColorsTuple = [
  "#fef3c7", // 0 - lightest
  "#fde68a", // 1
  "#fcd34d", // 2
  "#fbbf24", // 3
  "#f59e0b", // 4 - primary (1hour candles)
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
  "#a78bfa", // 4 - primary (4hour candles)
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
  "#f472b6", // 4 - primary (1day candles)
  "#ec4899", // 5
  "#db2777", // 6
  "#be185d", // 7
  "#9d174d", // 8
  "#831843", // 9 - darkest
];

// Create the theme
export const theme = createTheme({
  colors: {
    primary: primaryColor,
    dark: darkColor,
    accent: accentColor,
    bollinger: bollingerColor,
    donchian: donchianColor,
    stochastic: stochasticColor,
    stochasticSecondary: stochasticSecondaryColor,
    supportResistance: supportResistanceColor,
    supportResistanceSupport: supportResistanceSupportColor,
    rsi: rsiColor,
    candleSize1Min: candleSize1MinColor,
    candleSize5Min: candleSize5MinColor,
    candleSize15Min: candleSize15MinColor,
    candleSize1Hour: candleSize1HourColor,
    candleSize4Hour: candleSize4HourColor,
    candleSize1Day: candleSize1DayColor,
  },
  primaryColor: "primary",
  primaryShade: 5,

  // Component styles
  components: {
    Container: {
      defaultProps: {
        size: "xl",
      },
    },
    Paper: {
      defaultProps: {
        shadow: "sm",
        radius: "md",
      },
    },
    Button: {
      defaultProps: {
        radius: "md",
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

  // Shadows
  shadows: {
    xs: "0 1px 2px 0 rgba(0, 0, 0, 0.05)",
    sm: "0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06)",
    md: "0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)",
    lg: "0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)",
    xl: "0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)",
  },
});

// Theme color variables for CSS custom properties
export const themeColors = {
  // Primary colors
  primary: {
    50: "#fff7ed",
    100: "#ffedd5",
    200: "#fed7aa",
    300: "#fdba74",
    400: "#fb923c",
    500: "#f97316", // main
    600: "#ea580c",
    700: "#dc2626",
    800: "#b91c1c",
    900: "#991b1b",
  },
  // Dark colors
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
  // Accent colors
  accent: {
    50: "#f0fdfa",
    100: "#ccfbf1",
    200: "#99f6e4",
    300: "#5eead4",
    400: "#2dd4bf",
    500: "#14b8a6", // main accent
    600: "#0d9488",
    700: "#0f766e",
    800: "#115e59",
    900: "#134e4a",
  },
  // Bollinger Bands colors
  bollinger: {
    50: "#e3f2fd",
    100: "#bbdefb",
    200: "#90caf9", // secondary (middle band)
    300: "#64b5f6",
    400: "#42a5f5", // primary (upper/lower bands)
    500: "#2196f3",
    600: "#1e88e5",
    700: "#1976d2",
    800: "#1565c0",
    900: "#0d47a1",
  },
  // Donchian Channels colors
  donchian: {
    50: "#f3e5f5",
    100: "#e1bee7",
    200: "#ce93d8", // secondary (middle channel)
    300: "#ba68c8",
    400: "#ab47bc", // primary (upper/lower channels)
    500: "#9c27b0",
    600: "#8e24aa",
    700: "#7b1fa2",
    800: "#6a1b9a",
    900: "#4a148c",
  },
  // Stochastic colors
  stochastic: {
    50: "#ffebee",
    100: "#ffcdd2",
    200: "#ef9a9a",
    300: "#e57373",
    400: "#ff6b6b", // primary (%K line)
    500: "#f44336",
    600: "#e53935",
    700: "#d32f2f",
    800: "#c62828",
    900: "#b71c1c",
  },
  // Stochastic secondary colors
  stochasticSecondary: {
    50: "#e0f2f1",
    100: "#b2dfdb",
    200: "#80cbc4",
    300: "#4db6ac",
    400: "#4ecdc4", // secondary (%D line)
    500: "#26a69a",
    600: "#00897b",
    700: "#00796b",
    800: "#00695c",
    900: "#004d40",
  },
  // Support & Resistance colors (Resistance - Orange)
  supportResistance: {
    50: "#f0fdf4",
    100: "#dcfce7",
    200: "#bbf7d0", // secondary (resistance - light green)
    300: "#86efac",
    400: "#10b981", // primary (resistance - green)
    500: "#059669",
    600: "#047857",
    700: "#065f46",
    800: "#064e3b",
    900: "#022c22",
  },
  // Support & Resistance Support colors (Support - Red)
  supportResistanceSupport: {
    50: "#fef2f2",
    100: "#fee2e2",
    200: "#fecaca", // secondary (support - light red)
    300: "#fca5a5",
    400: "#ef4444", // primary (support - red)
    500: "#dc2626",
    600: "#b91c1c",
    700: "#991b1b",
    800: "#7f1d1d",
    900: "#450a0a",
  },
  // RSI colors
  rsi: {
    50: "#faf5ff",
    100: "#f3e8ff",
    200: "#e9d5ff",
    300: "#ddd6fe",
    400: "#c4b5fd", // primary (RSI line)
    500: "#a78bfa",
    600: "#8b5cf6",
    700: "#7c3aed",
    800: "#6d28d9",
    900: "#5b21b6",
  },

  // Semantic colors
  success: "#10b981",
  warning: "#f59e0b",
  error: "#ef4444",
  info: "#3b82f6",
};

// CSS custom properties for Tailwind integration
export const cssVariables = `
  :root {
    /* Primary colors */
    --color-primary-50: ${themeColors.primary[50]};
    --color-primary-100: ${themeColors.primary[100]};
    --color-primary-200: ${themeColors.primary[200]};
    --color-primary-300: ${themeColors.primary[300]};
    --color-primary-400: ${themeColors.primary[400]};
    --color-primary-500: ${themeColors.primary[500]};
    --color-primary-600: ${themeColors.primary[600]};
    --color-primary-700: ${themeColors.primary[700]};
    --color-primary-800: ${themeColors.primary[800]};
    --color-primary-900: ${themeColors.primary[900]};
    
    /* Dark colors */
    --color-dark-50: ${themeColors.dark[50]};
    --color-dark-100: ${themeColors.dark[100]};
    --color-dark-200: ${themeColors.dark[200]};
    --color-dark-300: ${themeColors.dark[300]};
    --color-dark-400: ${themeColors.dark[400]};
    --color-dark-500: ${themeColors.dark[500]};
    --color-dark-600: ${themeColors.dark[600]};
    --color-dark-700: ${themeColors.dark[700]};
    --color-dark-800: ${themeColors.dark[800]};
    --color-dark-900: ${themeColors.dark[900]};
    
    /* Accent colors */
    --color-accent-50: ${themeColors.accent[50]};
    --color-accent-100: ${themeColors.accent[100]};
    --color-accent-200: ${themeColors.accent[200]};
    --color-accent-300: ${themeColors.accent[300]};
    --color-accent-400: ${themeColors.accent[400]};
    --color-accent-500: ${themeColors.accent[500]};
    --color-accent-600: ${themeColors.accent[600]};
    --color-accent-700: ${themeColors.accent[700]};
    --color-accent-800: ${themeColors.accent[800]};
    --color-accent-900: ${themeColors.accent[900]};
    
    /* Bollinger Bands colors */
    --color-bollinger-50: ${themeColors.bollinger[50]};
    --color-bollinger-100: ${themeColors.bollinger[100]};
    --color-bollinger-200: ${themeColors.bollinger[200]};
    --color-bollinger-300: ${themeColors.bollinger[300]};
    --color-bollinger-400: ${themeColors.bollinger[400]};
    --color-bollinger-500: ${themeColors.bollinger[500]};
    --color-bollinger-600: ${themeColors.bollinger[600]};
    --color-bollinger-700: ${themeColors.bollinger[700]};
    --color-bollinger-800: ${themeColors.bollinger[800]};
    --color-bollinger-900: ${themeColors.bollinger[900]};
    
    /* Donchian Channels colors */
    --color-donchian-50: ${themeColors.donchian[50]};
    --color-donchian-100: ${themeColors.donchian[100]};
    --color-donchian-200: ${themeColors.donchian[200]};
    --color-donchian-300: ${themeColors.donchian[300]};
    --color-donchian-400: ${themeColors.donchian[400]};
    --color-donchian-500: ${themeColors.donchian[500]};
    --color-donchian-600: ${themeColors.donchian[600]};
    --color-donchian-700: ${themeColors.donchian[700]};
    --color-donchian-800: ${themeColors.donchian[800]};
    --color-donchian-900: ${themeColors.donchian[900]};
    
    /* Stochastic colors */
    --color-stochastic-50: ${themeColors.stochastic[50]};
    --color-stochastic-100: ${themeColors.stochastic[100]};
    --color-stochastic-200: ${themeColors.stochastic[200]};
    --color-stochastic-300: ${themeColors.stochastic[300]};
    --color-stochastic-400: ${themeColors.stochastic[400]};
    --color-stochastic-500: ${themeColors.stochastic[500]};
    --color-stochastic-600: ${themeColors.stochastic[600]};
    --color-stochastic-700: ${themeColors.stochastic[700]};
    --color-stochastic-800: ${themeColors.stochastic[800]};
    --color-stochastic-900: ${themeColors.stochastic[900]};
    
    /* Stochastic secondary colors */
    --color-stochastic-secondary-50: ${themeColors.stochasticSecondary[50]};
    --color-stochastic-secondary-100: ${themeColors.stochasticSecondary[100]};
    --color-stochastic-secondary-200: ${themeColors.stochasticSecondary[200]};
    --color-stochastic-secondary-300: ${themeColors.stochasticSecondary[300]};
    --color-stochastic-secondary-400: ${themeColors.stochasticSecondary[400]};
    --color-stochastic-secondary-500: ${themeColors.stochasticSecondary[500]};
    --color-stochastic-secondary-600: ${themeColors.stochasticSecondary[600]};
    --color-stochastic-secondary-700: ${themeColors.stochasticSecondary[700]};
    --color-stochastic-secondary-800: ${themeColors.stochasticSecondary[800]};
    --color-stochastic-secondary-900: ${themeColors.stochasticSecondary[900]};
    
    /* Support & Resistance colors (Resistance - Orange) */
    --color-supportResistance-50: ${themeColors.supportResistance[50]};
    --color-supportResistance-100: ${themeColors.supportResistance[100]};
    --color-supportResistance-200: ${themeColors.supportResistance[200]};
    --color-supportResistance-300: ${themeColors.supportResistance[300]};
    --color-supportResistance-400: ${themeColors.supportResistance[400]};
    --color-supportResistance-500: ${themeColors.supportResistance[500]};
    --color-supportResistance-600: ${themeColors.supportResistance[600]};
    --color-supportResistance-700: ${themeColors.supportResistance[700]};
    --color-supportResistance-800: ${themeColors.supportResistance[800]};
    --color-supportResistance-900: ${themeColors.supportResistance[900]};
    
    /* Support & Resistance Support colors (Support - Blue) */
    --color-supportResistanceSupport-50: ${themeColors.supportResistanceSupport[50]};
    --color-supportResistanceSupport-100: ${themeColors.supportResistanceSupport[100]};
    --color-supportResistanceSupport-200: ${themeColors.supportResistanceSupport[200]};
    --color-supportResistanceSupport-300: ${themeColors.supportResistanceSupport[300]};
    --color-supportResistanceSupport-400: ${themeColors.supportResistanceSupport[400]};
    --color-supportResistanceSupport-500: ${themeColors.supportResistanceSupport[500]};
    --color-supportResistanceSupport-600: ${themeColors.supportResistanceSupport[600]};
    --color-supportResistanceSupport-700: ${themeColors.supportResistanceSupport[700]};
    --color-supportResistanceSupport-800: ${themeColors.supportResistanceSupport[800]};
    --color-supportResistanceSupport-900: ${themeColors.supportResistanceSupport[900]};
    
    /* RSI colors */
    --color-rsi-50: ${themeColors.rsi[50]};
    --color-rsi-100: ${themeColors.rsi[100]};
    --color-rsi-200: ${themeColors.rsi[200]};
    --color-rsi-300: ${themeColors.rsi[300]};
    --color-rsi-400: ${themeColors.rsi[400]};
    --color-rsi-500: ${themeColors.rsi[500]};
    --color-rsi-600: ${themeColors.rsi[600]};
    --color-rsi-700: ${themeColors.rsi[700]};
    --color-rsi-800: ${themeColors.rsi[800]};
    --color-rsi-900: ${themeColors.rsi[900]};
    
    /* Semantic colors */
    --color-success: ${themeColors.success};
    --color-warning: ${themeColors.warning};
    --color-error: ${themeColors.error};
    --color-info: ${themeColors.info};
    
    /* Background gradients */
    --gradient-primary: linear-gradient(135deg, var(--color-dark-900) 0%, var(--color-dark-800) 50%, var(--color-dark-900) 100%);
    --gradient-primary-button: linear-gradient(90deg, var(--color-primary-500) 0%, var(--color-primary-600) 100%);
    --gradient-primary-button-hover: linear-gradient(90deg, var(--color-primary-600) 0%, var(--color-primary-700) 100%);
    --gradient-primary-button-disabled: linear-gradient(90deg, var(--color-primary-200) 0%, var(--color-primary-300) 100%);
    
    /* Glass morphism */
    --glass-bg: rgba(255, 255, 255, 0.1);
    --glass-border: rgba(255, 255, 255, 0.2);
    --glass-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.25);
  }
`;
