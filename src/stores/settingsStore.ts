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

const DEFAULT_MARTINGALE = {
  enabled: true,
  numberOfMartingales: 4,
  multipliers: [2.5, 2.5, 2.5, 2.5],
};

const DEFAULT_TRADING_LIMITS = {
  breakWarning: DEFAULT_BREAK_WARNING,
} as const;

const DEFAULT_SETTINGS = {
  tradingGoals: DEFAULT_TRADING_GOALS,
  tradingLimits: DEFAULT_TRADING_LIMITS,
  martingale: DEFAULT_MARTINGALE,
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

export interface MartingaleSettings {
  enabled: boolean;
  numberOfMartingales: number;
  multipliers: number[];
}

export interface SettingsState {
  // Saved settings (persisted)
  tradingGoals: TradingGoalsSettings;
  tradingLimits: TradingLimitsSettings;
  martingale: MartingaleSettings;
}

export interface SettingsActions {
  // Settings Management Actions
  updateTradingGoals: (settings: Partial<TradingGoalsSettings>) => void;
  updateTradingLimits: (settings: Partial<TradingLimitsSettings>) => void;
  updateBreakWarning: (settings: Partial<BreakWarningSettings>) => void;
  updateMartingale: (settings: Partial<MartingaleSettings>) => void;

  // Getters
  getTradingGoals: () => TradingGoalsSettings;
  getTradingLimits: () => TradingLimitsSettings;
  getBreakWarning: () => BreakWarningSettings;
  getMartingale: () => MartingaleSettings;
  getMartingaleMultiplier: (level: number) => number;
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

      updateMartingale: (settings: Partial<MartingaleSettings>) => {
        set((state) => ({
          martingale: {
            ...state.martingale,
            ...settings,
            // Ensure valid values
            numberOfMartingales: Math.min(
              4,
              Math.max(
                1,
                settings.numberOfMartingales ??
                  state.martingale.numberOfMartingales
              )
            ),
            multipliers: (
              settings.multipliers ?? state.martingale.multipliers
            ).map((multiplier) => Math.max(1, multiplier)),
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

      getMartingale: () => {
        const state = get();
        return state.martingale;
      },

      getMartingaleMultiplier: (level: number) => {
        const state = get();
        const martingale = state.martingale;

        // Validate level (1-based indexing)
        if (level < 1 || level > martingale.numberOfMartingales) {
          console.warn(
            `Martingale level ${level} is out of range. Available levels: 1-${martingale.numberOfMartingales}`
          );
          return martingale.multipliers[0] || 2.5; // Return first multiplier as fallback
        }

        // Return multiplier for the specified level (convert to 0-based index)
        return martingale.multipliers[level - 1] || 2.5;
      },
    }),
    {
      name: "settings-storage",
      partialize: (state) => ({
        tradingGoals: state.tradingGoals,
        tradingLimits: state.tradingLimits,
        martingale: state.martingale,
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
  DEFAULT_MARTINGALE,
  DEFAULT_SETTINGS,
};
