"use client";

import { useState, useEffect } from "react";
import { useGoalFulfillmentStore } from "@/stores/notifications/goalFulfillmentStore";
import { GoalFulfillmentType } from "@/stores/notifications/goalFulfillmentStore";

export function useGoalNotificationState() {
  const { getAllFulfillments, hasUnacknowledgedFulfillment } =
    useGoalFulfillmentStore();

  const [isProfitModalOpen, setIsProfitModalOpen] = useState(false);
  const [isLossModalOpen, setIsLossModalOpen] = useState(false);

  const fulfillments = getAllFulfillments();
  const hasUnacknowledged = hasUnacknowledgedFulfillment();

  const unacknowledgedFulfillments = fulfillments.filter(
    (f) => !f.acknowledged
  );

  const profitFulfillments = unacknowledgedFulfillments.filter(
    (f) => f.type === GoalFulfillmentType.PROFIT
  );
  const lossFulfillments = unacknowledgedFulfillments.filter(
    (f) => f.type === GoalFulfillmentType.LOSS
  );

  useEffect(() => {
    if (hasUnacknowledged) {
      if (profitFulfillments.length > 0) {
        setIsProfitModalOpen(true);
      }
      if (lossFulfillments.length > 0) {
        setIsLossModalOpen(true);
      }
    }
  }, [hasUnacknowledged, profitFulfillments.length, lossFulfillments.length]);

  return {
    isProfitModalOpen,
    setIsProfitModalOpen,
    isLossModalOpen,
    setIsLossModalOpen,
    hasUnacknowledged,
    unacknowledgedFulfillments,
    profitFulfillments,
    lossFulfillments,
  };
}
