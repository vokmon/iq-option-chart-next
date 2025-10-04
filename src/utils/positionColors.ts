/**
 * Get position colors for trading directions
 */

/**
 * Get position color based on direction using theme colors
 */
export function getPositionColor(direction: string | undefined): string {
  if (typeof window === "undefined") {
    // Fallback colors for SSR
    return getPositionColorFallback(direction);
  }

  const computedStyle = getComputedStyle(document.documentElement);

  switch (direction?.toLowerCase()) {
    case "call":
    case "buy":
      return (
        computedStyle.getPropertyValue("--mantine-color-green-6").trim() ||
        "#22c55e"
      );
    case "put":
    case "sell":
      return (
        computedStyle.getPropertyValue("--mantine-color-red-6").trim() ||
        "#f87171"
      );
    default:
      return (
        computedStyle.getPropertyValue("--mantine-color-gray-6").trim() ||
        "#64748b"
      );
  }
}

/**
 * Fallback colors for SSR or when CSS variables are not available
 */
function getPositionColorFallback(direction: string | undefined): string {
  switch (direction?.toLowerCase()) {
    case "call":
    case "buy":
      return "#22c55e"; // Green for CALL/BUY (matches UI buttons)
    case "put":
    case "sell":
      return "#f87171"; // Red for PUT/SELL (matches UI buttons)
    default:
      return "#64748b"; // Gray for unknown
  }
}
