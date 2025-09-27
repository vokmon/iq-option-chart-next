import { TabBar } from "./layout/TabBar";
import { TabContent } from "./layout/TabContent";
import { Flex } from "@mantine/core";
import { useEffect, useState, useRef } from "react";
import { useSdk } from "@/hooks/useSdk";
import { DigitalOptionsUnderlying } from "@quadcode-tech/client-sdk-js";
import { useAssetChartStore } from "@/stores/assetStore";

export default function GraphPage() {
  const { sdk } = useSdk();
  const [actives, setActives] = useState<DigitalOptionsUnderlying[]>([]);
  const { charts, addChart } = useAssetChartStore();
  const hasInitialized = useRef(false);

  useEffect(() => {
    if (!sdk) return;

    const init = async () => {
      const now = sdk.currentTime();
      const digitalOptions = await sdk.digitalOptions();
      const digitalOptionsActives =
        digitalOptions.getUnderlyingsAvailableForTradingAt(now);
      setActives(digitalOptionsActives);
    };

    init().then();
  }, [sdk]);

  // Initialize with one empty chart if none exist
  // We use a ref to prevent multiple chart creation during initial render cycle
  // Without this, useEffect would run multiple times: once when charts.length === 0,
  // then again after addChart() updates the store, causing duplicate empty charts
  useEffect(() => {
    if (!hasInitialized.current && charts.length === 0) {
      hasInitialized.current = true;
      addChart();
    }
  }, [addChart, charts.length]);

  return (
    <Flex direction="column" gap="sm" p={10} w="100%" h="100%">
      <TabBar />
      <TabContent actives={actives} />
    </Flex>
  );
}
