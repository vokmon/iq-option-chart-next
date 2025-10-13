"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";
import { TimeWindow, PauseDuration } from "@/types/time";

// ============================================================================
// DEFAULT VALUES
// ============================================================================

const DEFAULT_TRADING_GOALS = {
  profitTargetPercentage: 10,
  lossLimitPercentage: 10,
} as const;

const DEFAULT_BREAK_WARNING = {
  enabled: true,
  timeWindow: 15 as const, // minutes
  minOrdersRequired: 7,
  lossThreshold: 3,
  pauseAutoTrade: true,
  pauseDuration: 15 as const, // minutes
} as const;

const DEFAULT_TRADING_LIMITS = {
  breakWarning: DEFAULT_BREAK_WARNING,
} as const;

const DEFAULT_SETTINGS = {
  tradingGoals: DEFAULT_TRADING_GOALS,
  tradingLimits: DEFAULT_TRADING_LIMITS,
} as const;

// ============================================================================
// TYPES
// ============================================================================

export interface TradingGoalsSettings {
  profitTargetPercentage: number;
  lossLimitPercentage: number;
}

export interface BreakWarningSettings {
  enabled: boolean;
  timeWindow: TimeWindow; // minutes
  minOrdersRequired: number;
  lossThreshold: number;
  pauseAutoTrade: boolean;
  pauseDuration: PauseDuration; // minutes
}

export interface TradingLimitsSettings {
  breakWarning: BreakWarningSettings;
}

export interface SettingsState {
  // Saved settings (persisted)
  tradingGoals: TradingGoalsSettings;
  tradingLimits: TradingLimitsSettings;
}

export interface SettingsActions {
  // Settings Management Actions
  updateTradingGoals: (settings: Partial<TradingGoalsSettings>) => void;
  updateTradingLimits: (settings: Partial<TradingLimitsSettings>) => void;
  updateBreakWarning: (settings: Partial<BreakWarningSettings>) => void;

  // Getters
  getTradingGoals: () => TradingGoalsSettings;
  getTradingLimits: () => TradingLimitsSettings;
  getBreakWarning: () => BreakWarningSettings;
}

export type SettingsStore = SettingsState & SettingsActions;

// ============================================================================
// STORE IMPLEMENTATION
// ============================================================================

export const useSettingsStore = create<SettingsStore>()(
  persist(
    (set, get) => ({
      // Initial State
      ...DEFAULT_SETTINGS,

      // Settings Management Actions
      updateTradingGoals: (settings: Partial<TradingGoalsSettings>) => {
        set((state) => ({
          tradingGoals: {
            ...state.tradingGoals,
            ...settings,
            // Ensure non-negative values
            profitTargetPercentage: Math.max(
              0,
              settings.profitTargetPercentage ??
                state.tradingGoals.profitTargetPercentage
            ),
            lossLimitPercentage: Math.max(
              0,
              settings.lossLimitPercentage ??
                state.tradingGoals.lossLimitPercentage
            ),
          },
        }));
      },

      updateTradingLimits: (settings: Partial<TradingLimitsSettings>) => {
        set((state) => ({
          tradingLimits: {
            ...state.tradingLimits,
            ...settings,
          },
        }));
      },

      updateBreakWarning: (settings: Partial<BreakWarningSettings>) => {
        set((state) => ({
          tradingLimits: {
            ...state.tradingLimits,
            breakWarning: {
              ...state.tradingLimits.breakWarning,
              ...settings,
              // Ensure valid values
              minOrdersRequired: Math.max(
                1,
                settings.minOrdersRequired ??
                  state.tradingLimits.breakWarning.minOrdersRequired
              ),
              lossThreshold: Math.max(
                1,
                settings.lossThreshold ??
                  state.tradingLimits.breakWarning.lossThreshold
              ),
            },
          },
        }));
      },

      // Getters
      getTradingGoals: () => {
        const state = get();
        return state.tradingGoals;
      },

      getTradingLimits: () => {
        const state = get();
        return state.tradingLimits;
      },

      getBreakWarning: () => {
        const state = get();
        return state.tradingLimits.breakWarning;
      },
    }),
    {
      name: "settings-storage",
      partialize: (state) => ({
        tradingGoals: state.tradingGoals,
        tradingLimits: state.tradingLimits,
      }),
    }
  )
);

// ============================================================================
// EXPORTED CONSTANTS FOR EXTERNAL USE
// ============================================================================

export {
  DEFAULT_TRADING_GOALS,
  DEFAULT_BREAK_WARNING,
  DEFAULT_TRADING_LIMITS,
  DEFAULT_SETTINGS,
};
