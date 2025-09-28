"use client";
import { Divider, Flex, Select } from "@mantine/core";
import { AssetSelector } from "../input/AssetSelector";
import { useAssetStore } from "@/stores/assetStore";
import { useTranslations } from "next-intl";
import { DigitalOptionsUnderlying } from "@quadcode-tech/client-sdk-js";
import { useEffect, useState } from "react";
import { BollingerBandsComponent } from "../indicators/bollinger/BollingerBandsComponent";
import { DonchianComponent } from "../indicators/donchian/DonchianComponent";
import { StochasticComponent } from "../indicators/stochastic/StochasticComponent";
import TradingPanelController from "../input/TradingPanelController";

const candleSizes = [60, 300];

type ChartSidebarProps = {
  actives: DigitalOptionsUnderlying[];
};

export default function ChartSidebar({ actives }: ChartSidebarProps) {
  const t = useTranslations();
  const { activeAssetId, getActiveAsset, updateAsset, updateCandleSize } =
    useAssetStore();

  const activeAsset = getActiveAsset();

  const [availableAssets, setAvailableAssets] = useState<
    DigitalOptionsUnderlying[]
  >([]);

  // Update available assets when assets change
  useEffect(() => {
    const { getAvailableAssets } = useAssetStore.getState();
    const availableAssets = getAvailableAssets(actives);

    // Include the current asset's data in available options if it exists
    if (activeAsset?.asset) {
      const currentAsset = activeAsset.asset;
      const isAlreadyIncluded = availableAssets.some(
        (asset) => asset.activeId === currentAsset.activeId
      );
      if (!isAlreadyIncluded) {
        setAvailableAssets([currentAsset, ...availableAssets]);
      } else {
        setAvailableAssets(availableAssets);
      }
    } else {
      setAvailableAssets(availableAssets);
    }
  }, [actives, activeAsset?.asset]);

  const handleAssetSelect = (activeId: string) => {
    if (!activeAssetId) return;

    if (activeId === "none") {
      updateAsset(activeAssetId, null);
    } else {
      const asset = actives.find((a) => String(a.activeId) === activeId);
      if (asset) {
        updateAsset(activeAssetId, asset);
      }
    }
  };

  const handleCandleSizeChange = (candleSize: string | null) => {
    if (!activeAssetId || !candleSize) return;
    updateCandleSize(activeAssetId, parseInt(candleSize));
  };

  return (
    <Flex
      w="100%"
      h="100%"
      direction="column"
      gap="xs"
      style={{ minHeight: 0 }}
    >
      <Flex direction="row" gap="md">
        <AssetSelector
          key={activeAssetId} // Force re-render when active asset changes
          actives={availableAssets}
          className="w-full"
          selectedActiveId={
            activeAsset?.asset ? String(activeAsset.asset.activeId) : "none"
          }
          onAssetSelect={handleAssetSelect}
        />

        <Select
          key={`candle-${activeAssetId}`} // Force re-render when active asset changes
          label={t("Candle Size")}
          placeholder={t("Choose candle size")}
          value={activeAsset ? String(activeAsset.candleSize) : ""}
          onChange={handleCandleSizeChange}
          data={candleSizes.map((s) => ({
            value: String(s),
            label: `${s / 60} min`,
          }))}
        />
      </Flex>
      <Divider />

      <Flex direction="column" gap="xs">
        <BollingerBandsComponent />
        <DonchianComponent />
        <StochasticComponent />
      </Flex>
      <TradingPanelController />

      <Flex className="flex-1 border border-gray-200" />
      <Flex className="h-10 border border-gray-200" />
    </Flex>
  );
}
