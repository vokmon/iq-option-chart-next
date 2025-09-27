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
