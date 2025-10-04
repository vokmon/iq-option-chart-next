import { useAssetStore } from "@/stores/assetStore";
import { useDigitalOptionsStore } from "@/stores/digitalOptionsStore";

export function useAvailableAssets() {
  const { actives } = useDigitalOptionsStore();
  const { getAvailableAssets, getActiveAsset } = useAssetStore();
  const activeAsset = getActiveAsset();

  const availableAssets = getAvailableAssets(actives);

  // Include the current asset's data in available options if it exists
  if (activeAsset?.asset) {
    const currentAsset = activeAsset.asset;
    const isAlreadyIncluded = availableAssets.some(
      (asset) => asset.activeId === currentAsset.activeId
    );
    if (!isAlreadyIncluded) {
      return [currentAsset, ...availableAssets];
    }
  }

  return availableAssets;
}
