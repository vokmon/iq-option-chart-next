import { useTradingStore } from "@/stores/assets/tradingStore";
import { useAssetStore } from "@/stores/assets/assetStore";
import { useCallback } from "react";
import { MartingaleSettings } from "@/types/martingale";

export function useHandleMartingale() {
  const { activeAssetId } = useAssetStore();
  const { getMartingale, updateMartingale } = useTradingStore();
  const martingale = getMartingale(activeAssetId!);

  const handleUpdateMartingale = useCallback(
    (settings: MartingaleSettings) => {
      updateMartingale(activeAssetId!, settings);
    },
    [activeAssetId, updateMartingale]
  );

  return {
    martingale,
    handleUpdateMartingale: handleUpdateMartingale,
  };
}
