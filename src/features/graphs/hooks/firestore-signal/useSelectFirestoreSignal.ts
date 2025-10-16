import { useAssetStore } from "@/stores/assets/assetStore";
import { DigitalOptionsUnderlying } from "@quadcode-tech/client-sdk-js";

export function useSelectFirestoreSignal() {
  const { activeAssetId, updateAsset } = useAssetStore();

  const handleSelectSignal = (active: DigitalOptionsUnderlying) => {
    if (activeAssetId) {
      updateAsset(activeAssetId, active);
    }
  };

  return {
    handleSelectSignal,
  };
}
