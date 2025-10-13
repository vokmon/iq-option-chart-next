"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";
import { formatDate } from "@/utils/dateTime";
import { BalanceType } from "@quadcode-tech/client-sdk-js";

// ============================================================================
// TYPES
// ============================================================================

export interface DailyBalanceSnapshot {
  balanceId: number;
  startingAmount: number;
  currency: string;
  type: BalanceType;
  date: string; // YYYY-MM-DD format
  timestamp: number; // When snapshot was captured
}

export interface DailyBalanceState {
  // Map of balanceId -> snapshot for current day
  balanceSnapshots: Record<string, DailyBalanceSnapshot>;
}

interface CaptureSnapshotParams {
  balanceId: number;
  amount: number;
  currency: string;
  type: BalanceType;
}

export interface DailyBalanceActions {
  // Core actions
  captureSnapshot: ({
    balanceId,
    amount,
    currency,
    type,
  }: CaptureSnapshotParams) => void;

  // Getters
  getStartingBalance: (balanceId: number) => DailyBalanceSnapshot | null;
  getAllSnapshots: () => DailyBalanceSnapshot[];
  hasSnapshotForToday: (balanceId: number) => boolean;
}

export type DailyBalanceStore = DailyBalanceState & DailyBalanceActions;

// ============================================================================
// HELPER FUNCTIONS
// ============================================================================

const getCurrentDate = (): string => {
  return formatDate(new Date());
};

const getCurrentTimestamp = (): number => {
  return Date.now();
};

// ============================================================================
// STORE IMPLEMENTATION
// ============================================================================

export const useDailyBalanceStore = create<DailyBalanceStore>()(
  persist(
    (set, get) => ({
      // Initial State
      balanceSnapshots: {},

      // Core actions
      captureSnapshot: ({
        balanceId,
        amount,
        currency,
        type,
      }: CaptureSnapshotParams) => {
        const currentDate = getCurrentDate();
        const currentTimestamp = getCurrentTimestamp();

        set((state) => {
          const key = balanceId.toString();
          const existingSnapshot = state.balanceSnapshots[key];

          // Only capture if no snapshot exists or it's from a different day
          if (!existingSnapshot || existingSnapshot.date !== currentDate) {
            const newSnapshot: DailyBalanceSnapshot = {
              balanceId,
              startingAmount: amount,
              currency,
              type,
              date: currentDate,
              timestamp: currentTimestamp,
            };

            return {
              balanceSnapshots: {
                ...state.balanceSnapshots,
                [key]: newSnapshot,
              },
            };
          }

          return state;
        });
      },

      // Getters
      getStartingBalance: (balanceId: number) => {
        const state = get();
        const key = balanceId.toString();
        const snapshot = state.balanceSnapshots[key];

        // Return snapshot only if it's from today
        if (snapshot && snapshot.date === getCurrentDate()) {
          return snapshot;
        }

        return null;
      },

      getAllSnapshots: () => {
        const state = get();
        const currentDate = getCurrentDate();

        return Object.values(state.balanceSnapshots).filter(
          (snapshot) => snapshot.date === currentDate
        );
      },

      hasSnapshotForToday: (balanceId: number) => {
        const state = get();
        const key = balanceId.toString();
        const snapshot = state.balanceSnapshots[key];

        return snapshot ? snapshot.date === getCurrentDate() : false;
      },
    }),
    {
      name: "daily-balance-storage",
      partialize: (state) => ({
        balanceSnapshots: state.balanceSnapshots,
      }),
    }
  )
);
