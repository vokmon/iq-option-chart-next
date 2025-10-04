/**
 * Get indicator colors from CSS custom properties
 */

/**
 * Get Bollinger Bands colors
 */
export function getBollingerColors() {
  if (typeof window === "undefined") {
    // Fallback colors for SSR
    return {
      primary: "#42a5f5",
      secondary: "#90caf9",
    };
  }

  const computedStyle = getComputedStyle(document.documentElement);
  return {
    primary:
      computedStyle.getPropertyValue("--color-bollinger-400").trim() ||
      "#42a5f5",
    secondary:
      computedStyle.getPropertyValue("--color-bollinger-200").trim() ||
      "#90caf9",
  };
}

/**
 * Get Donchian Channels colors
 */
export function getDonchianColors() {
  if (typeof window === "undefined") {
    // Fallback colors for SSR
    return {
      primary: "#ab47bc",
      secondary: "#ce93d8",
    };
  }

  const computedStyle = getComputedStyle(document.documentElement);
  return {
    primary:
      computedStyle.getPropertyValue("--color-donchian-400").trim() ||
      "#ab47bc",
    secondary:
      computedStyle.getPropertyValue("--color-donchian-200").trim() ||
      "#ce93d8",
  };
}

/**
 * Get Stochastic Oscillator colors
 */
export function getStochasticColors() {
  if (typeof window === "undefined") {
    // Fallback colors for SSR
    return {
      k: "#ff6b6b",
      d: "#4ecdc4",
      upper: "#00c851",
      lower: "#ff4444",
    };
  }

  const computedStyle = getComputedStyle(document.documentElement);
  const kColor = computedStyle
    .getPropertyValue("--color-stochastic-400")
    .trim();
  const dColor = computedStyle
    .getPropertyValue("--color-stochastic-secondary-400")
    .trim();

  return {
    k: kColor || "#ff6b6b",
    d: dColor || "#4ecdc4",
    upper: "#00c851", // Green for overbought (80)
    lower: "#ff4444", // Red for oversold (20)
  };
}

/**
 * Get Support & Resistance colors
 */
export function getSupportResistanceColors() {
  if (typeof window === "undefined") {
    // Fallback colors for SSR
    return {
      resistance: "#10b981", // Green for resistance (upper)
      support: "#ef4444", // Red for support (lower)
    };
  }

  const computedStyle = getComputedStyle(document.documentElement);
  return {
    resistance:
      computedStyle.getPropertyValue("--color-supportResistance-400").trim() ||
      "#10b981", // Green for resistance (upper)
    support:
      computedStyle
        .getPropertyValue("--color-supportResistanceSupport-400")
        .trim() || "#ef4444", // Red for support (lower)
  };
}

/**
 * Get RSI colors
 */
export function getRSIColors() {
  if (typeof window === "undefined") {
    // Fallback colors for SSR
    return {
      primary: "#9c27b0",
      overbought: "#ff4444", // Red for overbought (70+)
      oversold: "#00c851", // Green for oversold (30-)
    };
  }

  const computedStyle = getComputedStyle(document.documentElement);
  return {
    primary:
      computedStyle.getPropertyValue("--color-rsi-400").trim() || "#9c27b0",
    overbought: "#ff4444", // Red for overbought (70+)
    oversold: "#00c851", // Green for oversold (30-)
  };
}
