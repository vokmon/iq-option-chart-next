import {
  BalanceType,
  DigitalOptionsDirection,
} from "@quadcode-tech/client-sdk-js";

export interface AutoTradeOrder {
  id: number;
  externalId: number; // position.externalId
  balanceId: number;
  balanceCurrency: string;
  balanceType: BalanceType;
  assetId: number;
  amount: number;
  direction: DigitalOptionsDirection;
  period: number;
  createdAt: number;
  isSystemTrade: boolean;
  // NO martingaleChainId needed - use getMartingaleOrder(order.id) instead
}
