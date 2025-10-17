"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";
import {
  MartingaleOrderStatus,
  MartingaleChainStatus,
  CancellationReason,
  MartingaleOrder,
  MartingaleChain,
} from "@/types/martingale";
import {
  BalanceType,
  DigitalOptionsDirection,
} from "@quadcode-tech/client-sdk-js";

const EXPIRATION_TIME = 60 * 60 * 1000;

interface MartingaleOrderState {
  // Map of chainId -> MartingaleChain
  chains: Record<string, MartingaleChain>;
  // Map of orderId -> MartingaleOrder for quick lookup
  orders: Record<number, MartingaleOrder>;
}

interface MartingaleOrderActions {
  // Chain Management
  createMartingaleChain: (params: {
    originalOrderId: number;
    balanceId: number;
    balanceType: BalanceType;
    balanceCurrency: string;
    maxLevel: number;
    multipliers: number[];
  }) => string; // Returns chainId

  updateMartingaleChain: (
    chainId: string,
    updates: Partial<MartingaleChain>
  ) => void;
  completeMartingaleChain: (
    chainId: string,
    finalStatus: MartingaleChainStatus
  ) => void;
  cancelMartingaleChain: (chainId: string, reason: CancellationReason) => void;

  // Order Management
  createMartingaleOrder: (params: {
    chainId: string;
    originalOrderId: number;
    balanceId: number;
    balanceType: BalanceType;
    balanceCurrency: string;
    martingaleLevel: number;
    multiplier: number;
    orderAmount: number;
    direction: DigitalOptionsDirection;
    assetId: number;
  }) => number; // Returns orderId

  updateMartingaleOrder: (
    orderId: number,
    updates: Partial<MartingaleOrder>
  ) => void;

  // Getters
  getMartingaleChain: (chainId: string) => MartingaleChain | null;
  getMartingaleOrder: (orderId: number) => MartingaleOrder | null;
  getActiveChainsForBalance: (balanceId: number) => MartingaleChain[];
  getChainOrders: (chainId: string) => MartingaleOrder[];

  // Validation & Cleanup
  canProceedMartingale: (chainId: string) => boolean;
  cleanupExpiredChains: () => { removedChains: number; removedOrders: number };

  // User Control
  canUserCancelChain: (chainId: string) => boolean;

  // Storage Management
  getStorageStats: () => {
    totalChains: number;
    totalOrders: number;
    activeChains: number;
  };
}

type MartingaleOrderStore = MartingaleOrderState & MartingaleOrderActions;

// ============================================================================
// HELPER FUNCTIONS
// ============================================================================

const generateId = (): string => {
  return `martingale_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
};

const getCurrentTimestamp = (): number => {
  return Date.now();
};

const isChainExpired = (chain: MartingaleChain): boolean => {
  const timeAgo = Date.now() - EXPIRATION_TIME; // 5min in milliseconds
  return chain.createdAt < timeAgo;
};

// ============================================================================
// STORE IMPLEMENTATION
// ============================================================================

export const useMartingaleOrderStore = create<MartingaleOrderStore>()(
  persist(
    (set, get) => ({
      // Initial State
      chains: {},
      orders: {},

      // Chain Management
      createMartingaleChain: ({
        originalOrderId,
        balanceId,
        balanceType,
        balanceCurrency,
        maxLevel,
        multipliers,
      }) => {
        const chainId = generateId();
        const currentTimestamp = getCurrentTimestamp();

        const newChain: MartingaleChain = {
          id: chainId,
          originalOrderId,
          balanceId,
          balanceType,
          balanceCurrency,
          currentLevel: 0, // Will be incremented when first order is created
          totalInvested: 0,
          status: MartingaleChainStatus.ACTIVE,
          createdAt: currentTimestamp,
          orders: [],
          settings: {
            maxLevel,
            multipliers,
          },
        };

        set((state) => ({
          chains: {
            ...state.chains,
            [chainId]: newChain,
          },
        }));

        return chainId;
      },

      updateMartingaleChain: (
        chainId: string,
        updates: Partial<MartingaleChain>
      ) => {
        set((state) => {
          const chain = state.chains[chainId];
          if (!chain) return state;

          return {
            chains: {
              ...state.chains,
              [chainId]: {
                ...chain,
                ...updates,
              },
            },
          };
        });
      },

      completeMartingaleChain: (
        chainId: string,
        finalStatus: MartingaleChainStatus
      ) => {
        const currentTimestamp = getCurrentTimestamp();

        set((state) => {
          const chain = state.chains[chainId];
          if (!chain) return state;

          return {
            chains: {
              ...state.chains,
              [chainId]: {
                ...chain,
                status: finalStatus,
                completedAt: currentTimestamp,
              },
            },
          };
        });
      },

      cancelMartingaleChain: (chainId: string, reason: CancellationReason) => {
        const currentTimestamp = getCurrentTimestamp();

        set((state) => {
          const chain = state.chains[chainId];
          if (!chain) return state;

          // Cancel all pending orders in the chain
          const updatedOrders = { ...state.orders };
          chain.orders.forEach((order) => {
            if (order.status === MartingaleOrderStatus.PENDING) {
              updatedOrders[order.id] = {
                ...order,
                status: MartingaleOrderStatus.CANCELLED,
                cancelledBy: reason,
                cancelledAt: currentTimestamp,
              };
            }
          });

          return {
            chains: {
              ...state.chains,
              [chainId]: {
                ...chain,
                status: MartingaleChainStatus.CANCELLED,
                cancelledAt: currentTimestamp,
                cancelledBy: reason,
              },
            },
            orders: updatedOrders,
          };
        });
      },

      // Order Management
      createMartingaleOrder: ({
        chainId,
        originalOrderId,
        balanceId,
        balanceType,
        balanceCurrency,
        martingaleLevel,
        multiplier,
        orderAmount,
        direction,
        assetId,
      }) => {
        const orderId = originalOrderId;
        const currentTimestamp = getCurrentTimestamp();

        const newOrder: MartingaleOrder = {
          id: orderId,
          originalOrderId,
          chainId,
          balanceId,
          balanceType,
          balanceCurrency,
          martingaleLevel,
          multiplier,
          orderAmount,
          direction,
          assetId,
          createdAt: currentTimestamp,
          status: MartingaleOrderStatus.PENDING,
        };

        set((state) => {
          const chain = state.chains[chainId];
          if (!chain) return state;

          const updatedChain = {
            ...chain,
            currentLevel: martingaleLevel,
            totalInvested: chain.totalInvested + orderAmount,
            orders: [...chain.orders, newOrder],
          };

          return {
            chains: {
              ...state.chains,
              [chainId]: updatedChain,
            },
            orders: {
              ...state.orders,
              [orderId]: newOrder,
            },
          };
        });

        return orderId;
      },

      updateMartingaleOrder: (
        orderId: number,
        updates: Partial<MartingaleOrder>
      ) => {
        set((state) => {
          const order = state.orders[orderId];
          if (!order) return state;

          const updatedOrder = { ...order, ...updates };

          // Also update the order in the chain
          const chain = state.chains[order.chainId];
          if (chain) {
            const updatedChain = {
              ...chain,
              orders: chain.orders.map((o) =>
                o.id === orderId ? updatedOrder : o
              ),
            };

            return {
              orders: {
                ...state.orders,
                [orderId]: updatedOrder,
              },
              chains: {
                ...state.chains,
                [order.chainId]: updatedChain,
              },
            };
          }

          return {
            orders: {
              ...state.orders,
              [orderId]: updatedOrder,
            },
          };
        });
      },

      // Getters
      getMartingaleChain: (chainId: string) => {
        const state = get();
        return state.chains[chainId] || null;
      },

      getMartingaleOrder: (orderId: number) => {
        const state = get();
        return state.orders[orderId] || null;
      },

      getActiveChainsForBalance: (balanceId: number) => {
        const state = get();
        return Object.values(state.chains).filter(
          (chain) =>
            chain.balanceId === balanceId &&
            chain.status === MartingaleChainStatus.ACTIVE
        );
      },

      getChainOrders: (chainId: string) => {
        const state = get();
        const chain = state.chains[chainId];
        return chain ? chain.orders : [];
      },

      // Validation & Cleanup
      canProceedMartingale: (chainId: string) => {
        const state = get();
        const chain = state.chains[chainId];

        // Check if we've reached max level
        if (chain.currentLevel >= chain.settings.maxLevel) {
          return false;
        }

        if (!chain || chain.status !== MartingaleChainStatus.ACTIVE) {
          return false;
        }

        // Check if chain is expired
        if (isChainExpired(chain)) {
          return false;
        }

        // Additional validation can be added here (balance check, daily limits, etc.)
        return true;
      },

      cleanupExpiredChains: () => {
        let removedChains = 0;
        let removedOrders = 0;

        set((state) => {
          const updatedChains = { ...state.chains };
          const updatedOrders = { ...state.orders };

          // Find and completely remove expired chains (older than 1 hour)
          // This helps free up disk space by removing old data
          Object.values(state.chains).forEach((chain) => {
            if (isChainExpired(chain)) {
              // Count the chain and its orders for statistics
              removedChains++;
              removedOrders += chain.orders.length;

              // Remove the chain completely from storage
              delete updatedChains[chain.id];

              // Remove all orders associated with this chain
              chain.orders.forEach((order) => {
                delete updatedOrders[order.id];
              });
            }
          });

          return {
            chains: updatedChains,
            orders: updatedOrders,
          };
        });

        return { removedChains, removedOrders };
      },

      // User Control

      canUserCancelChain: (chainId: string) => {
        const state = get();
        const chain = state.chains[chainId];

        if (!chain) return false;

        // User can cancel if chain is active and not already cancelled
        return (
          chain.status === MartingaleChainStatus.ACTIVE && !chain.cancelledBy
        );
      },

      // Storage Management
      getStorageStats: () => {
        const state = get();
        const totalChains = Object.keys(state.chains).length;
        const totalOrders = Object.keys(state.orders).length;
        const activeChains = Object.values(state.chains).filter(
          (chain) => chain.status === MartingaleChainStatus.ACTIVE
        ).length;

        return { totalChains, totalOrders, activeChains };
      },
    }),
    {
      name: "martingale-order-storage",
      partialize: (state) => ({
        chains: state.chains,
        orders: state.orders,
      }),
    }
  )
);

// ============================================================================
// EXPORTED CONSTANTS FOR EXTERNAL USE
// ============================================================================
