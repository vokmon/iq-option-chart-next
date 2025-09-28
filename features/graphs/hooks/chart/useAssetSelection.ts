import { useCallback } from "react";
import { useAssetStore } from "@/stores/assetStore";
import { DigitalOptionsUnderlying } from "@quadcode-tech/client-sdk-js";

export function useAssetSelection() {
  const { activeAssetId, getActiveAsset, updateAsset } = useAssetStore();

  const handleAssetSelect = useCallback(
    (activeId: string, actives: DigitalOptionsUnderlying[]) => {
      if (!activeAssetId) return;

      if (activeId === "none") {
        updateAsset(activeAssetId, null);
      } else {
        const asset = actives.find((a) => String(a.activeId) === activeId);
        if (asset) {
          updateAsset(activeAssetId, asset);
        }
      }
    },
    [activeAssetId, updateAsset]
  );

  const activeAsset = getActiveAsset();

  return {
    activeAsset,
    activeAssetId,
    handleAssetSelect,
  };
}
