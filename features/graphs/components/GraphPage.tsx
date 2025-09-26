import { Chart } from "./Chart";
import { StochasticChart } from "./StochasticChart";
import { BollingerBandsComponent } from "./indicators/bollinger/BollingerBandsComponent";
import { DonchianComponent } from "./indicators/donchian/DonchianComponent";
import { StochasticComponent } from "./indicators/stochastic/StochasticComponent";
import { AssetSelector } from "./input/AssetSelector";
import { Divider, Flex, Select, Text } from "@mantine/core";
import { useEffect, useState } from "react";
import { useSdk } from "@/hooks/useSdk";
// import { type Active } from "@/types/Active";
import { useUrlState } from "@/hooks/useUrlState";
import { DigitalOptionsUnderlying } from "@quadcode-tech/client-sdk-js";
import { useTranslations } from "next-intl";

const candleSizes = [60, 300];

export default function GraphPage() {
  const { sdk } = useSdk();
  const t = useTranslations();
  // const [actives, setActives] = useState<Active[]>([]);
  const [actives, setActives] = useState<DigitalOptionsUnderlying[]>([]);

  // Use custom hook for URL-based state management
  const [selectedActiveId] = useUrlState("activeId", "none");
  const [selectedCandleSize, setSelectedCandleSize] = useUrlState(
    "candleSize",
    String(candleSizes[0])
  );

  useEffect(() => {
    if (!sdk) return;

    const init = async () => {
      const now = sdk.currentTime();
      const digitalOptions = await sdk.digitalOptions();
      const digitalOptionsActives =
        digitalOptions.getUnderlyingsAvailableForTradingAt(now);
      setActives(digitalOptionsActives);
      // const binaryOptions = await sdk.binaryOptions();
      // const binaryOptionsActives = binaryOptions
      //   .getActives()
      //   .filter((a) => a.canBeBoughtAt(now))
      //   .map((a) => ({
      //     id: a.id,
      //     title: a.ticker ?? `Active ${a.id}`,
      //   }));

      // setActives(binaryOptionsActives);
    };

    init().then();
  }, [sdk]);

  return (
    <Flex direction="column" gap="sm" p={10} w="100%" h="100%">
      {/* <Flex>
        {selectedActiveId && selectedActiveId !== "none" && (
          <Flex gap="sm" align="center">
            Selected Active:{" "}
            <Text size="lg" fw={600}>
              {
                actives.find((a) => a.activeId === parseInt(selectedActiveId))
                  ?.name
              }
            </Text>
          </Flex>
        )}
      </Flex> */}
      <Flex gap="sm">
        <Flex direction="column" w="80%">
          {selectedActiveId && selectedActiveId !== "none" && (
            <>
              <Chart
                activeId={parseInt(selectedActiveId)}
                candleSize={parseInt(selectedCandleSize!)}
                chartHeight={window.innerHeight - 270}
                chartMinutesBack={60}
              />
              <div className="my-4" />
              <StochasticChart
                activeId={parseInt(selectedActiveId)}
                candleSize={parseInt(selectedCandleSize!)}
                chartHeight={120}
                chartMinutesBack={60}
              />
            </>
          )}
        </Flex>

        <Flex w="20%" direction="column" gap="sm">
          <Flex direction="row" gap="md">
            <AssetSelector actives={actives} className="w-full" />

            <Select
              label={t("Candle Size")}
              placeholder={t("Choose candle size")}
              value={selectedCandleSize}
              onChange={setSelectedCandleSize}
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
            <BollingerBandsComponent />
            <DonchianComponent />
            <StochasticComponent />
          </Flex>
        </Flex>
      </Flex>
    </Flex>
  );
}
