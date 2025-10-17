"use client";

import { useEffect } from "react";
import { useMartingaleOrderStore } from "@/stores/martingale/martingaleOrderStore";

export const useMartingaleCleanup = () => {
  const { cleanupExpiredChains } = useMartingaleOrderStore();

  useEffect(() => {
    // SAFEGUARD 2: Run cleanup immediately
    const runCleanup = () => {
      const { removedChains, removedOrders } = cleanupExpiredChains();
      if (removedChains > 0 || removedOrders > 0) {
        console.log(
          `Cleaned up ${removedChains} expired martingale chains and ${removedOrders} orders`
        );
      }
    };

    // Run cleanup immediately
    runCleanup();

    // Set up interval for periodic cleanup
    const interval = setInterval(runCleanup, 60 * 60 * 1000);

    return () => {
      cleanupExpiredChains();
      clearInterval(interval);
    };
  }, [cleanupExpiredChains]);
};
