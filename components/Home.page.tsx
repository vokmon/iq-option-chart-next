import { Chart } from "../components/Chart";
import { Flex, Select, Text } from "@mantine/core";
import { useEffect, useState } from "react";
import { useSdk } from "../hooks/useSdk";
import { type Active } from "../types/Active";

const candleSizes = [60, 300];

export default function HomePage() {
  const sdk = useSdk();
  const [actives, setActives] = useState<Active[]>([]);
  const [selectedActiveId, setSelectedActiveId] = useState<string | null>(null);
  const [selectedCandleSize, setSelectedCandleSize] = useState<string | null>(
    String(candleSizes[0])
  ); // default 1 min

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
              chartHeight={400}
              chartMinutesBack={720}
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
        </Flex>
      </Flex>
    </Flex>
  );
}
