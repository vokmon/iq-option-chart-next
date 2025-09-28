import { useEffect, useState } from "react";
import { useAssetStore } from "@/stores/assetStore";
import { DigitalOptionsUnderlying } from "@quadcode-tech/client-sdk-js";

export function useAvailableAssets(
  actives: DigitalOptionsUnderlying[],
  activeAsset: { asset: DigitalOptionsUnderlying | null } | undefined
) {
  const [availableAssets, setAvailableAssets] = useState<
    DigitalOptionsUnderlying[]
  >([]);

  // Update available assets when assets change
  useEffect(() => {
    const { getAvailableAssets } = useAssetStore.getState();
    const availableAssets = getAvailableAssets(actives);

    // Include the current asset's data in available options if it exists
    if (activeAsset?.asset) {
      const currentAsset = activeAsset.asset;
      const isAlreadyIncluded = availableAssets.some(
        (asset) => asset.activeId === currentAsset.activeId
      );
      if (!isAlreadyIncluded) {
        setAvailableAssets([currentAsset, ...availableAssets]);
      } else {
        setAvailableAssets(availableAssets);
      }
    } else {
      setAvailableAssets(availableAssets);
    }
  }, [actives, activeAsset?.asset]);

  return availableAssets;
}
