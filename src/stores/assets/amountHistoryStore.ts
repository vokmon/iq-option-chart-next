"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";

export const CLEANUP_INACTIVE_ASSETS_AFTER_DAYS = 14;
export const MAX_AMOUNT_HISTORY = 5;

export interface AmountHistoryEntry {
  amounts: number[];
  lastActive: number; // Store as timestamp for better performance
}

export interface AmountHistoryStore {
  // Structure: [activeId]: { [balanceId]: { amounts: [amount, amount, amount, ...], lastActive: number } }
  amountHistory: Record<number, Record<number, AmountHistoryEntry>>;

  // Actions
  addAmount: (activeId: number, balanceId: number, amount: number) => void;
  getAmountHistory: (activeId: number, balanceId: number) => number[];
  updateLastActive: (activeId: number, balanceId: number) => void;
  cleanupOldEntries: () => void;
}

export const useAmountHistoryStore = create<AmountHistoryStore>()(
  persist(
    (set, get) => ({
      amountHistory: {},

      addAmount: (activeId: number, balanceId: number, amount: number) => {
        set((state) => {
          const newAmountHistory = { ...state.amountHistory };

          // Initialize activeId if it doesn't exist
          if (!newAmountHistory[activeId]) {
            newAmountHistory[activeId] = {};
          }

          // Initialize balanceId if it doesn't exist
          if (!newAmountHistory[activeId][balanceId]) {
            newAmountHistory[activeId][balanceId] = {
              amounts: [],
              lastActive: Date.now(),
            };
          }

          // Get current amounts and add new amount if it's unique
          const currentAmounts = [
            ...newAmountHistory[activeId][balanceId].amounts,
          ];

          // Remove the amount if it already exists to avoid duplicates
          const filteredAmounts = currentAmounts.filter((a) => a !== amount);

          // Add the new amount to the beginning of the array
          filteredAmounts.unshift(amount);

          // Keep only the last MAX_AMOUNT_HISTORY amounts
          const finalAmounts = filteredAmounts.slice(0, MAX_AMOUNT_HISTORY);

          newAmountHistory[activeId][balanceId] = {
            amounts: finalAmounts,
            lastActive: Date.now(),
          };

          return {
            amountHistory: newAmountHistory,
          };
        });
      },

      getAmountHistory: (activeId: number, balanceId: number) => {
        const state = get();
        const entry = state.amountHistory[activeId]?.[balanceId];
        return entry?.amounts || [];
      },

      updateLastActive: (activeId: number, balanceId: number) => {
        set((state) => {
          const newAmountHistory = { ...state.amountHistory };
          if (newAmountHistory[activeId]?.[balanceId]) {
            newAmountHistory[activeId][balanceId] = {
              ...newAmountHistory[activeId][balanceId],
              lastActive: Date.now(),
            };
          }
          return { amountHistory: newAmountHistory };
        });
      },

      cleanupOldEntries: () => {
        set((state) => {
          const newAmountHistory = { ...state.amountHistory };
          const fourteenDaysAgo =
            Date.now() -
            CLEANUP_INACTIVE_ASSETS_AFTER_DAYS * 24 * 60 * 60 * 1000;

          Object.keys(newAmountHistory).forEach((activeIdStr) => {
            const activeId = parseInt(activeIdStr);
            Object.keys(newAmountHistory[activeId]).forEach((balanceIdStr) => {
              const balanceId = parseInt(balanceIdStr);
              const entry = newAmountHistory[activeId][balanceId];

              // Check if lastActive is more than 14 days old
              if (entry.lastActive < fourteenDaysAgo) {
                delete newAmountHistory[activeId][balanceId];
              }
            });

            // If no balances left for this active, remove the active entry
            if (Object.keys(newAmountHistory[activeId]).length === 0) {
              delete newAmountHistory[activeId];
            }
          });

          return {
            amountHistory: newAmountHistory,
          };
        });
      },
    }),
    {
      name: "amount-history-storage",
      partialize: (state) => ({
        amountHistory: state.amountHistory,
      }),
    }
  )
);
