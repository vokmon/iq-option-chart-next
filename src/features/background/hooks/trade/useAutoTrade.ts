import { useAssetStore } from "@/stores/assets/assetStore";
import { useTradingStore } from "@/stores/assets/tradingStore";
import { useEffect } from "react";
import { tradeEvent } from "../../events/tradeEvent";
import { useOpenPositionsStore } from "@/stores/positions/openPositionsStore";
import { useTradingActions } from "@/hooks/useTradingActions";
import { useSdk } from "@/hooks/useSdk";
import {
  DigitalOptionsDirection,
  DigitalOptionsOrder,
  DigitalOptionsUnderlying,
} from "@quadcode-tech/client-sdk-js";
import { useDigitalOptions } from "@/hooks/assets/useDigitalOptions";
import { useAutoTradeOrdersStore } from "@/stores/autoTrade/autoTradeOrdersStore";

export const useAutoTrade = ({
  onSuccess,
}: {
  onSuccess: (params: {
    asset: DigitalOptionsUnderlying;
    order: DigitalOptionsOrder;
    direction: DigitalOptionsDirection;
    isSystemTrade?: boolean;
  }) => void;
}) => {
  const { sdk } = useSdk();
  const { actives } = useDigitalOptions();
  const { getAutoTrade, getSelectedBalanceId, updateAutoTrade, getMartingale } =
    useTradingStore();
  const { openPositions } = useOpenPositionsStore();
  const { assets } = useAssetStore();
  const { mutateAsync: createOrder } = useTradingActions({ onSuccess });
  const { addOrder } = useAutoTradeOrdersStore();

  useEffect(() => {
    const handleSignalChanged = async (event: Event) => {
      const { activeId, signal } = (event as CustomEvent).detail;

      const asset = assets.find((asset) => asset.asset?.activeId === activeId);
      if (!asset) {
        console.log("Asset not found", activeId);
        return;
      }

      const autoTrade = getAutoTrade(asset.id);
      if (!autoTrade) {
        console.log("Auto trade not found", activeId);
        return;
      }

      if (!autoTrade.enable || autoTrade.amount === 0) {
        console.log("Auto trade not enabled", activeId);
        return;
      }

      const martingale = getMartingale(asset.id);
      // const openPosition = openPositions.find(
      //   (position) =>
      //     position.activeId === activeId &&
      //     position &&
      //     position.direction?.toLowerCase() === signal.toLowerCase()
      // );
      // if (openPosition) {
      //   console.log("Open position found", activeId);
      //   // If thre is an open position, we don't need to create a new one
      //   return;
      // }

      const selectedBalanceId = getSelectedBalanceId(asset.id);
      const balances = await sdk.balances();
      const balance = balances
        .getBalances()
        .find((balance) => balance.id === selectedBalanceId);

      if (!balance) {
        console.log("Balance not found", activeId);
        return;
      }

      const activeAsset = actives.find((asset) => asset.activeId === activeId);
      if (!activeAsset) {
        console.log("Active asset not found", activeId);
        return;
      }

      const order: DigitalOptionsOrder | undefined = await createOrder({
        asset: activeAsset,
        balance: balance,
        amount: autoTrade.amount,
        direction: signal,
        period: asset.candleSize,
        isSystemTrade: true,
      });

      // Turn off auto trade after creating the order
      updateAutoTrade(asset.id, {
        enable: false,
        amount: autoTrade.amount,
      });

      // NEW: Track the order for martingale ONLY when martingale is enabled
      if (martingale?.enabled && order) {
        addOrder({
          id: order.id,
          externalId: order.id,
          balanceId: balance.id,
          balanceCurrency: balance.currency,
          balanceType: balance.type!,
          assetId: activeAsset.activeId,
          amount: autoTrade.amount,
          direction: signal,
          period: asset.candleSize,
          createdAt: Date.now(),
          isSystemTrade: true,
        });
      }
    };
    tradeEvent.addEventListener(handleSignalChanged);
    return () => {
      tradeEvent.removeEventListener(handleSignalChanged);
    };
  }, [
    actives,
    assets,
    createOrder,
    getAutoTrade,
    getSelectedBalanceId,
    openPositions,
    sdk,
    updateAutoTrade,
    addOrder,
    getMartingale,
  ]);
};
