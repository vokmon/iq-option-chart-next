import { useAssetStore } from "@/stores/assetStore";
import { type SupportResistanceConfig } from "@/types/indicators/supportResistance";

export interface UseSupportResistanceTabQueryReturn {
  showSupportResistance: boolean;
  setShowSupportResistance: (show: boolean) => void;
  supportResistanceConfig: SupportResistanceConfig;
  updateBoxPeriod: (boxPeriod: number) => void;
}

export function useSupportResistanceTabQuery(): UseSupportResistanceTabQueryReturn {
  const { getActiveAsset, updateIndicators } = useAssetStore();

  const asset = getActiveAsset();
  const supportResistanceSettings = asset?.indicators.supportResistance || {
    enabled: true,
    config: { boxPeriod: 25 },
  };

  const showSupportResistance = supportResistanceSettings.enabled;
  const supportResistanceConfig = supportResistanceSettings.config;

  const setShowSupportResistance = (show: boolean) => {
    if (!asset?.id) return;
    updateIndicators(asset.id, {
      supportResistance: {
        ...supportResistanceSettings,
        enabled: show,
      },
    });
  };

  const updateBoxPeriod = (boxPeriod: number) => {
    if (!asset?.id) return;
    updateIndicators(asset.id, {
      supportResistance: {
        ...supportResistanceSettings,
        config: {
          ...supportResistanceConfig,
          boxPeriod,
        },
      },
    });
  };

  return {
    showSupportResistance,
    setShowSupportResistance,
    supportResistanceConfig,
    updateBoxPeriod,
  };
}
