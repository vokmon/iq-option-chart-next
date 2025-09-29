"use client";
import { Divider, Flex, Select } from "@mantine/core";
import { AssetSelector } from "../input/AssetSelector";
import { useTranslations } from "next-intl";
import { useEffect } from "react";
import TradingPanelController from "../input/TradingPanelController";
import { useAssetSelection, useCandleSize } from "../../hooks/chart";

const candleSizes = [60, 300];

export default function ChartSidebar() {
  const t = useTranslations();

  // Use custom hooks for asset selection and candle size management
  const { activeAsset, activeAssetId, handleAssetSelect } = useAssetSelection();
  const { currentCandleSize, handleCandleSizeChange } = useCandleSize();

  // Auto-select asset when it changes
  useEffect(() => {
    if (activeAsset?.asset?.activeId) {
      handleAssetSelect(String(activeAsset?.asset?.activeId));
    }
  }, [activeAsset?.asset?.activeId, handleAssetSelect]);

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
      <Flex className="h-10 border border-gray-200">Signal Indicators</Flex>
      <Flex className="flex-1 border border-gray-200">Trade History</Flex>
      <Flex className="h-10 border border-gray-200">Summary for Today</Flex>
    </Flex>
  );
}
