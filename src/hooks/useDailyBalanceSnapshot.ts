"use client";

import { useEffect, useCallback, useRef } from "react";
import { useSdk } from "./useSdk";
import { useDailyBalanceStore } from "@/stores/dailyBalanceStore";
import { formatDate } from "@/utils/dateTime";
import { BalanceType } from "@quadcode-tech/client-sdk-js";

/**
 * Hook to automatically capture daily balance snapshots
 *
 * Features:
 * - Captures balance at start of each day (midnight)
 * - Handles app running continuously across multiple days
 * - Uses setTimeout for efficient midnight detection
 * - Falls back to visibility events for reliability
 *
 * Usage: Call once at app initialization level
 */
export function useDailyBalanceSnapshot() {
  const { sdk } = useSdk();
  const midnightTimeoutRef = useRef<NodeJS.Timeout | undefined>(undefined);

  const { captureSnapshot, getStartingBalance } = useDailyBalanceStore();

  /**
   * Calculate milliseconds until next midnight (00:00:00)
   */
  const getMsUntilNextMidnight = useCallback(() => {
    const now = new Date();
    const tomorrow = new Date(now);
    tomorrow.setDate(tomorrow.getDate() + 1);
    tomorrow.setHours(0, 0, 0, 0); // Set to midnight

    return tomorrow.getTime() - now.getTime();
  }, []);

  /**
   * Check if we need to capture new snapshots for today
   */
  const checkForNewDay = useCallback(async () => {
    const today = formatDate(new Date());

    try {
      const balancesData = await sdk.balances();
      const balances = balancesData.getBalances();

      if (balances.length === 0) {
        return;
      }

      for (const balance of balances) {
        const existingSnapshot = getStartingBalance(balance.id);

        // Capture snapshot if:
        // 1. No snapshot exists for this balance, OR
        // 2. Existing snapshot is from a different day
        if (!existingSnapshot || existingSnapshot.date !== today) {
          captureSnapshot({
            balanceId: balance.id,
            amount: balance.amount,
            currency: balance.currency,
            type: balance.type as BalanceType,
          });
        }
      }
    } catch (error) {
      console.error("Failed to check for new day snapshots:", error);
    }
  }, [sdk, captureSnapshot, getStartingBalance]);

  /**
   * Schedule the next midnight check using setTimeout
   */
  const scheduleNextMidnightCheck = useCallback(() => {
    // Clear existing timeout if any
    if (midnightTimeoutRef.current) {
      clearTimeout(midnightTimeoutRef.current);
    }

    const msUntilMidnight = getMsUntilNextMidnight();

    midnightTimeoutRef.current = setTimeout(() => {
      checkForNewDay();
      scheduleNextMidnightCheck(); // Schedule next day
    }, msUntilMidnight);
  }, [getMsUntilNextMidnight, checkForNewDay]);

  /**
   * Main effect: Set up snapshot capture system
   */
  useEffect(() => {
    // 1. Initial check on mount
    checkForNewDay();

    // 2. Schedule midnight timer
    scheduleNextMidnightCheck();

    // 3. Safety net: Check when tab becomes visible
    // (Handles cases where timer was throttled by browser)
    const handleVisibilityChange = () => {
      if (document.visibilityState === "visible") {
        checkForNewDay();
        scheduleNextMidnightCheck(); // Reschedule in case timer was affected
      }
    };
    document.addEventListener("visibilitychange", handleVisibilityChange);

    // 4. Safety net: Check when window gains focus
    // (Additional backup for app resume scenarios)
    const handleFocus = () => {
      checkForNewDay();
    };
    window.addEventListener("focus", handleFocus);

    // Cleanup
    return () => {
      if (midnightTimeoutRef.current) {
        clearTimeout(midnightTimeoutRef.current);
      }
      document.removeEventListener("visibilitychange", handleVisibilityChange);
      window.removeEventListener("focus", handleFocus);
    };
  }, [checkForNewDay, scheduleNextMidnightCheck]);

  // This is a background hook, no UI to return
  return null;
}
