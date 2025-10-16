import { AssetState, useAssetStore } from "@/stores/assets/assetStore";
import { useTradingStore } from "@/stores/assets/tradingStore";
import { RealTimeChartDataLayer, Candle } from "@quadcode-tech/client-sdk-js";
import { useEffect, useRef } from "react";
import { useSdk } from "@/hooks/useSdk";
import { calculateSignal } from "@/utils/indicators/signalCalculator";
import { SignalType } from "@/types/signal/Signal";
import { tradeEvent } from "../../events/tradeEvent";

const CANDLE_NUMBER = 100;

export function useCalculateAutoTrade() {
  const { sdk } = useSdk();
  const { autoTrade } = useTradingStore();
  const { assets } = useAssetStore();

  const unsubscribeFunctionsRef = useRef<(() => void)[]>([]);
  const timeoutsRef = useRef<Map<string, NodeJS.Timeout>>(new Map());

  useEffect(() => {
    const timeouts = timeoutsRef.current;

    const calculateTimeDifference = (candles: Candle[]) => {
      const latestCandle = candles[candles.length - 1];
      const to = latestCandle.to * 1000;
      const now = Date.now();
      return to - now;
    };

    const scheduleNextCalculation = async (
      chartLayer: RealTimeChartDataLayer,
      asset: AssetState
    ) => {
      const candles = await chartLayer.getAllCandles();
      const timeDifference = calculateTimeDifference(candles);

      if (timeDifference <= 0) {
        // If we're past the candle close time, fetch fresh data and try again
        const freshCandles = await chartLayer.fetchAllCandles(
          Math.floor(Date.now() / 1000) - asset.candleSize * CANDLE_NUMBER
        );
        const freshTimeDiff = calculateTimeDifference(freshCandles);
        if (freshTimeDiff <= 0) {
          return; // Still negative, skip this cycle
        }
      }

      const timeout = setTimeout(async () => {
        try {
          const candles = await chartLayer.getAllCandles();

          const candlesToAnalyze = candles.slice(-CANDLE_NUMBER);
          const signal = calculateSignal(candlesToAnalyze, {});

          if (signal.signal !== SignalType.HOLD) {
            // Dispatch the signal changed event
            // to trigger the auto trade in a different process
            // because we don't want to block the main thread
            tradeEvent.dispatchSignalChangedEvent(
              asset.asset!.activeId!,
              signal.signal
            );
          }

          // Wait a bit for the new candle to be available
          await new Promise((resolve) => setTimeout(resolve, 5000));

          // Schedule the next calculation recursively
          scheduleNextCalculation(chartLayer, asset);
        } catch (error) {
          console.error("Error in auto trade calculation:", error);
          // Retry after a delay on error
          setTimeout(() => scheduleNextCalculation(chartLayer, asset), 10000);
        }
      }, timeDifference);

      // Store timeout for cleanup, replacing any existing one for this asset
      const existingTimeout = timeouts.get(asset.id);
      if (existingTimeout) {
        clearTimeout(existingTimeout);
      }
      timeouts.set(asset.id, timeout);
    };

    const runCalculateAutoTrade = async (asset: AssetState) => {
      const activeId = asset?.asset?.activeId;
      const chartLayer = await sdk.realTimeChartDataLayer(
        activeId!,
        asset.candleSize
      );

      // Subscribe to chart data changes
      chartLayer.subscribeOnLastCandleChanged(async () => {
        // subscribe to last candle changed
      });

      unsubscribeFunctionsRef.current.push(() => {
        chartLayer.unsubscribeOnLastCandleChanged(() => {});
      });

      // Fetch initial candles
      const candles = await chartLayer.fetchAllCandles(
        Math.floor(Date.now() / 1000) - asset.candleSize * CANDLE_NUMBER
      );

      const timeDifference = calculateTimeDifference(candles);
      if (timeDifference <= 0) {
        return;
      }

      // Start the recursive scheduling
      scheduleNextCalculation(chartLayer, asset);
    };

    const calculateAutoTrade = async () => {
      const keys = Object.keys(autoTrade);
      const enabledAutoTradeAssetActiveIds = keys
        .filter((key) => autoTrade[key].enable)
        .map((key) => {
          const asset = assets.find((asset) => asset.id === key);
          return asset;
        });

      const promises = enabledAutoTradeAssetActiveIds.map((asset) =>
        runCalculateAutoTrade(asset!)
      );

      // Wait for all to complete
      try {
        await Promise.allSettled(promises);
      } catch (error) {
        console.error("Some signal calculations failed:", error);
      }
    };

    calculateAutoTrade();

    return () => {
      // Clear all timeouts
      timeouts.forEach((timeout) => {
        clearTimeout(timeout);
      });
      timeouts.clear();

      // Unsubscribe from chart data
      unsubscribeFunctionsRef.current.forEach((unsubscribe) => {
        unsubscribe();
      });
      unsubscribeFunctionsRef.current = [];
    };
  }, [assets, autoTrade, sdk]);
}
