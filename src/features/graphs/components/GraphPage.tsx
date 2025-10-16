import { TabBar } from "./layout/TabBar";
import { ChartTab } from "./layout/ChartTab";
import { Flex } from "@mantine/core";
import { useEffect, useRef } from "react";
import { useAssetStore } from "@/stores/assets/assetStore";
import ChartSidebar from "./layout/ChartSidebar";

export default function GraphPage() {
  const { assets, addAsset } = useAssetStore();
  const hasInitialized = useRef(false);

  // Initialize with one empty asset if none exist
  // We use a ref to prevent multiple asset creation during initial render cycle
  // Without this, useEffect would run multiple times: once when assets.length === 0,
  // then again after addAsset() updates the store, causing duplicate empty assets
  useEffect(() => {
    if (!hasInitialized.current && assets.length === 0) {
      hasInitialized.current = true;
      // add empty asset
      addAsset();
    }
  }, [addAsset, assets.length]);

  return (
    <Flex
      // direction="row"
      w="100%"
      h="100%"
      px={10}
      py={5}
      gap="xs"
      className="!flex !flex-col sm:!flex-col md:!flex-col lg:!flex-row animate-fade-in"
    >
      <Flex
        direction="column"
        gap="sm"
        className="w-[80%] w-[100%] xs:w-[100%] md:w-[100%] lg:w-[70%] xl:w-[75%] 2xl:w-[80%]"
      >
        <TabBar />
        <ChartTab />
      </Flex>
      <Flex
        direction="column"
        className="w-[20%] w-[100%] xs:w-[100%] md:w-[100%] lg:w-[30%] xl:w-[25%] 2xl:w-[20%] max-w-[370px] mx-auto"
      >
        <ChartSidebar />
      </Flex>
    </Flex>
  );
}
