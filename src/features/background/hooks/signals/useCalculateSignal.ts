import { AssetState, useAssetStore } from "@/stores/assetStore";
import { useSignalStore } from "@/stores/signalStore";
import { useEffect } from "react";
import { useSdk } from "@/hooks/useSdk";
import { calculateSignal } from "@/utils/indicators/signalCalculator";
import { tradeEvent } from "../../events/tradeEvent";
import { SignalType } from "@/types/signal/Signal";

const CANDLE_NUMBER = 100;
const SIGNAL_INTERVAL_SECONDS = 3;

export function useCalculateSignal() {
  const { sdk } = useSdk();
  const { assets } = useAssetStore();
  const { setSignalIfChanged, clearAllSignals } = useSignalStore();

  useEffect(() => {
    const unsubscribeFunctions: (() => void)[] = [];

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

          // calculate signal here
          // console.log(
          //   activeId,
          //   `Signal calculation triggered at ${sdk.currentTime().getTime()}`,
          //   `currentSeconds: ${currentSeconds}`,
          //   // `lastProcessedTime: ${lastProcessedTime}`,
          //   `difference: ${endTime} ms`,
          //   candles.length,
          //   candlesToAnalyze.length,
          //   candlesToAnalyze[candlesToAnalyze.length - 1]?.id
          // );
          const signal = calculateSignal(candlesToAnalyze, {});
          // const signal = [{ signal: SignalType.CALL }][
          //   Math.floor(Math.random() * 1)
          // ];
          const changed = setSignalIfChanged(activeId!, signal.signal);
          if (changed && signal.signal !== SignalType.HOLD) {
            tradeEvent.dispatchSignalChangedEvent(activeId!, signal.signal);
          }

          // For Testing
          // setSignalIfChanged(
          //   activeId!,
          //   [SignalType.HOLD, SignalType.CALL, SignalType.PUT][
          //     Math.floor(Math.random() * 3)
          //   ]
          // );
          // const endTime = new Date().getTime() - time.getTime();

          // if (signal.signal !== SignalType.HOLD) {
          //   console.log(
          //     activeId,
          //     asset.asset?.name,
          //     `Signal calculation triggered at ${time.getTime()}`,
          //     `difference: ${endTime} ms`,
          //     signal
          //   );
          // }
        }, SIGNAL_INTERVAL_SECONDS * 1000);

        chartLayer.subscribeOnLastCandleChanged(async () => {
          // subscribe to last candle changed
        });

        unsubscribeFunctions.push(() => {
          clearInterval(interval);
          chartLayer.unsubscribeOnLastCandleChanged(() => {});
        });
      } catch (error) {
        console.error(activeId, error);
      }
    };

    const calculateSignals = async () => {
      // Run all calculateSignal calls in parallel
      const promises = assets.map((asset) => runCalculateSignal(asset));

      // Wait for all to complete
      try {
        await Promise.allSettled(promises);
      } catch (error) {
        console.error("Some signal calculations failed:", error);
      }
    };

    calculateSignals();

    return () => {
      unsubscribeFunctions.forEach((unsubscribe) => {
        unsubscribe();
      });
      clearAllSignals();
    };
  }, [assets, setSignalIfChanged, clearAllSignals, sdk]);
}
