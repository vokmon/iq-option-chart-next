"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";

interface TradingStore {
  // Two separate objects keyed by assetId
  selectedBalanceIds: Record<string, number>;
  amounts: Record<string, number>;

  // Actions
  updateSelectedBalance: (assetId: string, selectedBalanceId: number) => void;
  updateAmount: (assetId: string, amount: number) => void;
  getSelectedBalanceId: (assetId: string) => number | undefined;
  getAmount: (assetId: string) => number | undefined;
  clearTradingData: (assetId: string) => void;
  // Sync with asset store - when assets are added/removed
  syncWithAssets: (assetIds: string[]) => void;
}

export const useTradingStore = create<TradingStore>()(
  persist(
    (set, get) => ({
      selectedBalanceIds: {},
      amounts: {},

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
          delete newSelectedBalanceIds[assetId];
          delete newAmounts[assetId];
          return {
            selectedBalanceIds: newSelectedBalanceIds,
            amounts: newAmounts,
          };
        });
      },

      syncWithAssets: (assetIds: string[]) => {
        set((state) => {
          const newSelectedBalanceIds = { ...state.selectedBalanceIds };
          const newAmounts = { ...state.amounts };

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

          return {
            selectedBalanceIds: newSelectedBalanceIds,
            amounts: newAmounts,
          };
        });
      },
    }),
    {
      name: "trading-storage",
      partialize: (state) => ({
        selectedBalanceIds: state.selectedBalanceIds,
        amounts: state.amounts,
      }),
    }
  )
);
