"use client";
import { Flex } from "@mantine/core";
import { AssetSelector } from "../input/AssetSelector";
import { useEffect } from "react";
import TradingPanelController from "../input/TradingPanelController";
import { useAssetSelection } from "../../hooks/chart";
import CandleSizeSelector from "../input/CandleSizeSelector";
import TodayTradeSummary from "../displays/TodayTradeSummary";
import AssetSelectorAttentions from "@/components/cta/AssetSelectorAttentions";
import SignalPanelController from "../displays/SignalPanelController";
import AutoTradeSelectorController from "../input/AutoTradeSelectorController";

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
    <Flex w="100%" h="100%" direction="column" gap={3} style={{ minHeight: 0 }}>
      <Flex direction="row" gap={2}>
        <div className="relative w-full">
          {!activeAsset?.asset && <AssetSelectorAttentions />}
          <AssetSelector
            key={activeAssetId} // Force re-render when active asset changes
            className="w-full"
            selectedActiveId={
              activeAsset?.asset ? String(activeAsset.asset.activeId) : "none"
            }
            onAssetSelect={handleAssetSelect}
          />
        </div>

        <CandleSizeSelector
          key={`candle-${activeAssetId}`} // Force re-render when active asset changes
        />
      </Flex>
      <TradingPanelController />
      <Flex className="h-12">
        <SignalPanelController />
      </Flex>
      <Flex className="h-10">
        <AutoTradeSelectorController />
      </Flex>
      <Flex className="">
        <TodayTradeSummary />
      </Flex>
    </Flex>
  );
}
