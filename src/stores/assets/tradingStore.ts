"use client";

import { DEFAULT_MARTINGALE, MartingaleSettings } from "@/types/martingale";
import { create } from "zustand";
import { persist } from "zustand/middleware";

export interface AutoTrade {
  enable: boolean;
  amount: number;
}

interface TradingStore {
  // Four separate objects keyed by assetId
  selectedBalanceIds: Record<string, number>;
  amounts: Record<string, number>;
  autoTrade: Record<string, AutoTrade>;
  martingale: Record<string, MartingaleSettings>;

  // Actions
  updateSelectedBalance: (assetId: string, selectedBalanceId: number) => void;
  updateAmount: (assetId: string, amount: number) => void;
  getSelectedBalanceId: (assetId: string) => number | undefined;
  getAmount: (assetId: string) => number | undefined;
  clearTradingData: (assetId: string) => void;

  // Auto trade actions
  updateAutoTrade: (assetId: string, autoTrade: AutoTrade) => void;
  getAutoTrade: (assetId: string) => AutoTrade | undefined;

  // Martingale actions
  updateMartingale: (assetId: string, martingale: MartingaleSettings) => void;
  getMartingale: (assetId: string) => MartingaleSettings | undefined;
  getMartingaleMultiplier: (assetId: string, level: number) => number;

  // Sync with asset store - when assets are added/removed
  syncWithAssets: (assetIds: string[]) => void;
}

export const useTradingStore = create<TradingStore>()(
  persist(
    (set, get) => ({
      selectedBalanceIds: {},
      amounts: {},
      autoTrade: {},
      martingale: {},

      updateSelectedBalance: (assetId: string, selectedBalanceId: number) => {
        set((state) => ({
          selectedBalanceIds: {
            ...state.selectedBalanceIds,
            [assetId]: selectedBalanceId,
          },
        }));
      },

      updateAmount: (assetId: string, amount: number) => {
        set((state) => ({
          amounts: {
            ...state.amounts,
            [assetId]: amount,
          },
        }));
      },

      getSelectedBalanceId: (assetId: string) => {
        const state = get();
        return state.selectedBalanceIds[assetId];
      },

      getAmount: (assetId: string) => {
        const state = get();
        return state.amounts[assetId];
      },

      clearTradingData: (assetId: string) => {
        set((state) => {
          const newSelectedBalanceIds = { ...state.selectedBalanceIds };
          const newAmounts = { ...state.amounts };
          const newAutoTrade = { ...state.autoTrade };
          const newMartingale = { ...state.martingale };
          delete newSelectedBalanceIds[assetId];
          delete newAmounts[assetId];
          delete newAutoTrade[assetId];
          delete newMartingale[assetId];

          return {
            selectedBalanceIds: newSelectedBalanceIds,
            amounts: newAmounts,
            autoTrade: newAutoTrade,
            martingale: newMartingale,
          };
        });
      },

      updateAutoTrade: (assetId: string, autoTrade: AutoTrade) => {
        set((state) => ({
          autoTrade: {
            ...state.autoTrade,
            [assetId]: autoTrade,
          },
        }));
      },

      getAutoTrade: (assetId: string) => {
        const state = get();
        return state.autoTrade[assetId];
      },

      updateMartingale: (assetId: string, martingale: MartingaleSettings) => {
        set((state) => ({
          martingale: {
            ...state.martingale,
            [assetId]: {
              ...martingale,
              // Ensure valid values
              numberOfMartingales: Math.min(
                4,
                Math.max(1, martingale.numberOfMartingales)
              ),
              multipliers: martingale.multipliers.map((multiplier) =>
                Math.max(1, multiplier)
              ),
            },
          },
        }));
      },

      getMartingale: (assetId: string) => {
        const state = get();
        return state.martingale[assetId] || DEFAULT_MARTINGALE;
      },

      getMartingaleMultiplier: (assetId: string, level: number) => {
        const state = get();
        const martingale = state.martingale[assetId] || DEFAULT_MARTINGALE;

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

      syncWithAssets: (assetIds: string[]) => {
        set((state) => {
          const newSelectedBalanceIds = { ...state.selectedBalanceIds };
          const newAmounts = { ...state.amounts };
          const newAutoTrade = { ...state.autoTrade };
          const newMartingale = { ...state.martingale };

          // Remove trading data for assets that no longer exist
          Object.keys(newSelectedBalanceIds).forEach((tradingAssetId) => {
            if (!assetIds.includes(tradingAssetId)) {
              delete newSelectedBalanceIds[tradingAssetId];
            }
          });

          Object.keys(newAmounts).forEach((tradingAssetId) => {
            if (!assetIds.includes(tradingAssetId)) {
              delete newAmounts[tradingAssetId];
            }
          });

          Object.keys(newAutoTrade).forEach((tradingAssetId) => {
            if (!assetIds.includes(tradingAssetId)) {
              delete newAutoTrade[tradingAssetId];
            }
          });

          Object.keys(newMartingale).forEach((tradingAssetId) => {
            if (!assetIds.includes(tradingAssetId)) {
              delete newMartingale[tradingAssetId];
            }
          });

          return {
            selectedBalanceIds: newSelectedBalanceIds,
            amounts: newAmounts,
            autoTrade: newAutoTrade,
            martingale: newMartingale,
          };
        });
      },
    }),
    {
      name: "trading-storage",
      partialize: (state) => ({
        selectedBalanceIds: state.selectedBalanceIds,
        amounts: state.amounts,
        autoTrade: state.autoTrade,
        martingale: state.martingale,
      }),
    }
  )
);
