"use client";

import { useEffect } from "react";
import { useThemeStore } from "../../stores/themeStore";
import { themes } from "../../theme/themes";

export function ThemeCSSInjector() {
  const currentTheme = useThemeStore((state) => state.currentTheme);

  useEffect(() => {
    const theme = themes[currentTheme];
    if (!theme) return;

    const root = document.documentElement;

    // Update Bollinger Bands colors
    root.style.setProperty("--color-bollinger-50", theme.colors.bollinger[50]);
    root.style.setProperty(
      "--color-bollinger-100",
      theme.colors.bollinger[100]
    );
    root.style.setProperty(
      "--color-bollinger-200",
      theme.colors.bollinger[200]
    );
    root.style.setProperty(
      "--color-bollinger-300",
      theme.colors.bollinger[300]
    );
    root.style.setProperty(
      "--color-bollinger-400",
      theme.colors.bollinger[400]
    );
    root.style.setProperty(
      "--color-bollinger-500",
      theme.colors.bollinger[500]
    );
    root.style.setProperty(
      "--color-bollinger-600",
      theme.colors.bollinger[600]
    );
    root.style.setProperty(
      "--color-bollinger-700",
      theme.colors.bollinger[700]
    );
    root.style.setProperty(
      "--color-bollinger-800",
      theme.colors.bollinger[800]
    );
    root.style.setProperty(
      "--color-bollinger-900",
      theme.colors.bollinger[900]
    );

    // Update Donchian Channels colors
    root.style.setProperty("--color-donchian-50", theme.colors.donchian[50]);
    root.style.setProperty("--color-donchian-100", theme.colors.donchian[100]);
    root.style.setProperty("--color-donchian-200", theme.colors.donchian[200]);
    root.style.setProperty("--color-donchian-300", theme.colors.donchian[300]);
    root.style.setProperty("--color-donchian-400", theme.colors.donchian[400]);
    root.style.setProperty("--color-donchian-500", theme.colors.donchian[500]);
    root.style.setProperty("--color-donchian-600", theme.colors.donchian[600]);
    root.style.setProperty("--color-donchian-700", theme.colors.donchian[700]);
    root.style.setProperty("--color-donchian-800", theme.colors.donchian[800]);
    root.style.setProperty("--color-donchian-900", theme.colors.donchian[900]);

    // Update Stochastic colors
    root.style.setProperty(
      "--color-stochastic-50",
      theme.colors.stochastic[50]
    );
    root.style.setProperty(
      "--color-stochastic-100",
      theme.colors.stochastic[100]
    );
    root.style.setProperty(
      "--color-stochastic-200",
      theme.colors.stochastic[200]
    );
    root.style.setProperty(
      "--color-stochastic-300",
      theme.colors.stochastic[300]
    );
    root.style.setProperty(
      "--color-stochastic-400",
      theme.colors.stochastic[400]
    );
    root.style.setProperty(
      "--color-stochastic-500",
      theme.colors.stochastic[500]
    );
    root.style.setProperty(
      "--color-stochastic-600",
      theme.colors.stochastic[600]
    );
    root.style.setProperty(
      "--color-stochastic-700",
      theme.colors.stochastic[700]
    );
    root.style.setProperty(
      "--color-stochastic-800",
      theme.colors.stochastic[800]
    );
    root.style.setProperty(
      "--color-stochastic-900",
      theme.colors.stochastic[900]
    );

    // Update Stochastic Secondary colors (using the naming convention expected by charts)
    root.style.setProperty(
      "--color-stochastic-secondary-50",
      theme.colors.stochasticSecondary[50]
    );
    root.style.setProperty(
      "--color-stochastic-secondary-100",
      theme.colors.stochasticSecondary[100]
    );
    root.style.setProperty(
      "--color-stochastic-secondary-200",
      theme.colors.stochasticSecondary[200]
    );
    root.style.setProperty(
      "--color-stochastic-secondary-300",
      theme.colors.stochasticSecondary[300]
    );
    root.style.setProperty(
      "--color-stochastic-secondary-400",
      theme.colors.stochasticSecondary[400]
    );
    root.style.setProperty(
      "--color-stochastic-secondary-500",
      theme.colors.stochasticSecondary[500]
    );
    root.style.setProperty(
      "--color-stochastic-secondary-600",
      theme.colors.stochasticSecondary[600]
    );
    root.style.setProperty(
      "--color-stochastic-secondary-700",
      theme.colors.stochasticSecondary[700]
    );
    root.style.setProperty(
      "--color-stochastic-secondary-800",
      theme.colors.stochasticSecondary[800]
    );
    root.style.setProperty(
      "--color-stochastic-secondary-900",
      theme.colors.stochasticSecondary[900]
    );

    // Update Support & Resistance colors (Resistance - Green)
    root.style.setProperty(
      "--color-supportResistance-50",
      theme.colors.supportResistance[50]
    );
    root.style.setProperty(
      "--color-supportResistance-100",
      theme.colors.supportResistance[100]
    );
    root.style.setProperty(
      "--color-supportResistance-200",
      theme.colors.supportResistance[200]
    );
    root.style.setProperty(
      "--color-supportResistance-300",
      theme.colors.supportResistance[300]
    );
    root.style.setProperty(
      "--color-supportResistance-400",
      theme.colors.supportResistance[400]
    );
    root.style.setProperty(
      "--color-supportResistance-500",
      theme.colors.supportResistance[500]
    );
    root.style.setProperty(
      "--color-supportResistance-600",
      theme.colors.supportResistance[600]
    );
    root.style.setProperty(
      "--color-supportResistance-700",
      theme.colors.supportResistance[700]
    );
    root.style.setProperty(
      "--color-supportResistance-800",
      theme.colors.supportResistance[800]
    );
    root.style.setProperty(
      "--color-supportResistance-900",
      theme.colors.supportResistance[900]
    );

    // Update Support & Resistance Support colors (Support - Red)
    root.style.setProperty(
      "--color-supportResistanceSupport-50",
      theme.colors["supportResistanceSupport" as keyof typeof theme.colors][50]
    );
    root.style.setProperty(
      "--color-supportResistanceSupport-100",
      theme.colors["supportResistanceSupport" as keyof typeof theme.colors][100]
    );
    root.style.setProperty(
      "--color-supportResistanceSupport-200",
      theme.colors["supportResistanceSupport" as keyof typeof theme.colors][200]
    );
    root.style.setProperty(
      "--color-supportResistanceSupport-300",
      theme.colors["supportResistanceSupport" as keyof typeof theme.colors][300]
    );
    root.style.setProperty(
      "--color-supportResistanceSupport-400",
      theme.colors["supportResistanceSupport" as keyof typeof theme.colors][400]
    );
    root.style.setProperty(
      "--color-supportResistanceSupport-500",
      theme.colors["supportResistanceSupport" as keyof typeof theme.colors][500]
    );
    root.style.setProperty(
      "--color-supportResistanceSupport-600",
      theme.colors["supportResistanceSupport" as keyof typeof theme.colors][600]
    );
    root.style.setProperty(
      "--color-supportResistanceSupport-700",
      theme.colors["supportResistanceSupport" as keyof typeof theme.colors][700]
    );
    root.style.setProperty(
      "--color-supportResistanceSupport-800",
      theme.colors["supportResistanceSupport" as keyof typeof theme.colors][800]
    );
    root.style.setProperty(
      "--color-supportResistanceSupport-900",
      theme.colors["supportResistanceSupport" as keyof typeof theme.colors][900]
    );

    // Update RSI colors
    root.style.setProperty("--color-rsi-50", theme.colors.rsi[50]);
    root.style.setProperty("--color-rsi-100", theme.colors.rsi[100]);
    root.style.setProperty("--color-rsi-200", theme.colors.rsi[200]);
    root.style.setProperty("--color-rsi-300", theme.colors.rsi[300]);
    root.style.setProperty("--color-rsi-400", theme.colors.rsi[400]);
    root.style.setProperty("--color-rsi-500", theme.colors.rsi[500]);
    root.style.setProperty("--color-rsi-600", theme.colors.rsi[600]);
    root.style.setProperty("--color-rsi-700", theme.colors.rsi[700]);
    root.style.setProperty("--color-rsi-800", theme.colors.rsi[800]);
    root.style.setProperty("--color-rsi-900", theme.colors.rsi[900]);

    // Update other theme colors
    root.style.setProperty("--color-primary-50", theme.colors.primary[50]);
    root.style.setProperty("--color-primary-100", theme.colors.primary[100]);
    root.style.setProperty("--color-primary-200", theme.colors.primary[200]);
    root.style.setProperty("--color-primary-300", theme.colors.primary[300]);
    root.style.setProperty("--color-primary-400", theme.colors.primary[400]);
    root.style.setProperty("--color-primary-500", theme.colors.primary[500]);
    root.style.setProperty("--color-primary-600", theme.colors.primary[600]);
    root.style.setProperty("--color-primary-700", theme.colors.primary[700]);
    root.style.setProperty("--color-primary-800", theme.colors.primary[800]);
    root.style.setProperty("--color-primary-900", theme.colors.primary[900]);

    root.style.setProperty("--color-accent-50", theme.colors.accent[50]);
    root.style.setProperty("--color-accent-100", theme.colors.accent[100]);
    root.style.setProperty("--color-accent-200", theme.colors.accent[200]);
    root.style.setProperty("--color-accent-300", theme.colors.accent[300]);
    root.style.setProperty("--color-accent-400", theme.colors.accent[400]);
    root.style.setProperty("--color-accent-500", theme.colors.accent[500]);
    root.style.setProperty("--color-accent-600", theme.colors.accent[600]);
    root.style.setProperty("--color-accent-700", theme.colors.accent[700]);
    root.style.setProperty("--color-accent-800", theme.colors.accent[800]);
    root.style.setProperty("--color-accent-900", theme.colors.accent[900]);

    // Update semantic colors
    root.style.setProperty("--color-success", theme.colors.success);
    root.style.setProperty("--color-warning", theme.colors.warning);
    root.style.setProperty("--color-error", theme.colors.error);
    root.style.setProperty("--color-info", theme.colors.info);

    // Update gradients
    root.style.setProperty(
      "--gradient-primary",
      `linear-gradient(135deg, ${theme.colors.dark[900]} 0%, ${theme.colors.dark[800]} 50%, ${theme.colors.dark[900]} 100%)`
    );
    root.style.setProperty(
      "--gradient-primary-button",
      `linear-gradient(90deg, ${theme.colors.primary[500]} 0%, ${theme.colors.primary[600]} 100%)`
    );
    root.style.setProperty(
      "--gradient-primary-button-hover",
      `linear-gradient(90deg, ${theme.colors.primary[600]} 0%, ${theme.colors.primary[700]} 100%)`
    );
    root.style.setProperty(
      "--gradient-primary-button-disabled",
      `linear-gradient(90deg, ${theme.colors.primary[200]} 0%, ${theme.colors.primary[300]} 100%)`
    );
  }, [currentTheme]);

  return null; // This component doesn't render anything
}
