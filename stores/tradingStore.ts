"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";

export interface OrderState {
  id: number;
  isByUser: boolean;
}

interface TradingStore {
  // Two separate objects keyed by assetId
  selectedBalanceIds: Record<string, number>;
  amounts: Record<string, number>;
  orders: Record<string, OrderState[]>;

  // Actions
  updateSelectedBalance: (assetId: string, selectedBalanceId: number) => void;
  updateAmount: (assetId: string, amount: number) => void;
  getSelectedBalanceId: (assetId: string) => number | undefined;
  getAmount: (assetId: string) => number | undefined;
  clearTradingData: (assetId: string) => void;
  // Order management
  addOrder: (assetId: string, order: OrderState) => void;
  getOrders: (assetId: string) => OrderState[];
  clearOrders: (assetId: string) => void;
  // Sync with asset store - when assets are added/removed
  syncWithAssets: (assetIds: string[]) => void;
}

export const useTradingStore = create<TradingStore>()(
  persist(
    (set, get) => ({
      selectedBalanceIds: {},
      amounts: {},
      orders: {},

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
          const newOrders = { ...state.orders };
          delete newSelectedBalanceIds[assetId];
          delete newAmounts[assetId];
          delete newOrders[assetId];
          return {
            selectedBalanceIds: newSelectedBalanceIds,
            amounts: newAmounts,
            orders: newOrders,
          };
        });
      },

      addOrder: (assetId: string, order: OrderState) => {
        set((state) => ({
          orders: {
            ...state.orders,
            [assetId]: [...(state.orders[assetId] || []), order],
          },
        }));
      },

      getOrders: (assetId: string) => {
        const state = get();
        return state.orders[assetId] || [];
      },

      clearOrders: (assetId: string) => {
        set((state) => {
          const newOrders = { ...state.orders };
          delete newOrders[assetId];
          return { orders: newOrders };
        });
      },

      syncWithAssets: (assetIds: string[]) => {
        set((state) => {
          const newSelectedBalanceIds = { ...state.selectedBalanceIds };
          const newAmounts = { ...state.amounts };
          const newOrders = { ...state.orders };

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

          Object.keys(newOrders).forEach((tradingAssetId) => {
            if (!assetIds.includes(tradingAssetId)) {
              delete newOrders[tradingAssetId];
            }
          });

          return {
            selectedBalanceIds: newSelectedBalanceIds,
            amounts: newAmounts,
            orders: newOrders,
          };
        });
      },
    }),
    {
      name: "trading-storage",
      partialize: (state) => ({
        selectedBalanceIds: state.selectedBalanceIds,
        amounts: state.amounts,
        orders: state.orders,
      }),
    }
  )
);
