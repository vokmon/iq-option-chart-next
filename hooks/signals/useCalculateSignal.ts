import { useAssetStore } from "@/stores/assetStore";
import { useSignalStore } from "@/stores/signalStore";
import { SignalType } from "@/types/signal/Signal";
import { useEffect } from "react";

export function useCalculateSignal() {
  const { assets } = useAssetStore();
  const { setSignal, clearAllSignals } = useSignalStore();

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

    calculateSignals();

    // Set up interval to recalculate signals every 10 seconds
    const interval = setInterval(() => {
      calculateSignals();
    }, 3000);

    return () => {
      clearInterval(interval);
      clearAllSignals();
    };
  }, [assets, setSignal, clearAllSignals]);
}
