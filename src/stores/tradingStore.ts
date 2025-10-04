"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";

export interface AutoTrade {
  enable: boolean;
  amount: number;
}

interface TradingStore {
  // Three separate objects keyed by assetId
  selectedBalanceIds: Record<string, number>;
  amounts: Record<string, number>;
  autoTrade: Record<string, AutoTrade>;

  // Actions
  updateSelectedBalance: (assetId: string, selectedBalanceId: number) => void;
  updateAmount: (assetId: string, amount: number) => void;
  getSelectedBalanceId: (assetId: string) => number | undefined;
  getAmount: (assetId: string) => number | undefined;
  clearTradingData: (assetId: string) => void;

  // Auto trade actions
  updateAutoTrade: (assetId: string, autoTrade: AutoTrade) => void;
  getAutoTrade: (assetId: string) => AutoTrade | undefined;

  // Sync with asset store - when assets are added/removed
  syncWithAssets: (assetIds: string[]) => void;
}

export const useTradingStore = create<TradingStore>()(
  persist(
    (set, get) => ({
      selectedBalanceIds: {},
      amounts: {},
      autoTrade: {},

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
          delete newSelectedBalanceIds[assetId];
          delete newAmounts[assetId];
          delete newAutoTrade[assetId];

          return {
            selectedBalanceIds: newSelectedBalanceIds,
            amounts: newAmounts,
            autoTrade: newAutoTrade,
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

      syncWithAssets: (assetIds: string[]) => {
        set((state) => {
          const newSelectedBalanceIds = { ...state.selectedBalanceIds };
          const newAmounts = { ...state.amounts };
          const newAutoTrade = { ...state.autoTrade };

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

          return {
            selectedBalanceIds: newSelectedBalanceIds,
            amounts: newAmounts,
            autoTrade: newAutoTrade,
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
      }),
    }
  )
);
