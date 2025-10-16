import { useAssetStore } from "@/stores/assets/assetStore";
import { type BollingerBandsConfig } from "@/types/indicators/bollingerBands";

export interface UseBollingerBandsTabQueryReturn {
  showBollingerBands: boolean;
  setShowBollingerBands: (show: boolean) => void;
  bollingerConfig: BollingerBandsConfig;
  updatePeriod: (period: number) => void;
  updateStdDev: (stdDev: number) => void;
}

export function useBollingerBandsTabQuery(): UseBollingerBandsTabQueryReturn {
  const { getActiveAsset, updateIndicators } = useAssetStore();

  const asset = getActiveAsset();
  const bollingerSettings = asset?.indicators.bollingerBands || {
    enabled: true,
    config: { period: 14, stdDev: 2 },
  };

  const showBollingerBands = bollingerSettings.enabled;
  const bollingerConfig = bollingerSettings.config;

  const setShowBollingerBands = (show: boolean) => {
    if (!asset?.id) return;
    updateIndicators(asset.id, {
      bollingerBands: {
        ...bollingerSettings,
        enabled: show,
      },
    });
  };

  const updatePeriod = (period: number) => {
    if (!asset?.id) return;
    updateIndicators(asset.id, {
      bollingerBands: {
        ...bollingerSettings,
        config: {
          ...bollingerConfig,
          period,
        },
      },
    });
  };

  const updateStdDev = (stdDev: number) => {
    if (!asset?.id) return;
    updateIndicators(asset.id, {
      bollingerBands: {
        ...bollingerSettings,
        config: {
          ...bollingerConfig,
          stdDev,
        },
      },
    });
  };

  return {
    showBollingerBands,
    setShowBollingerBands,
    bollingerConfig,
    updatePeriod,
    updateStdDev,
  };
}
