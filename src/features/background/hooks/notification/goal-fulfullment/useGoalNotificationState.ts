"use client";

import { useState, useEffect, useRef } from "react";
import {
  BalanceGoalFulfillment,
  useGoalFulfillmentStore,
} from "@/stores/notifications/goalFulfillmentStore";
import { GoalFulfillmentType } from "@/stores/notifications/goalFulfillmentStore";
import { formatDate } from "@/utils/dateTime";

export function useGoalNotificationState() {
  const { getAllFulfillments, hasUnacknowledgedFulfillment } =
    useGoalFulfillmentStore();

  const [isProfitModalOpen, setIsProfitModalOpen] = useState(false);
  const [isLossModalOpen, setIsLossModalOpen] = useState(false);
  const hasUnacknowledgedRef = useRef(false);
  const profitFulfillmentsRef = useRef<BalanceGoalFulfillment[]>([]);
  const lossFulfillmentsRef = useRef<BalanceGoalFulfillment[]>([]);
  const unacknowledgedFulfillmentsRef = useRef<BalanceGoalFulfillment[]>([]);

  useEffect(() => {
    const today = formatDate(new Date());
    const fulfillments = getAllFulfillments();
    const hasUnacknowledged = hasUnacknowledgedFulfillment();

    const unacknowledgedFulfillments = fulfillments.filter(
      (f) => !f.acknowledged && f.date === today
    );

    const profitFulfillments = unacknowledgedFulfillments.filter(
      (f) => f.type === GoalFulfillmentType.PROFIT
    );
    const lossFulfillments = unacknowledgedFulfillments.filter(
      (f) => f.type === GoalFulfillmentType.LOSS
    );

    hasUnacknowledgedRef.current = hasUnacknowledged;
    profitFulfillmentsRef.current = profitFulfillments;
    lossFulfillmentsRef.current = lossFulfillments;
    unacknowledgedFulfillmentsRef.current = unacknowledgedFulfillments;

    if (hasUnacknowledged) {
      if (profitFulfillments.length > 0) {
        setIsProfitModalOpen(true);
      }
      if (lossFulfillments.length > 0) {
        setIsLossModalOpen(true);
      }
    }
  }, [getAllFulfillments, hasUnacknowledgedFulfillment]);

  return {
    isProfitModalOpen,
    setIsProfitModalOpen,
    isLossModalOpen,
    setIsLossModalOpen,
    hasUnacknowledged: hasUnacknowledgedRef.current,
    unacknowledgedFulfillments: unacknowledgedFulfillmentsRef.current,
    profitFulfillments: profitFulfillmentsRef.current,
    lossFulfillments: lossFulfillmentsRef.current,
  };
}
