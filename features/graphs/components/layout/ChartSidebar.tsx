"use client";
import { Divider, Flex, Select } from "@mantine/core";
import { AssetSelector } from "../input/AssetSelector";
import { useTranslations } from "next-intl";
import { DigitalOptionsUnderlying } from "@quadcode-tech/client-sdk-js";
import { useEffect } from "react";
import TradingPanelController from "../input/TradingPanelController";
import {
  useAssetSelection,
  useCandleSize,
  useAvailableAssets,
} from "../../hooks/chart";

const candleSizes = [60, 300];

type ChartSidebarProps = {
  actives: DigitalOptionsUnderlying[];
};

export default function ChartSidebar({ actives }: ChartSidebarProps) {
  const t = useTranslations();

  // Use custom hooks for asset selection and candle size management
  const { activeAsset, activeAssetId, handleAssetSelect } = useAssetSelection();
  const { currentCandleSize, handleCandleSizeChange } = useCandleSize();
  const availableAssets = useAvailableAssets(actives, activeAsset);

  // Auto-select asset when it changes
  useEffect(() => {
    if (activeAsset?.asset?.activeId && actives && actives.length > 0) {
      handleAssetSelect(String(activeAsset?.asset?.activeId), actives);
    }
  }, [activeAsset?.asset?.activeId, actives, handleAssetSelect]);

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
          onAssetSelect={(activeId) => handleAssetSelect(activeId, actives)}
        />

        <Select
          key={`candle-${activeAssetId}`} // Force re-render when active asset changes
          label={t("Candle Size")}
          placeholder={t("Choose candle size")}
          value={currentCandleSize}
          onChange={handleCandleSizeChange}
          data={candleSizes.map((s) => ({
            value: String(s),
            label: `${s / 60} min`,
          }))}
        />
      </Flex>
      <Divider />
      <TradingPanelController />
      <Flex className="h-10 border border-gray-200" />
      <Flex className="flex-1 border border-gray-200" />
      <Flex className="h-10 border border-gray-200" />
    </Flex>
  );
}
