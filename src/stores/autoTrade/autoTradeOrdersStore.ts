"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";
import { AutoTradeOrder } from "@/types/autoTrade";

const EXPIRATION_TIME = 60 * 60 * 1000;

interface AutoTradeOrdersState {
  orders: AutoTradeOrder[];
}

interface AutoTradeOrdersActions {
  addOrder: (order: AutoTradeOrder) => void;
  removeOrder: (id: number) => void;
  cleanupExpiredOrders: () => { removed: number };
}

type AutoTradeOrdersStore = AutoTradeOrdersState & AutoTradeOrdersActions;

export const useAutoTradeOrdersStore = create<AutoTradeOrdersStore>()(
  persist(
    (set, get) => ({
      // Initial state
      orders: [],

      // Actions
      addOrder: (order: AutoTradeOrder) => {
        set((state) => ({
          orders: [...state.orders, order],
        }));
      },

      removeOrder: (id: number) => {
        set((state) => ({
          orders: state.orders.filter((order) => order.id !== id),
        }));
      },

      cleanupExpiredOrders: () => {
        const oneHourAgo = Date.now() - EXPIRATION_TIME;
        const { orders } = get();

        const expiredOrders = orders.filter(
          (order) => order.createdAt < oneHourAgo
        );

        if (expiredOrders.length > 0) {
          set((state) => ({
            orders: state.orders.filter(
              (order) => order.createdAt >= oneHourAgo
            ),
          }));
        }

        return { removed: expiredOrders.length };
      },
    }),
    {
      name: "auto-trade-orders-storage",
      partialize: (state) => ({ orders: state.orders }),
    }
  )
);
