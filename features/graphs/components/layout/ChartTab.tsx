import { Flex, Text, Center, Stack } from "@mantine/core";
import { MainChart } from "../charts/MainChart";
import { StochasticChart } from "../charts/StochasticChart";
import { useAssetStore } from "@/stores/assetStore";
import { useTranslations } from "next-intl";

export function ChartTab() {
  const t = useTranslations();
  const { activeAssetId, getActiveAsset } = useAssetStore();

  const activeAsset = getActiveAsset();

  if (!activeAsset) {
    return (
      <Center h="100%" style={{ minHeight: 400 }}>
        <Stack align="center" gap="md">
          <Text size="lg" c="dimmed">
            {t("No active asset")}
          </Text>
          <Text size="sm" c="dimmed">
            {t("Select an asset or create a new one")}
          </Text>
        </Stack>
      </Center>
    );
  }

  return (
    <Flex direction="column" w="100%" style={{ minHeight: 0 }}>
      {activeAsset.asset && activeAsset.asset !== null ? (
        <>
          <MainChart
            activeId={activeAsset.asset.activeId}
            candleSize={activeAsset.candleSize}
            chartHeight={window.innerHeight - 350}
            chartMinutesBack={60}
          />
          <div className="my-4" />
          <StochasticChart
            activeId={activeAsset.asset.activeId}
            candleSize={activeAsset.candleSize}
            chartHeight={120}
            chartMinutesBack={60}
            tabId={activeAssetId}
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
  );
}
