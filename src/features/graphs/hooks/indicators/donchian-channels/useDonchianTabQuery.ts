import { useAssetStore } from "@/stores/assets/assetStore";
import { type DonchianConfig } from "@/types/indicators/donchian";

export interface UseDonchianTabQueryReturn {
  showDonchian: boolean;
  setShowDonchian: (show: boolean) => void;
  donchianConfig: DonchianConfig;
  updateDonchianPeriod: (period: number) => void;
}

export function useDonchianTabQuery(): UseDonchianTabQueryReturn {
  const { getActiveAsset, updateIndicators } = useAssetStore();

  const asset = getActiveAsset();
  const donchianSettings = asset?.indicators.donchian || {
    enabled: true,
    config: { period: 20 },
  };

  const showDonchian = donchianSettings.enabled;
  const donchianConfig = donchianSettings.config;

  const setShowDonchian = (show: boolean) => {
    if (!asset?.id) return;
    updateIndicators(asset.id, {
      donchian: {
        ...donchianSettings,
        enabled: show,
      },
    });
  };

  const updateDonchianPeriod = (period: number) => {
    if (!asset?.id) return;
    updateIndicators(asset.id, {
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
