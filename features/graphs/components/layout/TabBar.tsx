import {
  Tabs,
  ActionIcon,
  Group,
  Text,
  Badge,
  useMantineTheme,
  useMantineColorScheme,
  Box,
  Tooltip,
} from "@mantine/core";
import {
  IconPlus,
  IconX,
  IconChevronLeft,
  IconChevronRight,
} from "@tabler/icons-react";
import { useState, useRef, useEffect } from "react";
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

  const scrollAreaRef = useRef<HTMLDivElement>(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(false);

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

  const scrollLeft = () => {
    if (scrollAreaRef.current) {
      scrollAreaRef.current.scrollBy({ left: -200, behavior: "smooth" });
    }
  };

  const scrollRight = () => {
    if (scrollAreaRef.current) {
      scrollAreaRef.current.scrollBy({ left: 200, behavior: "smooth" });
    }
  };

  const updateScrollButtons = () => {
    if (scrollAreaRef.current) {
      const { scrollLeft, scrollWidth, clientWidth } = scrollAreaRef.current;
      setCanScrollLeft(scrollLeft > 0);
      setCanScrollRight(scrollLeft < scrollWidth - clientWidth);
    }
  };

  const handleScroll = () => {
    updateScrollButtons();
  };

  // Initialize scroll button states when component mounts or charts change
  useEffect(() => {
    const timer = setTimeout(() => {
      updateScrollButtons();
    }, 100); // Small delay to ensure DOM is updated

    return () => clearTimeout(timer);
  }, [charts.length]);

  if (charts.length === 0) {
    return null;
  }

  return (
    <Box style={{ position: "relative", width: "100%" }}>
      <Tabs
        value={activeChartId || undefined}
        onChange={handleChartChange}
        variant="outline"
        style={{ width: "100%" }}
      >
        <Box
          style={{
            position: "relative",
            display: "flex",
            alignItems: "center",
          }}
        >
          {/* Left scroll button */}
          {canScrollLeft && (
            <ActionIcon
              variant="subtle"
              color="gray"
              onClick={scrollLeft}
              style={{
                position: "absolute",
                left: 0,
                top: "50%",
                transform: "translateY(-50%)",
                zIndex: 10,
                backgroundColor: "var(--mantine-color-body)",
                border: "1px solid var(--mantine-color-gray-3)",
                boxShadow: "0 2px 4px rgba(0, 0, 0, 0.1)",
              }}
            >
              <IconChevronLeft size={16} />
            </ActionIcon>
          )}

          {/* Right scroll button */}
          {canScrollRight && (
            <ActionIcon
              variant="subtle"
              color="gray"
              onClick={scrollRight}
              style={{
                position: "absolute",
                right: 0,
                top: "50%",
                transform: "translateY(-50%)",
                zIndex: 10,
                backgroundColor: "var(--mantine-color-body)",
                border: "1px solid var(--mantine-color-gray-3)",
                boxShadow: "0 2px 4px rgba(0, 0, 0, 0.1)",
              }}
            >
              <IconChevronRight size={16} />
            </ActionIcon>
          )}

          <div
            ref={scrollAreaRef}
            onScroll={handleScroll}
            style={{
              width: "100%",
              paddingLeft: canScrollLeft ? 40 : 0,
              paddingRight: canScrollRight ? 40 : 0,
              paddingTop: 6,
              paddingBottom: 6,
              overflowX: "auto",
              overflowY: "hidden",
              scrollbarWidth: "none",
              msOverflowStyle: "none",
              boxSizing: "border-box",
            }}
            className="hide-scrollbar"
          >
            <Tabs.List
              style={{
                display: "flex",
                flexWrap: "nowrap",
                minWidth: "max-content",
                width: "max-content",
                gap: 4,
                alignItems: "center",
                padding: 0,
                margin: "2px 0",
                boxSizing: "border-box",
              }}
            >
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
                          e.currentTarget.style.color =
                            "var(--mantine-color-gray-8)";
                        }}
                        onMouseLeave={(e) => {
                          e.currentTarget.style.backgroundColor = "transparent";
                          e.currentTarget.style.color =
                            "var(--mantine-color-gray-6)";
                        }}
                      >
                        <IconX size={12} />
                      </div>
                    ) : null
                  }
                  style={{
                    minWidth: 150,
                    maxWidth: 250,
                    position: "relative",
                    flexShrink: 0,
                    backgroundColor:
                      activeChartId === chart.id
                        ? colorScheme === "dark"
                          ? "var(--mantine-color-blue-9)"
                          : "var(--mantine-color-blue-1)"
                        : "transparent",
                    borderColor:
                      activeChartId === chart.id
                        ? "var(--mantine-color-blue-6)"
                        : "var(--mantine-color-gray-3)",
                    borderWidth: "1px",
                    transition: "all 0.2s ease",
                  }}
                >
                  <Group gap="xs" style={{ width: "100%" }}>
                    <Text
                      size="sm"
                      truncate
                      style={{
                        flex: 1,
                        color:
                          activeChartId === chart.id
                            ? colorScheme === "dark"
                              ? "var(--mantine-color-blue-1)"
                              : "var(--mantine-color-blue-9)"
                            : chart.isEmpty
                            ? "var(--mantine-color-dimmed)"
                            : undefined,
                        fontWeight: activeChartId === chart.id ? 600 : 400,
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
                            fontWeight: activeChartId === chart.id ? 600 : 500,
                          }}
                        >
                          {getCandleSizeLabel(chart.candleSize)}
                        </Badge>
                      )}
                      {chart.isEmpty && (
                        <Badge
                          size="xs"
                          variant="light"
                          color="gray"
                          style={{
                            fontWeight: activeChartId === chart.id ? 600 : 500,
                          }}
                        >
                          Empty
                        </Badge>
                      )}
                    </Group>
                  </Group>
                </Tabs.Tab>
              ))}

              <Tooltip
                label={
                  canAddChart()
                    ? "Add new chart"
                    : charts.some((chart) => chart.isEmpty)
                    ? "Please fill the empty tab first"
                    : "Maximum number of charts reached"
                }
                position="top"
                withArrow
              >
                <ActionIcon
                  variant="filled"
                  color={canAddChart() ? "blue" : "gray"}
                  onClick={canAddChart() ? handleAddChart : () => {}}
                  style={{
                    borderRadius: "var(--mantine-radius-sm)",
                    flexShrink: 0,
                    cursor: canAddChart() ? "pointer" : "not-allowed",
                    minWidth: 32,
                    minHeight: 32,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    opacity: canAddChart() ? 1 : 0.7,
                  }}
                >
                  <IconPlus size={16} />
                </ActionIcon>
              </Tooltip>
            </Tabs.List>
          </div>
        </Box>
      </Tabs>
    </Box>
  );
}
