/**
 * Balance type utility functions
 */

/**
 * Get color for balance type badge
 * @param type - The balance type string
 * @returns Mantine color string
 */
export function getBalanceTypeColor(type: string): string {
  switch (type) {
    case "real":
      return "green";
    case "demo":
      return "orange";
    default:
      return "gray";
  }
}

/**
 * Get label for balance type badge
 * @param type - The balance type string
 * @returns Display label string
 */
export function getBalanceTypeLabel(type: string): string {
  switch (type) {
    case "real":
      return "Real";
    case "demo":
      return "Practice";
    default:
      return "Unknown";
  }
}
