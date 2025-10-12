"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";
import { BalanceType } from "@quadcode-tech/client-sdk-js";
import { PauseDuration, TimeWindow } from "@/types/time";

// ============================================================================
// BREAK WARNING TYPES
// ============================================================================

export interface BreakWarningEvent {
  id: string; // unique identifier for this warning
  balance: {
    balanceId: number;
    balanceType: BalanceType;
    balanceCurrency: string;
  };
  triggerTime: number; // timestamp when warning was triggered (Date.getTime())
  timeWindow: TimeWindow; // minutes that were checked
  totalOrders: number; // total orders in time window
  lossCount: number; // number of losses that triggered the warning
  settings: {
    minOrdersRequired: number;
    lossThreshold: number;
    pauseAutoTrade: boolean;
    pauseDuration: PauseDuration;
  };
  acknowledgedAt?: number; // timestamp when user acknowledged (Date.getTime())
  expiresAt: number; // when the pause period ends (Date.getTime())
}

export interface BreakWarningState {
  // Map of balanceId -> single active warning (or null if none)
  warningsByBalance: Record<number, BreakWarningEvent | null>;
}

export interface BreakWarningActions {
  // Core actions
  recordBreakWarning: (params: {
    balance: {
      balanceId: number;
      balanceType: BalanceType;
      balanceCurrency: string;
    };
    timeWindow: 15 | 30;
    totalOrders: number;
    lossCount: number;
    settings: {
      minOrdersRequired: number;
      lossThreshold: number;
      pauseAutoTrade: boolean;
      pauseDuration: 15 | 30 | 60;
    };
    expiresAt: number;
  }) => void;

  acknowledgeWarning: (balanceId: number, warningId: string) => void;

  // Getters with computed status
  getActiveWarning: (balanceId: number) => BreakWarningEvent | null;
  getActiveWarnings: () => BreakWarningEvent[];
  removeWarning: (balanceId: number) => void;
}

export type BreakWarningStore = BreakWarningState & BreakWarningActions;

// ============================================================================
// HELPER FUNCTIONS
// ============================================================================

const generateId = (): string => {
  return `break_warning_${Date.now()}_${Math.random()
    .toString(36)
    .substr(2, 9)}`;
};

const getCurrentTimestamp = (): number => {
  return Date.now();
};

// Computed status helper functions
const isActive = (event: BreakWarningEvent): boolean => {
  const now = getCurrentTimestamp();
  return now >= event.triggerTime && now < event.expiresAt;
};

const isExpired = (event: BreakWarningEvent): boolean => {
  return getCurrentTimestamp() >= event.expiresAt;
};

const isAcknowledged = (event: BreakWarningEvent): boolean => {
  return event.acknowledgedAt !== undefined;
};

// ============================================================================
// STORE IMPLEMENTATION
// ============================================================================

export const useBreakWarningStore = create<BreakWarningStore>()(
  persist(
    (set, get) => ({
      // Initial State
      warningsByBalance: {},

      // Core actions
      recordBreakWarning: ({
        balance,
        timeWindow,
        totalOrders,
        lossCount,
        settings,
        expiresAt,
      }) => {
        const currentTimestamp = getCurrentTimestamp();

        set((state) => {
          // Only create warning if no active warning exists for this balance
          const existingWarning = state.warningsByBalance[balance.balanceId];
          if (existingWarning && isActive(existingWarning)) {
            return state; // Don't create new warning if one is already active
          }

          const newWarning: BreakWarningEvent = {
            id: generateId(),
            balance: {
              balanceId: balance.balanceId,
              balanceType: balance.balanceType,
              balanceCurrency: balance.balanceCurrency,
            },
            triggerTime: currentTimestamp,
            timeWindow,
            totalOrders,
            lossCount,
            settings,
            expiresAt,
          };

          return {
            warningsByBalance: {
              ...state.warningsByBalance,
              [balance.balanceId]: newWarning,
            },
          };
        });
      },

      acknowledgeWarning: (balanceId: number, warningId: string) => {
        set((state) => {
          const warning = state.warningsByBalance[balanceId];

          if (!warning || warning.id !== warningId) {
            return state;
          }

          return {
            warningsByBalance: {
              ...state.warningsByBalance,
              [balanceId]: {
                ...warning,
                acknowledgedAt: getCurrentTimestamp(),
              },
            },
          };
        });
      },

      // Getters with computed status
      getActiveWarning: (balanceId: number): BreakWarningEvent | null => {
        const state = get();
        const warning = state.warningsByBalance[balanceId];
        const active = warning ? isActive(warning) : false;
        if (active) {
          return warning;
        }
        return null;
      },

      getActiveWarnings: (): BreakWarningEvent[] => {
        const state = get();
        const warnings = Object.values(state.warningsByBalance).filter(
          (warning): warning is BreakWarningEvent => warning !== null
        );

        return warnings.filter(isActive);
      },

      removeWarning: (balanceId: number) => {
        set((state) => {
          return {
            warningsByBalance: {
              ...state.warningsByBalance,
              [balanceId]: null,
            },
          };
        });
      },
    }),
    {
      name: "break-warning-storage",
      partialize: (state) => ({
        warningsByBalance: state.warningsByBalance,
      }),
    }
  )
);

// ============================================================================
// EXPORTED HELPER FUNCTIONS FOR EXTERNAL USE
// ============================================================================

export { isActive, isExpired, isAcknowledged };
