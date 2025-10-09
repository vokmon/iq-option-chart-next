import { useMemo } from "react";
import { User } from "@/types/user";
import {
  calculateSubscriptionStatus,
  getSubscriptionStatusColor,
  getSubscriptionDotColor,
  getSubscriptionStatusKey,
} from "@/utils/subscriptionStatus";

export interface SubscriptionExpireState {
  isExpired: boolean;
  isExpiringSoon: boolean;
  daysRemaining: number;
  expiredAt: Date;
  statusColor: string;
  dotColor: string;
  statusKey: string; // Translation key for the status
}

export function useSubscriptionExpire(
  user?: User
): SubscriptionExpireState | null {
  return useMemo(() => {
    if (!user) return null;

    const status = calculateSubscriptionStatus(user.expiredAt);
    const expiredAt = new Date(user.expiredAt);

    return {
      isExpired: status.isExpired,
      isExpiringSoon: status.isExpiringSoon,
      daysRemaining: status.daysRemaining,
      expiredAt,
      statusColor: getSubscriptionStatusColor(status),
      dotColor: getSubscriptionDotColor(status),
      statusKey: getSubscriptionStatusKey(status),
    };
  }, [user]);
}
