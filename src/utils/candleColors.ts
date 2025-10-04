// Supported candle sizes
export const CANDLE_SIZES = [60, 300, 900, 3600, 14400, 86400] as const;
export type CandleSize = (typeof CANDLE_SIZES)[number];

// Simple color mapping for candle sizes
const CANDLE_COLOR_MAP = {
  60: "#f87171", // 1m - red
  300: "#38bdf8", // 5m - blue
  900: "#10b981", // 15m - green
  3600: "#f59e0b", // 1hr - amber
  14400: "#8b5cf6", // 4hr - violet
  86400: "#ec4899", // 1day - pink
} as const;

/**
 * Get display label for candle size
 */
export function getCandleSizeLabel(candleSize: number): string {
  const minutes = candleSize / 60;
  const hours = minutes / 60;
  const days = hours / 24;

  if (days >= 1) return `${days}day`;
  if (hours >= 1) return `${hours}hr`;
  return `${minutes}min`;
}

/**
 * Get candle color (simplified - no theme dependency)
 */
export function getCandleColor(candleSize: number): string {
  return CANDLE_COLOR_MAP[candleSize as CandleSize] || "#64748b";
}

/**
 * Check if candle size is supported
 */
export function isCandleSizeSupported(candleSize: number): boolean {
  return candleSize in CANDLE_COLOR_MAP;
}

/**
 * Get all supported candle sizes
 */
export function getSupportedCandleSizes(): CandleSize[] {
  return [...CANDLE_SIZES];
}

/**
 * Get candle color (alias for consistency)
 */
export function getCandleSizeColor(candleSize: number): string {
  return getCandleColor(candleSize);
}
