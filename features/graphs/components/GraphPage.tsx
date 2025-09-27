import { TabBar } from "./layout/TabBar";
import { ChartTab } from "./layout/ChartTab";
import { Flex } from "@mantine/core";
import { useEffect, useState, useRef } from "react";
import { useSdk } from "@/hooks/useSdk";
import { DigitalOptionsUnderlying } from "@quadcode-tech/client-sdk-js";
import { useAssetStore } from "@/stores/assetStore";
import ChartSidebar from "./layout/ChartSidebar";

export default function GraphPage() {
  const { sdk } = useSdk();
  const [actives, setActives] = useState<DigitalOptionsUnderlying[]>([]);
  const { assets, addAsset } = useAssetStore();
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

  // Initialize with one empty asset if none exist
  // We use a ref to prevent multiple asset creation during initial render cycle
  // Without this, useEffect would run multiple times: once when assets.length === 0,
  // then again after addAsset() updates the store, causing duplicate empty assets
  useEffect(() => {
    if (!hasInitialized.current && assets.length === 0) {
      hasInitialized.current = true;
      addAsset();
    }
  }, [addAsset, assets.length]);

  return (
    <Flex direction="row" w="100%" h="100%" px={10} py={5} gap="lg">
      <Flex direction="column" gap="sm" w="80%" h="100%">
        <TabBar />
        <ChartTab />
      </Flex>
      <Flex direction="column" w="20%">
        <ChartSidebar actives={actives} />
      </Flex>
    </Flex>
  );
}
