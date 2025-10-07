import { useEffect, useRef } from "react";
import { useSdk } from "@/hooks/useSdk";
import { useAssetStore } from "@/stores/assetStore";
import { useTradingStore } from "@/stores/tradingStore";
import { useClosedPositionsStore } from "@/stores/positions/closedPositionsStore";
import { Balance } from "@quadcode-tech/client-sdk-js";
import { useSettingsStore } from "@/stores/settingsStore";
import { useBreakWarningStore } from "@/stores/notifications/breakWarningStore";

export default function useCalculateBreakWarning() {
  const balancesRef = useRef<Balance[]>([]);
  const { sdk } = useSdk();

  const { assets } = useAssetStore();
  const { updateAutoTrade, getAutoTrade } = useTradingStore();
  const { closedPositions } = useClosedPositionsStore();
  const { tradingLimits } = useSettingsStore();
  const { recordBreakWarning, getActiveWarning } = useBreakWarningStore();

  useEffect(() => {
    sdk.balances().then((balances) => {
      balancesRef.current = balances.getBalances();
    });
  }, [sdk, balancesRef]);

  useEffect(() => {
    if (!tradingLimits.breakWarning.enabled) {
      return;
    }

    const { breakWarning } = tradingLimits;

    const {
      timeWindow,
      minOrdersRequired,
      lossThreshold,
      pauseAutoTrade,
      pauseDuration,
    } = breakWarning;

    const currentTime = new Date().getTime();

    const allBalances = balancesRef.current;
    for (const balance of allBalances) {
      const activeWarning = getActiveWarning(balance.id);
      if (activeWarning) {
        continue;
      }

      const timeWindowMs = currentTime - timeWindow * 60 * 1000;

      const positionsInTimeWindow = closedPositions.filter((position) => {
        return (
          position.balanceId === balance.id &&
          position.closeTime &&
          position.closeTime.getTime() >= timeWindowMs
        );
      });

      if (positionsInTimeWindow.length < minOrdersRequired) {
        continue;
      }

      const positionsInLossThreshold = positionsInTimeWindow.filter(
        (position) => {
          return position.pnl && position.pnl < 0;
        }
      );

      if (positionsInLossThreshold.length < lossThreshold) {
        continue;
      }

      const pauseDurationMs = pauseDuration * 60 * 1000;
      const expiresAt = currentTime + pauseDurationMs;

      recordBreakWarning({
        balance: {
          balanceId: balance.id,
          balanceType: balance.type!,
          balanceCurrency: balance.currency!,
        },
        timeWindow,
        totalOrders: positionsInTimeWindow.length,
        lossCount: positionsInLossThreshold.length,
        settings: breakWarning,
        expiresAt,
      });
      if (pauseAutoTrade) {
        // turn off auto trade
        assets.forEach((assetTab) => {
          const autoTrade = getAutoTrade(assetTab.id);
          if (autoTrade) {
            updateAutoTrade(assetTab.id, {
              enable: false,
              amount: autoTrade.amount,
            });
          }
        });
      }
    }
  }, [
    tradingLimits,
    assets,
    updateAutoTrade,
    getAutoTrade,
    closedPositions,
    recordBreakWarning,
    getActiveWarning,
    balancesRef,
  ]);

  return null;
}
