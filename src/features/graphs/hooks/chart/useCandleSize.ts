import { useCallback } from "react";
import { useAssetStore } from "@/stores/assetStore";

export function useCandleSize() {
  const { activeAssetId, getActiveAsset, updateCandleSize } = useAssetStore();

  const handleCandleSizeChange = useCallback(
    (candleSize: string | null) => {
      if (!activeAssetId || !candleSize) return;

      let timeframeInMinute = 60;
      if (candleSize === "60") {
        timeframeInMinute = 15;
      } else if (candleSize === "300") {
        timeframeInMinute = 60;
      }
      updateCandleSize(activeAssetId, parseInt(candleSize), timeframeInMinute);
    },
    [activeAssetId, updateCandleSize]
  );

  const activeAsset = getActiveAsset();
  const currentCandleSize = activeAsset ? String(activeAsset.candleSize) : "";

  return {
    currentCandleSize,
    handleCandleSizeChange,
  };
}
