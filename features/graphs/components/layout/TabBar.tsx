import {
  Tabs,
  ActionIcon,
  Group,
  Text,
  Badge,
  useMantineTheme,
  useMantineColorScheme,
} from "@mantine/core";
import { IconPlus, IconX } from "@tabler/icons-react";
import { useAssetChartStore } from "@/stores/assetStore";
import { getCandleSizeLabel, getCandleColor } from "@/utils/candleColors";
export function TabBar() {
  const theme = useMantineTheme();
  const { colorScheme } = useMantineColorScheme();
  const {
    charts,
    activeChartId,
    setActiveChart,
    addChart,
    removeChart,
    canAddChart,
    canRemoveChart,
  } = useAssetChartStore();

  const handleAddChart = () => {
    if (canAddChart()) {
      addChart();
    }
  };

  const handleRemoveChart = (chartId: string, event: React.MouseEvent) => {
    event.stopPropagation();
    if (canRemoveChart(chartId)) {
      removeChart(chartId);
    }
  };

  const handleChartChange = (value: string | null) => {
    if (value) {
      setActiveChart(value);
    }
  };

  if (charts.length === 0) {
    return null;
  }

  return (
    <Tabs
      value={activeChartId || undefined}
      onChange={handleChartChange}
      variant="outline"
      style={{ width: "100%" }}
    >
      <Tabs.List>
        {charts.map((chart) => (
          <Tabs.Tab
            key={chart.id}
            value={chart.id}
            rightSection={
              canRemoveChart(chart.id) ? (
                <div
                  onClick={(e) => handleRemoveChart(chart.id, e)}
                  style={{
                    marginLeft: 8,
                    padding: 2,
                    borderRadius: 4,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    color: "var(--mantine-color-gray-6)",
                    transition: "all 0.1s ease",
                    minWidth: 16,
                    minHeight: 16,
                    cursor: "pointer",
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.backgroundColor =
                      "var(--mantine-color-gray-1)";
                    e.currentTarget.style.color = "var(--mantine-color-gray-8)";
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.backgroundColor = "transparent";
                    e.currentTarget.style.color = "var(--mantine-color-gray-6)";
                  }}
                >
                  <IconX size={12} />
                </div>
              ) : null
            }
            style={{
              minWidth: 120,
              maxWidth: 200,
              position: "relative",
            }}
          >
            <Group gap="xs" style={{ width: "100%" }}>
              <Text
                size="sm"
                truncate
                style={{
                  flex: 1,
                  color: chart.isEmpty
                    ? "var(--mantine-color-dimmed)"
                    : undefined,
                }}
              >
                {chart.name}
              </Text>
              <Group gap={4}>
                {!chart.isEmpty && (
                  <Badge
                    size="xs"
                    variant="light"
                    style={{
                      backgroundColor: getCandleColor(chart.candleSize),
                      color:
                        colorScheme === "dark"
                          ? theme.colors.dark[7]
                          : theme.white,
                      fontWeight: 600,
                    }}
                  >
                    {getCandleSizeLabel(chart.candleSize)}
                  </Badge>
                )}
                {chart.isEmpty && (
                  <Badge size="xs" variant="light" color="gray">
                    Empty
                  </Badge>
                )}
              </Group>
            </Group>
          </Tabs.Tab>
        ))}

        {canAddChart() && (
          <ActionIcon
            variant="subtle"
            color="gray"
            onClick={handleAddChart}
            style={{
              marginLeft: 8,
              border: "1px dashed var(--mantine-color-gray-4)",
              borderRadius: "var(--mantine-radius-sm)",
            }}
          >
            <IconPlus size={16} />
          </ActionIcon>
        )}
      </Tabs.List>
    </Tabs>
  );
}
