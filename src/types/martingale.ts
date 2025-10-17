import {
  BalanceType,
  DigitalOptionsDirection,
} from "@quadcode-tech/client-sdk-js";

// ============================================================================
// MARTINGALE ORDER TYPES
// ============================================================================

export enum MartingaleOrderStatus {
  PENDING = "pending",
  EXECUTED = "executed",
  WON = "won",
  LOST = "lost",
  CANCELLED = "cancelled",
}

export enum MartingaleChainStatus {
  ACTIVE = "active",
  COMPLETED = "completed",
  COMPLETED_LOSS = "completed_loss",
  FAILED = "failed",
  CANCELLED = "cancelled",
  EXPIRED = "expired",
}

export enum CancellationReason {
  USER = "user",
  SYSTEM = "system",
  DAILY_LIMIT = "daily_limit",
  TIMEOUT = "timeout",
}

export interface MartingaleOrder {
  id: number;
  originalOrderId: number; // Reference to the initial auto-trade order
  chainId: string; // Reference to the martingale chain
  balanceId: number;
  balanceType: BalanceType;
  balanceCurrency: string;
  martingaleLevel: number; // 1, 2, 3, 4
  multiplier: number; // 2.5x, 2.2x, etc.
  orderAmount: number; // Calculated amount for this level
  direction: DigitalOptionsDirection;
  assetId: number;
  createdAt: number;
  status: MartingaleOrderStatus;
  executedAt?: number;
  resultAt?: number;
  cancelledBy?: CancellationReason;
  cancelledAt?: number;
  positionId?: string; // Reference to the actual position created
}

export interface MartingaleChain {
  id: string;
  originalOrderId: number;
  balanceId: number;
  balanceType: BalanceType;
  balanceCurrency: string;
  currentLevel: number;
  totalInvested: number;
  status: MartingaleChainStatus;
  createdAt: number;
  completedAt?: number;
  cancelledAt?: number;
  cancelledBy?: CancellationReason;
  orders: MartingaleOrder[];
  settings: {
    maxLevel: number;
    multipliers: number[]; // Store the multipliers used for this chain
  };
}

export interface MartingaleSettings {
  enabled: boolean;
  numberOfMartingales: number;
  multipliers: number[];
}

// ============================================================================
// DEFAULT VALUES
// ============================================================================

export const DEFAULT_MARTINGALE: MartingaleSettings = {
  enabled: false,
  numberOfMartingales: 4,
  multipliers: [2.5, 2.5, 2.5, 2.5],
};
