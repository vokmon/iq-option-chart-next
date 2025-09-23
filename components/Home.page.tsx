import { Chart } from "../components/Chart";
import { BollingerBandsComponent } from "../components/indicators/bollinger/BollingerBandsComponent";
import { DonchianComponent } from "../components/indicators/donchian/DonchianComponent";
import { Divider, Flex, Select, Text } from "@mantine/core";
import { useEffect, useState } from "react";
import { useSdk } from "../hooks/useSdk";
import { useBollingerBands } from "../hooks/useBollingerBands";
import { useDonchian } from "../hooks/useDonchian";
import { type Active } from "../types/Active";

const candleSizes = [60, 300];

export default function HomePage() {
  const sdk = useSdk();
  const [actives, setActives] = useState<Active[]>([]);
  const [selectedActiveId, setSelectedActiveId] = useState<string | null>(null);
  const [selectedCandleSize, setSelectedCandleSize] = useState<string | null>(
    String(candleSizes[0])
  ); // default 1 min

  // Bollinger Bands configuration using custom hook
  const {
    showBollingerBands,
    setShowBollingerBands,
    bollingerConfig,
    updatePeriod,
    updateStdDev,
  } = useBollingerBands();

  // Donchian Channels configuration using custom hook
  const {
    showDonchian,
    setShowDonchian,
    donchianConfig,
    updateDonchianPeriod,
  } = useDonchian();

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
      if (binaryOptionsActives.length > 0) {
        setSelectedActiveId(String(binaryOptionsActives[0].id));
      }
    };

    init().then();
  }, [sdk]);

  return (
    <Flex direction="column" gap="sm" p={10}>
      <Flex>
        {selectedActiveId && (
          <Text>
            Selected Active:{" "}
            {actives.find((a) => a.id === parseInt(selectedActiveId))?.title}
          </Text>
        )}
      </Flex>
      <Flex>
        <Flex direction="column" w="80%">
          {selectedActiveId && (
            <Chart
              activeId={parseInt(selectedActiveId)}
              candleSize={parseInt(selectedCandleSize!)}
              chartHeight={window.innerHeight - 100}
              chartMinutesBack={60}
              showBollingerBands={showBollingerBands}
              bollingerBandsConfig={bollingerConfig}
              showDonchian={showDonchian}
              donchianConfig={donchianConfig}
            />
          )}
        </Flex>

        <Flex w="20%" direction="column" gap="sm">
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
            <BollingerBandsComponent
              showBollingerBands={showBollingerBands}
              onToggleBollingerBands={setShowBollingerBands}
              bollingerConfig={bollingerConfig}
              onUpdatePeriod={updatePeriod}
              onUpdateStdDev={updateStdDev}
              size="sm"
            />
            <DonchianComponent
              showDonchian={showDonchian}
              onToggleDonchian={setShowDonchian}
              donchianConfig={donchianConfig}
              onUpdatePeriod={updateDonchianPeriod}
              size="sm"
            />
          </Flex>
        </Flex>
      </Flex>
    </Flex>
  );
}
