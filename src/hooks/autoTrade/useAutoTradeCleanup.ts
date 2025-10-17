"use client";

import { useEffect } from "react";
import { useAutoTradeOrdersStore } from "@/stores/autoTrade/autoTradeOrdersStore";

export const useAutoTradeCleanup = () => {
  const { cleanupExpiredOrders } = useAutoTradeOrdersStore();

  useEffect(() => {
    // SAFEGUARD 2: Run cleanup immediately
    const runCleanup = () => {
      const { removed } = cleanupExpiredOrders();
      if (removed > 0) {
        console.log(`Cleaned up ${removed} expired auto-trade orders`);
      }
    };

    // Run cleanup immediately
    runCleanup();

    // Set up interval for periodic cleanup
    const interval = setInterval(runCleanup, 60 * 60 * 1000);

    return () => {
      cleanupExpiredOrders();
      clearInterval(interval);
    };
  }, [cleanupExpiredOrders]);
};
