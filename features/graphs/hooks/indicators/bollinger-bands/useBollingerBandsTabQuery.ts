import { useAssetChartStore } from "@/stores/assetStore";
import { type BollingerBandsConfig } from "@/types/indicators/bollingerBands";

export interface UseBollingerBandsTabQueryReturn {
  showBollingerBands: boolean;
  setShowBollingerBands: (show: boolean) => void;
  bollingerConfig: BollingerBandsConfig;
  updatePeriod: (period: number) => void;
  updateStdDev: (stdDev: number) => void;
}

export function useBollingerBandsTabQuery(
  chartId: string | null
): UseBollingerBandsTabQueryReturn {
  const { charts, updateChartIndicators } = useAssetChartStore();

  const chart = charts.find((c) => c.id === chartId);
  const bollingerSettings = chart?.indicators.bollingerBands || {
    enabled: true,
    config: { period: 14, stdDev: 2 },
  };

  const showBollingerBands = bollingerSettings.enabled;
  const bollingerConfig = bollingerSettings.config;

  const setShowBollingerBands = (show: boolean) => {
    if (!chartId) return;
    updateChartIndicators(chartId, {
      bollingerBands: {
        ...bollingerSettings,
        enabled: show,
      },
    });
  };

  const updatePeriod = (period: number) => {
    if (!chartId) return;
    updateChartIndicators(chartId, {
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
    if (!chartId) return;
    updateChartIndicators(chartId, {
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
