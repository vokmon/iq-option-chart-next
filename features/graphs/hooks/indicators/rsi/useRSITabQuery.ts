import { useAssetStore } from "@/stores/assetStore";
import { type RSIConfig } from "@/types/indicators/rsi";

export interface UseRSITabQueryReturn {
  showRSI: boolean;
  setShowRSI: (show: boolean) => void;
  rsiConfig: RSIConfig;
  updatePeriod: (period: number) => void;
}

export function useRSITabQuery(): UseRSITabQueryReturn {
  const { getActiveAsset, updateIndicators } = useAssetStore();

  const asset = getActiveAsset();
  const rsiSettings = asset?.indicators.rsi || {
    enabled: true,
    config: { period: 14 },
  };

  const showRSI = rsiSettings.enabled;
  const rsiConfig = rsiSettings.config;

  const setShowRSI = (show: boolean) => {
    if (!asset?.id) return;
    updateIndicators(asset.id, {
      rsi: {
        ...rsiSettings,
        enabled: show,
      },
    });
  };

  const updatePeriod = (period: number) => {
    if (!asset?.id) return;
    updateIndicators(asset.id, {
      rsi: {
        ...rsiSettings,
        config: {
          ...rsiConfig,
          period,
        },
      },
    });
  };

  return {
    showRSI,
    setShowRSI,
    rsiConfig,
    updatePeriod,
  };
}
