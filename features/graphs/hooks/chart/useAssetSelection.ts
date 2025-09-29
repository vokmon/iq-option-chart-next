import { useCallback } from "react";
import { useAssetStore } from "@/stores/assetStore";
import { useDigitalOptionsStore } from "@/stores/digitalOptionsStore";

export function useAssetSelection() {
  const { activeAssetId, getActiveAsset, updateAsset } = useAssetStore();
  const { actives } = useDigitalOptionsStore();

  const handleAssetSelect = useCallback(
    (activeId: string) => {
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
    [activeAssetId, updateAsset, actives]
  );

  const activeAsset = getActiveAsset();

  return {
    activeAsset,
    activeAssetId,
    handleAssetSelect,
  };
}
