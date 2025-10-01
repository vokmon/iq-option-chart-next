import { useAssetStore } from "@/stores/assetStore";
import { useSignalStore } from "@/stores/signalStore";
import { SignalType } from "@/types/signal/Signal";
import { useEffect, useTransition } from "react";

export function useCalculateSignal() {
  const { assets } = useAssetStore();
  const { setSignal, clearAllSignals } = useSignalStore();
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [_, startTransition] = useTransition();

  useEffect(() => {
    const signalTypes = [SignalType.CALL, SignalType.PUT, SignalType.HOLD];

    const calculateSignals = () => {
      assets.forEach((asset) => {
        if (asset.asset) {
          // Randomly select a signal type
          const randomSignal =
            signalTypes[Math.floor(Math.random() * signalTypes.length)];
          setSignal(asset.asset.activeId, randomSignal);
        }
      });
    };

    // Calculate signals immediately
    startTransition(() => {
      calculateSignals();
    });

    // Set up interval to recalculate signals every 5 seconds
    const interval = setInterval(() => {
      startTransition(() => {
        calculateSignals();
      });
    }, 5000);

    return () => {
      clearInterval(interval);
      clearAllSignals();
    };
  }, [assets, setSignal, clearAllSignals]);
}
