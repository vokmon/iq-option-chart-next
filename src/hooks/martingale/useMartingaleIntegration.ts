"use client";

import { useEffect, useCallback } from "react";
import { useClosedPositionsStore } from "@/stores/positions/closedPositionsStore";
import { useAutoTradeOrdersStore } from "@/stores/autoTrade/autoTradeOrdersStore";
import { useMartingaleOrderStore } from "@/stores/martingale/martingaleOrderStore";
import { useGoalFulfillmentStore } from "@/stores/notifications/goalFulfillmentStore";
import { useTradingActions } from "@/hooks/useTradingActions";
import { useDigitalOptions } from "@/hooks/assets/useDigitalOptions";
import { useTradingStore } from "@/stores/assets/tradingStore";
import { useSdk } from "@/hooks/useSdk";
import { isToday } from "@/utils/dateTime";
import {
  Position,
  DigitalOptionsUnderlying,
  DigitalOptionsOrder,
  DigitalOptionsDirection,
} from "@quadcode-tech/client-sdk-js";
import { AutoTradeOrder } from "@/types/autoTrade";
import {
  MartingaleChainStatus,
  MartingaleSettings,
  MartingaleChain,
  CancellationReason,
} from "@/types/martingale";
import { useAssetStore } from "@/stores/assets/assetStore";

const EXPIRATION_TIME = 60 * 1000; // 1 minute in milliseconds

export const useMartingaleIntegration = ({
  onSuccess,
}: {
  onSuccess?: (params: {
    asset: DigitalOptionsUnderlying;
    order: DigitalOptionsOrder;
    direction: DigitalOptionsDirection;
    isSystemTrade?: boolean;
  }) => void;
}) => {
  const { sdk } = useSdk();
  const { getAssetByActiveId } = useAssetStore();
  const { actives } = useDigitalOptions();
  const { getSelectedBalanceId, getMartingale } = useTradingStore();
  const { addOrder } = useAutoTradeOrdersStore();
  const { closedPositions } = useClosedPositionsStore();
  const { orders, removeOrder } = useAutoTradeOrdersStore();
  const {
    createMartingaleChain,
    createMartingaleOrder,
    updateMartingaleChain,
    completeMartingaleChain,
    getMartingaleOrder,
    getMartingaleChain,
    canProceedMartingale,
    cancelMartingaleChain,
  } = useMartingaleOrderStore();

  const { getAllFulfillments } = useGoalFulfillmentStore();

  const createOrderMutation = useTradingActions({
    onSuccess: onSuccess,
  });

  const createNextMartingaleOrder = useCallback(
    async (
      chain: MartingaleChain,
      previousOrder: AutoTradeOrder,
      martingale: MartingaleSettings
    ) => {
      try {
        const selectedAsset = getAssetByActiveId(previousOrder.assetId);
        const selectedAssetId = selectedAsset?.id;
        if (!selectedAssetId) {
          console.error("Asset not found for martingale order");
          return;
        }

        // Get the next multiplier
        const nextLevel = chain.orders.length;
        const multiplier = martingale.multipliers[nextLevel];
        const nextAmount = previousOrder.amount * multiplier;

        // Get balance and asset
        const balanceId = getSelectedBalanceId(selectedAssetId);
        const balances = await sdk.balances();
        const balance = balances.getBalances().find((b) => b.id === balanceId);
        const asset = actives.find(
          (a) => a?.activeId === previousOrder.assetId
        );

        if (!balance || !asset) {
          console.error("Balance or asset not found for martingale order");
          return;
        }

        // Create the martingale order
        const order = await createOrderMutation.mutateAsync({
          asset: asset!,
          balance: balance,
          amount: nextAmount,
          direction: previousOrder.direction,
          period: previousOrder.period,
          isSystemTrade: true,
        });

        // Track the new martingale order AFTER order creation
        if (order) {
          addOrder({
            id: order.id,
            externalId: order.id,
            balanceId: balance.id,
            balanceCurrency: balance.currency,
            balanceType: balance.type!,
            assetId: asset!.activeId,
            amount: nextAmount,
            direction: previousOrder.direction,
            period: previousOrder.period,
            createdAt: Date.now(),
            isSystemTrade: true,
          });
          createMartingaleOrder({
            chainId: chain.id,
            originalOrderId: order.id,
            balanceId: balance.id,
            balanceType: balance.type!,
            balanceCurrency: balance.currency,
            martingaleLevel: chain.currentLevel + 1,
            multiplier: martingale.multipliers[chain.currentLevel],
            orderAmount: nextAmount,
            direction: previousOrder.direction,
            assetId: asset!.activeId,
          });
        }

        console.log(
          `Created martingale order level ${
            nextLevel + 1
          } with amount ${nextAmount}`
        );
      } catch (error) {
        console.error("Error creating next martingale order:", error);
      }
    },
    [
      getAssetByActiveId,
      getSelectedBalanceId,
      sdk,
      actives,
      createOrderMutation,
      addOrder,
      createMartingaleOrder,
    ]
  );

  const handleMartingaleComplete = useCallback(
    async (order: AutoTradeOrder) => {
      try {
        // Check if this order is part of a martingale chain
        const martingaleOrder = getMartingaleOrder(order.id);

        if (martingaleOrder) {
          // Martingale order won - complete chain
          const chain = getMartingaleChain(martingaleOrder.chainId);
          if (chain) {
            await completeMartingaleChain(
              chain.id,
              MartingaleChainStatus.COMPLETED
            );
            console.log(`Martingale chain ${chain.id} completed`);
          }
        } else {
          // First-time win - no action needed
          console.log("First-time auto-trade win, no martingale chain");
        }
      } catch (error) {
        console.error("Error handling martingale win:", error);
      }
    },
    [getMartingaleOrder, getMartingaleChain, completeMartingaleChain]
  );

  const handleMartingaleLoss = useCallback(
    async (order: AutoTradeOrder, martingale: MartingaleSettings) => {
      try {
        // Check if this order is part of a martingale chain
        const martingaleOrder = getMartingaleOrder(order.id);

        if (martingaleOrder) {
          // This is a martingale order - update existing chain
          const chain = getMartingaleChain(martingaleOrder.chainId);
          if (chain) {
            if (!canProceedMartingale(chain.id)) {
              console.log("Cannot proceed with martingale");
              updateMartingaleChain(chain.id, {
                status: MartingaleChainStatus.COMPLETED_LOSS,
              });
              return;
            }

            await updateMartingaleChain(chain.id, {
              status: MartingaleChainStatus.ACTIVE,
            });

            // Create next martingale order
            await createNextMartingaleOrder(chain, order, martingale);
          }
        } else {
          // This is a FIRST-TIME LOSS - create new martingale chain
          const chainId = createMartingaleChain({
            balanceId: order.balanceId,
            balanceType: order.balanceType,
            balanceCurrency: order.balanceCurrency, // Default currency
            originalOrderId: order.id,
            maxLevel: martingale.numberOfMartingales,
            multipliers: martingale.multipliers,
          });

          // Create first martingale order
          const chain = getMartingaleChain(chainId);
          if (chain) {
            await createNextMartingaleOrder(chain, order, martingale);
          }
        }
      } catch (error) {
        console.error("Error handling martingale loss:", error);
      }
    },
    [
      getMartingaleOrder,
      getMartingaleChain,
      canProceedMartingale,
      updateMartingaleChain,
      createNextMartingaleOrder,
      createMartingaleChain,
    ]
  );

  const processOrderResult = useCallback(
    async (order: AutoTradeOrder, position: Position) => {
      try {
        const selectedAsset = getAssetByActiveId(order.assetId);
        const selectedAssetId = selectedAsset?.id;
        if (!selectedAssetId) {
          console.error("Asset not found for martingale order");
          return;
        }

        const martingale = getMartingale(selectedAssetId);
        if (!martingale) {
          console.error("Martingale not found for asset");
          return;
        }

        // Check martingale settings
        if (!martingale.enabled) {
          return;
        }

        // SAFEGUARD 1: Check if position is too old (more than 1 minute)
        const currentTime = Date.now();
        const positionAge =
          currentTime - (position.expirationTime?.getTime() || currentTime);

        const martingaleOrder = getMartingaleOrder(order.id);
        if (positionAge > EXPIRATION_TIME) {
          console.log("Position is too old, skipping martingale processing");
          if (martingaleOrder) {
            cancelMartingaleChain(
              martingaleOrder.chainId,
              CancellationReason.TIMEOUT
            );
          }
          return;
        }

        // Check today's fulfillment for this balance using isToday()
        const fulfillments = getAllFulfillments();
        const unacknowledgedFulfillments = fulfillments.filter(
          (f) =>
            !f.acknowledged &&
            isToday(new Date(f.date)) &&
            f.balance.balanceId === order.balanceId
        );

        if (unacknowledgedFulfillments.length > 0) {
          console.log("Daily limits reached for today, martingale disabled");
          if (martingaleOrder) {
            cancelMartingaleChain(
              martingaleOrder.chainId,
              CancellationReason.DAILY_LIMIT
            );
          }
          return;
        }

        const positionProfit = position.pnl || 0;
        if (positionProfit >= 0) {
          await handleMartingaleComplete(order);
        } else if (positionProfit < 0) {
          await handleMartingaleLoss(order, martingale);
        }
      } catch (error) {
        console.error("Error processing order result:", error);
      }
    },
    [
      cancelMartingaleChain,
      getAllFulfillments,
      getAssetByActiveId,
      getMartingale,
      getMartingaleOrder,
      handleMartingaleComplete,
      handleMartingaleLoss,
    ]
  );

  // OPTIMIZED: Loop through orders (small) instead of closedPositions (large)
  useEffect(() => {
    if (orders.length === 0) return;

    orders.forEach(async (order) => {
      const matchingPosition = closedPositions.find((position) =>
        position.orderIds.includes(order.id)
      );

      if (matchingPosition) {
        removeOrder(order.id);
        await processOrderResult(order, matchingPosition);
      }
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [closedPositions]);

  return {
    processOrderResult,
    handleMartingaleComplete,
    handleMartingaleLoss,
    createNextMartingaleOrder,
  };
};
