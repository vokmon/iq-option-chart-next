import { Flex, Text, Center, Stack } from "@mantine/core";
import { Chart } from "../Chart";
import { StochasticChart } from "../StochasticChart";
import { AssetSelector } from "../input/AssetSelector";
import { BollingerBandsComponent } from "../indicators/bollinger/BollingerBandsComponent";
import { DonchianComponent } from "../indicators/donchian/DonchianComponent";
import { StochasticComponent } from "../indicators/stochastic/StochasticComponent";
import { useAssetChartStore } from "@/stores/assetStore";
import { DigitalOptionsUnderlying } from "@quadcode-tech/client-sdk-js";
import { useTranslations } from "next-intl";
import { Select, Divider } from "@mantine/core";
import { useEffect, useState } from "react";

const candleSizes = [60, 300];

interface TabContentProps {
  actives: DigitalOptionsUnderlying[];
}

export function TabContent({ actives }: TabContentProps) {
  const t = useTranslations();
  const { activeChartId, charts, updateChartAsset, updateChartCandleSize } =
    useAssetChartStore();

  const [availableAssets, setAvailableAssets] = useState<
    DigitalOptionsUnderlying[]
  >([]);

  const activeChart = charts.find((chart) => chart.id === activeChartId);

  // Update available assets when charts change
  useEffect(() => {
    const { getAvailableAssets } = useAssetChartStore.getState();
    const availableAssets = getAvailableAssets(actives);

    // Include the current chart's asset in available options if it exists
    if (activeChart?.asset) {
      const currentAsset = activeChart.asset;
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
  }, [actives, charts, activeChart?.asset]);

  const handleAssetSelect = (activeId: string) => {
    if (!activeChartId) return;

    if (activeId === "none") {
      updateChartAsset(activeChartId, null);
    } else {
      const asset = actives.find((a) => String(a.activeId) === activeId);
      if (asset) {
        updateChartAsset(activeChartId, asset);
      }
    }
  };

  const handleCandleSizeChange = (candleSize: string | null) => {
    if (!activeChartId || !candleSize) return;
    updateChartCandleSize(activeChartId, parseInt(candleSize));
  };

  if (!activeChart) {
    return (
      <Center h="100%" style={{ minHeight: 400 }}>
        <Stack align="center" gap="md">
          <Text size="lg" c="dimmed">
            {t("No active tab")}
          </Text>
          <Text size="sm" c="dimmed">
            {t("Select a tab or create a new one")}
          </Text>
        </Stack>
      </Center>
    );
  }

  return (
    <Flex direction="column" gap="sm" p={10} w="100%" h="100%">
      <Flex gap="sm" style={{ flex: 1, minHeight: 0 }}>
        <Flex direction="column" w="80%" style={{ minHeight: 0 }}>
          {activeChart.asset && activeChart.asset !== null ? (
            <>
              <Chart
                activeId={activeChart.asset.activeId}
                candleSize={activeChart.candleSize}
                chartHeight={window.innerHeight - 350}
                chartMinutesBack={60}
                tabId={activeChartId}
              />
              <div className="my-4" />
              <StochasticChart
                activeId={activeChart.asset.activeId}
                candleSize={activeChart.candleSize}
                chartHeight={120}
                chartMinutesBack={60}
                tabId={activeChartId}
              />
            </>
          ) : (
            <Center h="100%" style={{ minHeight: 400 }}>
              <Stack align="center" gap="md">
                <Text size="lg" c="dimmed">
                  {t("Select an asset to view chart")}
                </Text>
                <Text size="sm" c="dimmed">
                  {t("Choose an asset from the panel on the right")}
                </Text>
              </Stack>
            </Center>
          )}
        </Flex>

        <Flex w="20%" direction="column" gap="sm" style={{ minHeight: 0 }}>
          <Flex direction="row" gap="md">
            <AssetSelector
              key={activeChartId} // Force re-render when active chart changes
              actives={availableAssets}
              className="w-full"
              selectedActiveId={
                activeChart.asset ? String(activeChart.asset.activeId) : "none"
              }
              onAssetSelect={handleAssetSelect}
            />

            <Select
              key={`candle-${activeChartId}`} // Force re-render when active chart changes
              label={t("Candle Size")}
              placeholder={t("Choose candle size")}
              value={String(activeChart.candleSize)}
              onChange={handleCandleSizeChange}
              data={candleSizes.map((s) => ({
                value: String(s),
                label: `${s / 60} min`,
              }))}
            />
          </Flex>
          <Divider />
          <Text fw={500} fz="lg">
            {t("Indicators")}
          </Text>
          <Flex direction="column" gap="xs">
            <BollingerBandsComponent tabId={activeChartId} />
            <DonchianComponent tabId={activeChartId} />
            <StochasticComponent tabId={activeChartId} />
          </Flex>
        </Flex>
      </Flex>
    </Flex>
  );
}
