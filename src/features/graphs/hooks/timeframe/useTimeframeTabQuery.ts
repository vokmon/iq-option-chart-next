import { useAssetStore } from "@/stores/assets/assetStore";

export interface UseTimeframeTabQueryReturn {
  timeframeInMinute: number;
  updateTimeframe: (timeframeInMinute: number) => void;
}

export function useTimeframeTabQuery(): UseTimeframeTabQueryReturn {
  const { getActiveAsset, updateTimeframe } = useAssetStore();

  const asset = getActiveAsset();
  const timeframeInMinute = asset?.timeframeInMinute || 15;

  const handleUpdateTimeframe = (newTimeframe: number) => {
    if (!asset?.id) return;
    updateTimeframe(asset.id, newTimeframe);
  };

  return {
    timeframeInMinute,
    updateTimeframe: handleUpdateTimeframe,
  };
}
