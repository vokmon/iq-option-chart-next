import { useAssetChartStore } from "@/stores/assetStore";
import { type StochasticConfig } from "@/types/indicators/stochastic";

export interface UseStochasticTabQueryReturn {
  showStochastic: boolean;
  setShowStochastic: (show: boolean) => void;
  stochasticConfig: StochasticConfig;
  updateKPeriod: (kPeriod: number) => void;
  updateDPeriod: (dPeriod: number) => void;
  updateSmoothing: (smoothing: number) => void;
}

export function useStochasticTabQuery(
  chartId: string | null
): UseStochasticTabQueryReturn {
  const { charts, updateChartIndicators } = useAssetChartStore();

  const chart = charts.find((c) => c.id === chartId);
  const stochasticSettings = chart?.indicators.stochastic || {
    enabled: true,
    config: { kPeriod: 13, dPeriod: 3, smoothing: 3 },
  };

  const showStochastic = stochasticSettings.enabled;
  const stochasticConfig = stochasticSettings.config;

  const setShowStochastic = (show: boolean) => {
    if (!chartId) return;
    updateChartIndicators(chartId, {
      stochastic: {
        ...stochasticSettings,
        enabled: show,
      },
    });
  };

  const updateKPeriod = (kPeriod: number) => {
    if (!chartId) return;
    updateChartIndicators(chartId, {
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
    if (!chartId) return;
    updateChartIndicators(chartId, {
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
    if (!chartId) return;
    updateChartIndicators(chartId, {
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
