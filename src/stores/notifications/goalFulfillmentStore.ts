"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";
import { formatDate } from "@/utils/dateTime";
import { BalanceType } from "@quadcode-tech/client-sdk-js";

// ============================================================================
// GOAL FULFILLMENT TYPES
// ============================================================================

export enum GoalFulfillmentType {
  PROFIT = "profit",
  LOSS = "loss",
}

export interface BalanceGoalFulfillment {
  id: string; // unique identifier for this fulfillment
  balance: {
    balanceId: number;
    balanceType: BalanceType;
    balanceCurrency: string;
  };
  type: GoalFulfillmentType; // whether it's profit target or loss limit reached
  targetValue: number; // the original target/limit value set by user
  actualValue: number; // the actual profit/loss amount when goal was reached
  date: string; // date without time (YYYY-MM-DD format)
  acknowledged: boolean; // user acknowledgment flag
  createdAt: number; // timestamp when goal was reached (Date.getTime())
  acknowledgedAt?: number; // timestamp when user acknowledged (Date.getTime())
}

export interface GoalFulfillmentState {
  // Map of balanceId -> fulfillment for current day
  // Only one fulfillment per balance per day per type
  fulfillmentsByBalance: Record<string, BalanceGoalFulfillment | null>;
}

export interface GoalFulfillmentActions {
  // Core actions
  recordGoalFulfillment: (params: {
    balance: {
      balanceId: number;
      balanceType: BalanceType;
      balanceCurrency: string;
    };
    type: GoalFulfillmentType;
    actualValue: number;
    targetValue: number;
  }) => void;

  acknowledgeFulfillment: (balanceId: string, fulfillmentId: string) => void;

  // Getters
  getFulfillmentForBalance: (
    balanceId: string
  ) => BalanceGoalFulfillment | null;
  getAllFulfillments: () => BalanceGoalFulfillment[];
  hasUnacknowledgedFulfillment: (balanceId?: string) => boolean;

  // Daily reset
  resetForNewDay: (balanceId: number) => void;
}

export type GoalFulfillmentStore = GoalFulfillmentState &
  GoalFulfillmentActions;

// ============================================================================
// HELPER FUNCTIONS
// ============================================================================

const generateId = (): string => {
  return `fulfillment_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
};

const getCurrentDate = (): string => {
  return formatDate(new Date());
};

const getCurrentTimestamp = (): number => {
  return Date.now();
};

// ============================================================================
// STORE IMPLEMENTATION
// ============================================================================

export const useGoalFulfillmentStore = create<GoalFulfillmentStore>()(
  persist(
    (set, get) => ({
      // Initial State
      fulfillmentsByBalance: {},

      // Core actions
      recordGoalFulfillment: ({ balance, type, actualValue, targetValue }) => {
        const currentDate = getCurrentDate();
        const currentTimestamp = getCurrentTimestamp();

        set((state) => {
          const newFulfillment: BalanceGoalFulfillment = {
            id: generateId(),
            balance: {
              balanceId: balance.balanceId,
              balanceType: balance.balanceType,
              balanceCurrency: balance.balanceCurrency,
            },
            type,
            targetValue,
            actualValue,
            date: currentDate,
            acknowledged: false,
            createdAt: currentTimestamp,
          };

          return {
            fulfillmentsByBalance: {
              ...state.fulfillmentsByBalance,
              [balance.balanceId]: newFulfillment,
            },
          };
        });
      },

      acknowledgeFulfillment: (balanceId: string, fulfillmentId: string) => {
        set((state) => {
          const fulfillment = state.fulfillmentsByBalance[balanceId];

          if (!fulfillment || fulfillment.id !== fulfillmentId) {
            return state;
          }

          return {
            fulfillmentsByBalance: {
              ...state.fulfillmentsByBalance,
              [balanceId]: {
                ...fulfillment,
                acknowledged: true,
                acknowledgedAt: getCurrentTimestamp(),
              },
            },
          };
        });
      },

      // Getters
      getFulfillmentForBalance: (balanceId: string) => {
        const state = get();
        return state.fulfillmentsByBalance[balanceId] || null;
      },

      getAllFulfillments: () => {
        const state = get();
        return Object.values(state.fulfillmentsByBalance).filter(
          (fulfillment): fulfillment is BalanceGoalFulfillment =>
            fulfillment !== null
        );
      },

      hasUnacknowledgedFulfillment: (balanceId?: string) => {
        const state = get();

        if (balanceId) {
          const fulfillment = state.fulfillmentsByBalance[balanceId];
          return fulfillment ? !fulfillment.acknowledged : false;
        }

        // Check all fulfillments
        return Object.values(state.fulfillmentsByBalance).some(
          (fulfillment) => fulfillment && !fulfillment.acknowledged
        );
      },

      // Daily reset
      resetForNewDay: (balanceId: number) => {
        set((state) => {
          const newFulfillments = { ...state.fulfillmentsByBalance };
          delete newFulfillments[balanceId];
          return {
            fulfillmentsByBalance: newFulfillments,
          };
        });
      },
    }),
    {
      name: "goal-fulfillment-storage",
      partialize: (state) => ({
        fulfillmentsByBalance: state.fulfillmentsByBalance,
      }),
    }
  )
);

// ============================================================================
// EXPORTED CONSTANTS FOR EXTERNAL USE
// ============================================================================

// All types and enums are already exported above
