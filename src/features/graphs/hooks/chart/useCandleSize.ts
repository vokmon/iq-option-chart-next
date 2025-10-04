import { useCallback } from "react";
import { useAssetStore } from "@/stores/assetStore";

export function useCandleSize() {
  const { activeAssetId, getActiveAsset, updateCandleSize } = useAssetStore();

  const handleCandleSizeChange = useCallback(
    (candleSize: string | null) => {
      if (!activeAssetId || !candleSize) return;
      updateCandleSize(activeAssetId, parseInt(candleSize));
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
