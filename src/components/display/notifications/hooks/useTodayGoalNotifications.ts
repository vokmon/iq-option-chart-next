"use client";

import { useMemo } from "react";
import { useGoalFulfillmentStore } from "@/stores/notifications/goalFulfillmentStore";
import { formatDate } from "@/utils/dateTime";

export function useTodayGoalNotifications() {
  const { fulfillmentsByBalance } = useGoalFulfillmentStore();

  const todayNotifications = useMemo(() => {
    const allFulfillments = Object.values(fulfillmentsByBalance || {});
    const today = formatDate(new Date());

    // Filter for today's notifications (both acknowledged and unacknowledged)
    const todayFulfillments = allFulfillments.filter(
      (fulfillment) => fulfillment?.date === today
    );
    // Sort by creation time (newest first)
    return todayFulfillments.sort((a, b) => {
      const bCreatedAt = b?.createdAt ?? 0;
      const aCreatedAt = a?.createdAt ?? 0;
      return bCreatedAt - aCreatedAt;
    });
  }, [fulfillmentsByBalance]);

  const hasNotifications = todayNotifications.length > 0;

  return {
    todayNotifications,
    hasNotifications,
  };
}
