import { Flex, Text, Center, Stack } from "@mantine/core";
import { IconChartLine } from "@tabler/icons-react";
import { MainChart } from "../charts/MainChart";
import { StochasticChart } from "../charts/StochasticChart";
import { useAssetStore } from "@/stores/assetStore";
import { useTranslations } from "next-intl";

export function ChartTab() {
  const t = useTranslations();
  const { getActiveAsset } = useAssetStore();

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
            chartMinutesBack={60}
          />
          <div className="my-4" />
          <StochasticChart
            activeId={activeAsset.asset.activeId}
            candleSize={activeAsset.candleSize}
            chartMinutesBack={60}
          />
        </>
      ) : (
        <Center h="100%">
          <EmptyChart />
        </Center>
      )}
    </Flex>
  );
}

const EmptyChart = () => {
  const t = useTranslations();
  return (
    <Stack align="center" className="pt-50" gap="md" h="100%">
      <div
        className="animate-bounce"
        style={{
          background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
          borderRadius: "50%",
          padding: "16px",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          boxShadow: "0 4px 12px rgba(102, 126, 234, 0.3)",
          animationDuration: "2s",
          animationIterationCount: "infinite",
          animationTimingFunction: "ease-in-out",
        }}
      >
        <IconChartLine
          size={48}
          color="white"
          style={{
            filter: "drop-shadow(0 2px 4px rgba(0,0,0,0.2))",
          }}
        />
      </div>
      <Text size="xl" c="dimmed" ta="center">
        {t("Select an asset to view chart")}
      </Text>
      <Flex align="center" gap="md" c="dimmed">
        <Text size="xl">
          {t("Choose an asset from the panel on the right")}
        </Text>
      </Flex>
    </Stack>
  );
};
