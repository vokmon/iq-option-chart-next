import { useAssetStore } from "@/stores/assetStore";
import { type StochasticConfig } from "@/types/indicators/stochastic";

export interface UseStochasticTabQueryReturn {
  showStochastic: boolean;
  setShowStochastic: (show: boolean) => void;
  stochasticConfig: StochasticConfig;
  updateKPeriod: (kPeriod: number) => void;
  updateDPeriod: (dPeriod: number) => void;
  updateSmoothing: (smoothing: number) => void;
}

export function useStochasticTabQuery(): UseStochasticTabQueryReturn {
  const { getActiveAsset, updateIndicators } = useAssetStore();

  const asset = getActiveAsset();
  const stochasticSettings = asset?.indicators.stochastic || {
    enabled: true,
    config: { kPeriod: 13, dPeriod: 3, smoothing: 3 },
  };

  const showStochastic = stochasticSettings.enabled;
  const stochasticConfig = stochasticSettings.config;

  const setShowStochastic = (show: boolean) => {
    if (!asset?.id) return;
    updateIndicators(asset.id, {
      stochastic: {
        ...stochasticSettings,
        enabled: show,
      },
    });
  };

  const updateKPeriod = (kPeriod: number) => {
    if (!asset?.id) return;
    updateIndicators(asset.id, {
      stochastic: {
        ...stochasticSettings,
        config: {
          ...stochasticConfig,
          kPeriod,
        },
      },
    });
  };

  const updateDPeriod = (dPeriod: number) => {
    if (!asset?.id) return;
    updateIndicators(asset.id, {
      stochastic: {
        ...stochasticSettings,
        config: {
          ...stochasticConfig,
          dPeriod,
        },
      },
    });
  };

  const updateSmoothing = (smoothing: number) => {
    if (!asset?.id) return;
    updateIndicators(asset.id, {
      stochastic: {
        ...stochasticSettings,
        config: {
          ...stochasticConfig,
          smoothing,
        },
      },
    });
  };

  return {
    showStochastic,
    setShowStochastic,
    stochasticConfig,
    updateKPeriod,
    updateDPeriod,
    updateSmoothing,
  };
}
