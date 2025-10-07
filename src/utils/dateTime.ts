/**
 * Date and time formatting utilities
 */

/**
 * Format date and time in 24-hour format
 * @param date - The date to format
 * @returns Formatted date string in 24-hour format
 */
export function formatDateTime(date: Date | string | number): string {
  const dateObj = new Date(date);
  return dateObj.toLocaleString("en-UK", {
    year: "numeric",
    month: "numeric",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
    hour12: false,
  });
}

/**
 * Format date only (without time)
 * @param date - The date to format
 * @returns Formatted date string
 */
export function formatDate(date: Date | string | number): string {
  const dateObj = new Date(date);
  return dateObj.toLocaleDateString(undefined, {
    year: "numeric",
    month: "numeric",
    day: "numeric",
  });
}

/**
 * Format time only (without date) in 24-hour format
 * @param date - The date to format
 * @returns Formatted time string in 24-hour format
 */
export function formatTime(date: Date | string | number): string {
  const dateObj = new Date(date);
  return dateObj.toLocaleTimeString(undefined, {
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
    hour12: false,
  });
}

/**
 * Format relative time (e.g., "2 hours ago", "3 days ago")
 * @param date - The date to format
 * @returns Formatted relative time string
 */
export function formatRelativeTime(date: Date | string | number): string {
  const dateObj = new Date(date);
  const now = new Date();
  const diffInSeconds = Math.floor((now.getTime() - dateObj.getTime()) / 1000);

  if (diffInSeconds < 60) {
    return "Just now";
  }

  const diffInMinutes = Math.floor(diffInSeconds / 60);
  if (diffInMinutes < 60) {
    return `${diffInMinutes} minute${diffInMinutes === 1 ? "" : "s"} ago`;
  }

  const diffInHours = Math.floor(diffInMinutes / 60);
  if (diffInHours < 24) {
    return `${diffInHours} hour${diffInHours === 1 ? "" : "s"} ago`;
  }

  const diffInDays = Math.floor(diffInHours / 24);
  if (diffInDays < 7) {
    return `${diffInDays} day${diffInDays === 1 ? "" : "s"} ago`;
  }

  const diffInWeeks = Math.floor(diffInDays / 7);
  if (diffInWeeks < 4) {
    return `${diffInWeeks} week${diffInWeeks === 1 ? "" : "s"} ago`;
  }

  const diffInMonths = Math.floor(diffInDays / 30);
  if (diffInMonths < 12) {
    return `${diffInMonths} month${diffInMonths === 1 ? "" : "s"} ago`;
  }

  const diffInYears = Math.floor(diffInDays / 365);
  return `${diffInYears} year${diffInYears === 1 ? "" : "s"} ago`;
}

export function checkSameDay(date1: Date, date2: Date): boolean {
  return (
    date1.getFullYear() === date2.getFullYear() &&
    date1.getMonth() === date2.getMonth() &&
    date1.getDate() === date2.getDate()
  );
}

export function checkDayDifference(date1: Date, date2: Date): number {
  const dateWithoutTime = new Date(
    date1.getFullYear(),
    date1.getMonth(),
    date1.getDate()
  );
  const date2WithoutTime = new Date(
    date2.getFullYear(),
    date2.getMonth(),
    date2.getDate()
  );
  return dateWithoutTime.getTime() - date2WithoutTime.getTime();
}
