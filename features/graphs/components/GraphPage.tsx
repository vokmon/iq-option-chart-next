import { Chart } from "./Chart";
import { StochasticChart } from "./StochasticChart";
import { BollingerBandsComponent } from "./indicators/bollinger/BollingerBandsComponent";
import { DonchianComponent } from "./indicators/donchian/DonchianComponent";
import { StochasticComponent } from "./indicators/stochastic/StochasticComponent";
import { Divider, Flex, Select, Text } from "@mantine/core";
import { useEffect, useState } from "react";
import { useSdk } from "@/hooks/useSdk";
import { type Active } from "@/types/Active";
import { useUrlState } from "@/hooks/useUrlState";

const candleSizes = [60, 300];

export default function GraphPage() {
  const sdk = useSdk();
  const [actives, setActives] = useState<Active[]>([]);

  // Use custom hook for URL-based state management
  const [selectedActiveId, setSelectedActiveId] = useUrlState(
    "activeId",
    "none"
  );
  const [selectedCandleSize, setSelectedCandleSize] = useUrlState(
    "candleSize",
    String(candleSizes[0])
  );

  useEffect(() => {
    if (!sdk) return;

    const init = async () => {
      const now = sdk.currentTime();
      const binaryOptions = await sdk.binaryOptions();
      const binaryOptionsActives = binaryOptions
        .getActives()
        .filter((a) => a.canBeBoughtAt(now))
        .map((a) => ({
          id: a.id,
          title: a.ticker ?? `Active ${a.id}`,
        }));

      setActives(binaryOptionsActives);

      // Set default active in URL if none is selected and we have actives
      if (
        binaryOptionsActives.length > 0 &&
        (selectedActiveId === "none" || !selectedActiveId)
      ) {
        setSelectedActiveId(String(binaryOptionsActives[0].id));
      }
    };

    init().then();
  }, [sdk, selectedActiveId, setSelectedActiveId]);

  return (
    <Flex direction="column" gap="sm" p={10}>
      <Flex>
        {selectedActiveId && selectedActiveId !== "none" && (
          <Text>
            Selected Active:{" "}
            {actives.find((a) => a.id === parseInt(selectedActiveId))?.title}
          </Text>
        )}
      </Flex>
      <Flex gap="xl">
        <Flex direction="column" w="80%">
          {selectedActiveId && selectedActiveId !== "none" && (
            <>
              <Chart
                activeId={parseInt(selectedActiveId)}
                candleSize={parseInt(selectedCandleSize!)}
                chartHeight={window.innerHeight - 300}
                chartMinutesBack={60}
              />
              <StochasticChart
                activeId={parseInt(selectedActiveId)}
                candleSize={parseInt(selectedCandleSize!)}
                chartHeight={200}
                chartMinutesBack={60}
              />
            </>
          )}
        </Flex>

        <Flex w="20%" direction="column" gap="md">
          <Select
            label="Active"
            placeholder="Choose an active"
            value={selectedActiveId}
            onChange={setSelectedActiveId}
            data={actives.map((a) => ({
              value: String(a.id),
              label: a.title ?? `Active ${a.id}`,
            }))}
          />

          <Select
            label="Candle Size (sec)"
            placeholder="Choose candle size"
            value={selectedCandleSize}
            onChange={setSelectedCandleSize}
            data={candleSizes.map((s) => ({
              value: String(s),
              label: `${s / 60} min`,
            }))}
          />
          <Divider my="xl" />
          <Text fw={500} fz="lg">
            Indicators
          </Text>
          <Flex direction="column" gap="md">
            <BollingerBandsComponent size="sm" />
            <DonchianComponent size="sm" />
            <StochasticComponent size="sm" />
          </Flex>
        </Flex>
      </Flex>
    </Flex>
  );
}
