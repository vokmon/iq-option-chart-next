import { useAssetStore } from "@/stores/assetStore";

const MINIMUM_BAR_SPACING_FOR_ONE_MINUTE = 70 * 15;
const RIGHT_OFFSET = 2 * 15;

export function useTimeframeChart() {
  const { getActiveAsset } = useAssetStore();
  const asset = getActiveAsset();
  const timeframeInMinute = asset?.timeframeInMinute || 15;
  const denominatorCandleSize = (asset?.candleSize || 60) / 60;

  const minimumBarSpacing =
    (MINIMUM_BAR_SPACING_FOR_ONE_MINUTE / timeframeInMinute) *
    denominatorCandleSize;

  const rightOffset = RIGHT_OFFSET / denominatorCandleSize / timeframeInMinute;

  return {
    minimumBarSpacing,
    rightOffset,
  };
}
