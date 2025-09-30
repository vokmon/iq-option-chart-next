"use client";
import { Divider, Flex } from "@mantine/core";
import { AssetSelector } from "../input/AssetSelector";
import { useEffect } from "react";
import TradingPanelController from "../input/TradingPanelController";
import { useAssetSelection } from "../../hooks/chart";
import CandleSizeSelector from "../input/CandleSizeSelector";
import PositionTableController from "../displays/PositionTableController";
import TodayTradeSummary from "../displays/TodayTradeSummary";

export default function ChartSidebar() {
  // Use custom hooks for asset selection and candle size management
  const { activeAsset, activeAssetId, handleAssetSelect } = useAssetSelection();

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

        <CandleSizeSelector
          key={`candle-${activeAssetId}`} // Force re-render when active asset changes
        />
      </Flex>
      <Divider />
      <TradingPanelController />
      <Flex className="h-15 border border-gray-200">Signal Indicators</Flex>
      <Flex className="flex-1 w-full relative">
        <PositionTableController />
      </Flex>
      <Flex className="h-15">
        <TodayTradeSummary />
      </Flex>
    </Flex>
  );
}
