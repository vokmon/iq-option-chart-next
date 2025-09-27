import { useAssetChartStore } from "@/stores/assetStore";
import { type DonchianConfig } from "@/types/indicators/donchian";

export interface UseDonchianTabQueryReturn {
  showDonchian: boolean;
  setShowDonchian: (show: boolean) => void;
  donchianConfig: DonchianConfig;
  updateDonchianPeriod: (period: number) => void;
}

export function useDonchianTabQuery(
  chartId: string | null
): UseDonchianTabQueryReturn {
  const { charts, updateChartIndicators } = useAssetChartStore();

  const chart = charts.find((c) => c.id === chartId);
  const donchianSettings = chart?.indicators.donchian || {
    enabled: true,
    config: { period: 20 },
  };

  const showDonchian = donchianSettings.enabled;
  const donchianConfig = donchianSettings.config;

  const setShowDonchian = (show: boolean) => {
    if (!chartId) return;
    updateChartIndicators(chartId, {
      donchian: {
        ...donchianSettings,
        enabled: show,
      },
    });
  };

  const updateDonchianPeriod = (period: number) => {
    if (!chartId) return;
    updateChartIndicators(chartId, {
      donchian: {
        ...donchianSettings,
        config: {
          ...donchianConfig,
          period,
        },
      },
    });
  };

  return {
    showDonchian,
    setShowDonchian,
    donchianConfig,
    updateDonchianPeriod,
  };
}
