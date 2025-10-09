export interface SubscriptionStatus {
  isExpired: boolean;
  isExpiringSoon: boolean;
  daysRemaining: number;
}

/**
 * Calculates subscription status based on expiration date
 */
export function calculateSubscriptionStatus(
  expiredAt: string
): SubscriptionStatus {
  const expirationDate = new Date(expiredAt);
  const now = new Date();
  const diffTime = expirationDate.getTime() - now.getTime();
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

  return {
    isExpired: diffDays < 0,
    isExpiringSoon: diffDays <= 7,
    daysRemaining: diffDays,
  };
}

/**
 * Gets CSS classes for subscription status styling
 */
export function getSubscriptionStatusColor(status: SubscriptionStatus): string {
  if (status.isExpired) return "text-red-500 bg-red-50 border-red-200";
  if (status.isExpiringSoon)
    return "text-orange-500 bg-orange-50 border-orange-200";
  return "text-green-900 bg-green-50 border-green-200";
}

/**
 * Gets CSS classes for subscription status dot indicator
 */
export function getSubscriptionDotColor(status: SubscriptionStatus): string {
  if (status.isExpired) return "bg-red-500";
  if (status.isExpiringSoon) return "bg-orange-500";
  return "bg-green-500";
}

/**
 * Gets translation key for subscription status
 */
export function getSubscriptionStatusKey(status: SubscriptionStatus): string {
  if (status.isExpired) return "expired";
  if (status.isExpiringSoon) return "expiringSoon";
  return "active";
}
