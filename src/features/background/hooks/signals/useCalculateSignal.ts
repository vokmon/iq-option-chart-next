import { AssetState, useAssetStore } from "@/stores/assets/assetStore";
import { useSignalStore } from "@/stores/signalStore";
import { useEffect, useRef } from "react";
import { useSdk } from "@/hooks/useSdk";
import { calculateSignal } from "@/utils/indicators/signalCalculator";

const CANDLE_NUMBER = 100;
const SIGNAL_INTERVAL_SECONDS = 3;

export function useCalculateSignal() {
  const { sdk } = useSdk();
  const { assets } = useAssetStore();
  const { setSignalIfChanged, clearAllSignals } = useSignalStore();
  const unsubscribeFunctionsRef = useRef<(() => void)[]>([]);

  useEffect(() => {
    const runCalculateSignal = async (asset: AssetState) => {
      const activeId = asset?.asset?.activeId;

      try {
        const chartLayer = await sdk.realTimeChartDataLayer(
          activeId!,
          asset.candleSize
        );
        await chartLayer.fetchAllCandles(
          Math.floor(Date.now() / 1000) - asset.candleSize * CANDLE_NUMBER
        );

        // Track last processed second to avoid multiple executions per asset
        // let lastProcessedTime = 0;

        let lastProcessedTime = 0;

        const interval = setInterval(() => {
          const time = new Date();
          const currentSeconds = time.getSeconds();
          if (currentSeconds === lastProcessedTime) {
            return;
          }
          lastProcessedTime = time.getSeconds();

          const allCandles = chartLayer.getAllCandles();
          const candlesToAnalyze = allCandles.slice(-CANDLE_NUMBER);

          const signal = calculateSignal(candlesToAnalyze, {});

          setSignalIfChanged(activeId!, signal.signal);
        }, SIGNAL_INTERVAL_SECONDS * 1000);

        chartLayer.subscribeOnLastCandleChanged(async () => {
          // subscribe to last candle changed
        });

        unsubscribeFunctionsRef.current.push(() => {
          clearInterval(interval);
          chartLayer.unsubscribeOnLastCandleChanged(() => {});
        });
      } catch (error) {
        console.error(activeId, error);
      }
    };

    const calculateSignals = async () => {
      // Run all calculateSignal calls in parallel
      const promises = assets
        .filter((asset) => asset.asset)
        .map((asset) => runCalculateSignal(asset));

      // Wait for all to complete
      try {
        await Promise.allSettled(promises);
      } catch (error) {
        console.error("Some signal calculations failed:", error);
      }
    };

    calculateSignals();

    return () => {
      unsubscribeFunctionsRef.current.forEach((unsubscribe) => {
        unsubscribe();
      });
      unsubscribeFunctionsRef.current = [];
      clearAllSignals();
    };
  }, [assets, setSignalIfChanged, clearAllSignals, sdk]);
}
