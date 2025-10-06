"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";

// ============================================================================
// DEFAULT VALUES
// ============================================================================

const DEFAULT_RISK_MANAGEMENT = {
  dailyProfitTarget: 0,
  dailyLossLimit: 0,
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
  riskManagement: DEFAULT_RISK_MANAGEMENT,
  tradingLimits: DEFAULT_TRADING_LIMITS,
} as const;

// ============================================================================
// TYPES
// ============================================================================

export interface RiskManagementSettings {
  dailyProfitTarget: number;
  dailyLossLimit: number;
}

export interface BreakWarningSettings {
  enabled: boolean;
  timeWindow: 15 | 30; // minutes
  minOrdersRequired: number;
  lossThreshold: number;
  pauseAutoTrade: boolean;
  pauseDuration: 15 | 30 | 60; // minutes
}

export interface TradingLimitsSettings {
  breakWarning: BreakWarningSettings;
}

export interface SettingsState {
  // Saved settings (persisted)
  riskManagement: RiskManagementSettings;
  tradingLimits: TradingLimitsSettings;
}

export interface SettingsActions {
  // Settings Management Actions
  updateRiskManagement: (settings: Partial<RiskManagementSettings>) => void;
  updateTradingLimits: (settings: Partial<TradingLimitsSettings>) => void;
  updateBreakWarning: (settings: Partial<BreakWarningSettings>) => void;

  // Getters
  getRiskManagement: () => RiskManagementSettings;
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
      updateRiskManagement: (settings: Partial<RiskManagementSettings>) => {
        set((state) => ({
          riskManagement: {
            ...state.riskManagement,
            ...settings,
            // Ensure non-negative values
            dailyProfitTarget: Math.max(
              0,
              settings.dailyProfitTarget ??
                state.riskManagement.dailyProfitTarget
            ),
            dailyLossLimit: Math.max(
              0,
              settings.dailyLossLimit ?? state.riskManagement.dailyLossLimit
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
      getRiskManagement: () => {
        const state = get();
        return state.riskManagement;
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
        riskManagement: state.riskManagement,
        tradingLimits: state.tradingLimits,
      }),
    }
  )
);

// ============================================================================
// EXPORTED CONSTANTS FOR EXTERNAL USE
// ============================================================================

export {
  DEFAULT_RISK_MANAGEMENT,
  DEFAULT_BREAK_WARNING,
  DEFAULT_TRADING_LIMITS,
  DEFAULT_SETTINGS,
};
