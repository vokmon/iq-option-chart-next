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
  // IconGripVertical,
} from "@tabler/icons-react";
import { useAssetStore, MAX_ASSETS } from "@/stores/assets/assetStore";
import { getCandleSizeLabel, getCandleColor } from "@/utils/candleColors";
import { useTranslations } from "next-intl";
import { useTabScroll } from "../../hooks/tab/useTabScroll";
import { useTabAssetHandlers } from "../../hooks/tab/useTabAssetHandlers";
import { useTabScrollEffects } from "../../hooks/tab/useTabScrollEffects";
import { useDigitalOptionsStore } from "@/stores/digitalOptionsStore";
import Image from "next/image";
import { useGetOpenPositions } from "../../hooks/positions/useFilteredPositions";
import { useSignalStore } from "@/stores/signalStore";
import SmallSignalIndicatorLabel from "@/components/display/signal/SmallSignalIndicatorLabel";
import NumberOfOpenPositionCard from "@/components/display/positions/NumberOfOpenPositionCard";
import { useTabDragDrop } from "../../hooks/chart/useTabDragDrop";
import { useTradingStore } from "@/stores/assets/tradingStore";
import SmallAutoTradeLabel from "@/components/display/auto-trade/SmallAutoTradeLabel";

export function TabBar() {
  const t = useTranslations();
  const theme = useMantineTheme();
  const { colorScheme } = useMantineColorScheme();
  const { assets } = useAssetStore();
  const { getSignal } = useSignalStore();
  const { activeInformation } = useDigitalOptionsStore();

  // Use drag and drop hook
  const {
    handleDragStart,
    handleDragEnd,
    handleDragOver,
    handleDragLeave,
    handleDrop,
    getDragState,
  } = useTabDragDrop();
  // Use custom hooks for scroll functionality
  const {
    scrollAreaRef,
    canScrollLeft,
    canScrollRight,
    scrollLeft,
    scrollRight,
    updateScrollButtons,
    scrollToActiveTab,
    handleScroll,
  } = useTabScroll();

  // Use custom hooks for asset management
  const {
    activeAssetId,
    handleAddAsset,
    handleRemoveAsset,
    handleAssetChange,
    canAddAsset,
    canRemoveAsset,
  } = useTabAssetHandlers();

  // Use custom hooks for scroll effects
  useTabScrollEffects({
    scrollAreaRef: scrollAreaRef as React.RefObject<HTMLDivElement | null>,
    activeAssetId,
    assets,
    updateScrollButtons,
    scrollToActiveTab,
  });

  const openPositionsForSelectedBalance = useGetOpenPositions();
  const { getAutoTrade } = useTradingStore();

  if (assets.length === 0) {
    return null;
  }

  return (
    <Box style={{ position: "relative", width: "100%" }}>
      <Tabs
        value={activeAssetId || undefined}
        onChange={handleAssetChange}
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
              variant="gradient"
              color="blue.3"
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
              variant="gradient"
              color="blue.3"
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
              {assets.map((asset, index) => {
                const activeData =
                  activeInformation[asset.asset?.activeId || 0];

                const openPositionsForActive =
                  openPositionsForSelectedBalance.filter(
                    (position) => position.activeId === asset?.asset?.activeId
                  ).length;

                const autoTrade = getAutoTrade(asset.id);

                const signal = getSignal(asset.asset?.activeId || 0);

                const { isDragging, isDragOver } = getDragState(index);

                return (
                  <Tabs.Tab
                    key={asset.id}
                    value={asset.id}
                    data-tab-id={asset.id}
                    draggable
                    onDragStart={(e) => handleDragStart(e, index)}
                    onDragEnd={handleDragEnd}
                    onDragOver={(e) => handleDragOver(e, index)}
                    onDragLeave={handleDragLeave}
                    onDrop={(e) => handleDrop(e, index)}
                    px={12}
                    rightSection={
                      <Group gap={4}>
                        {/* Drag handle */}
                        {/* <div
                          className="group"
                          style={{
                            padding: 2,
                            borderRadius: 4,
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            color: "var(--mantine-color-gray-5)",
                            cursor: "grab",
                            transition: "all 0.2s ease",
                            minWidth: 16,
                            minHeight: 16,
                          }}
                        >
                          <IconGripVertical
                            size={12}
                            className="group-hover:text-gray-700 group-hover:scale-110 transition-all duration-200 ease-in-out"
                          />
                        </div> */}
                        {/* Remove button */}
                        {canRemoveAsset(asset.id) && (
                          <div
                            onClick={(e) => handleRemoveAsset(asset.id, e)}
                            className="group"
                            style={{
                              padding: 2,
                              borderRadius: 4,
                              display: "flex",
                              alignItems: "center",
                              justifyContent: "center",
                              color: "var(--mantine-color-gray-6)",
                              transition: "all 0.2s ease",
                              minWidth: 16,
                              minHeight: 16,
                              cursor: "pointer",
                            }}
                          >
                            <IconX
                              size={12}
                              className="group-hover:text-gray-800 group-hover:scale-110 transition-all duration-200 ease-in-out"
                            />
                          </div>
                        )}
                      </Group>
                    }
                    style={{
                      minWidth: 150,
                      maxWidth: 250,
                      position: "relative",
                      flexShrink: 0,
                      backgroundColor:
                        activeAssetId === asset.id
                          ? colorScheme === "dark"
                            ? "var(--mantine-color-blue-9)"
                            : "var(--mantine-color-blue-1)"
                          : isDragOver
                          ? colorScheme === "dark"
                            ? "var(--mantine-color-blue-8)"
                            : "var(--mantine-color-blue-0)"
                          : "transparent",
                      borderColor:
                        activeAssetId === asset.id
                          ? "var(--mantine-color-blue-6)"
                          : isDragOver
                          ? "var(--mantine-color-blue-4)"
                          : "var(--mantine-color-gray-3)",
                      borderWidth: "1px",
                      borderStyle: isDragOver ? "dashed" : "solid",
                      transition: "all 0.2s ease",
                      opacity: isDragging ? 0.5 : 1,
                      transform: isDragging ? "rotate(2deg)" : "none",
                      boxShadow: isDragOver
                        ? "0 0 0 2px var(--mantine-color-blue-3)"
                        : "none",
                    }}
                    onMouseEnter={(e) => {
                      if (
                        activeAssetId !== asset.id &&
                        !isDragOver &&
                        !isDragging
                      ) {
                        e.currentTarget.style.backgroundColor =
                          colorScheme === "dark"
                            ? "var(--mantine-color-blue-8)"
                            : "var(--mantine-color-blue-4)";
                        e.currentTarget.style.borderColor =
                          "var(--mantine-color-blue-3)";
                      }
                    }}
                    onMouseLeave={(e) => {
                      if (
                        activeAssetId !== asset.id &&
                        !isDragOver &&
                        !isDragging
                      ) {
                        e.currentTarget.style.backgroundColor = "transparent";
                        e.currentTarget.style.borderColor =
                          "var(--mantine-color-gray-3)";
                      }
                    }}
                  >
                    <Group gap="xs" style={{ width: "100%" }}>
                      <div className="absolute flex flex-row gap-2 z-10 -top-3 left-0 m-1 justify-space-around">
                        {autoTrade?.enable && <SmallAutoTradeLabel />}
                        {signal && (
                          <SmallSignalIndicatorLabel signal={signal} />
                        )}
                        {openPositionsForActive > 0 && (
                          <NumberOfOpenPositionCard
                            number={openPositionsForActive}
                          />
                        )}
                      </div>
                      {activeData?.imageUrl && (
                        <div className="w-5 h-5">
                          <Image
                            src={activeData.imageUrl}
                            alt={activeData.name}
                            width={25}
                            height={25}
                          />
                        </div>
                      )}
                      <Text
                        size="sm"
                        truncate
                        style={{
                          flex: 1,
                          color:
                            activeAssetId === asset.id
                              ? colorScheme === "dark"
                                ? "var(--mantine-color-blue-1)"
                                : "var(--mantine-color-blue-9)"
                              : asset.isEmpty
                              ? "var(--mantine-color-dimmed)"
                              : "var(--mantine-color-gray-3)",
                          fontWeight: activeAssetId === asset.id ? 600 : 400,
                        }}
                      >
                        {activeData?.name || asset.name}
                      </Text>
                      <Group gap={4}>
                        {!asset.isEmpty && (
                          <Badge
                            size="xs"
                            variant="light"
                            style={{
                              backgroundColor: getCandleColor(asset.candleSize),
                              color:
                                colorScheme === "dark"
                                  ? theme.colors.dark[7]
                                  : theme.white,
                              fontWeight:
                                activeAssetId === asset.id ? 600 : 500,
                            }}
                            className="!cursor-pointer"
                          >
                            {getCandleSizeLabel(asset.candleSize)}
                          </Badge>
                        )}
                        {asset.isEmpty && (
                          <Badge
                            size="xs"
                            variant="light"
                            color="gray"
                            style={{
                              fontWeight:
                                activeAssetId === asset.id ? 600 : 500,
                            }}
                          >
                            Empty
                          </Badge>
                        )}
                      </Group>
                    </Group>
                  </Tabs.Tab>
                );
              })}

              <Box className="relative flex-shrink-0">
                <Tooltip
                  label={
                    canAddAsset()
                      ? t("Add new asset")
                      : assets.some((asset) => asset.isEmpty)
                      ? t("Please fill the empty asset first")
                      : t("Maximum number of assets reached")
                  }
                  position="top"
                  withArrow
                >
                  <ActionIcon
                    id="add-asset-button"
                    variant="filled"
                    color={canAddAsset() ? "blue" : "gray"}
                    onClick={canAddAsset() ? handleAddAsset : () => {}}
                    className={`flex items-center justify-center flex-shrink-0 ${
                      canAddAsset() ? "cursor-pointer" : "cursor-not-allowed"
                    }`}
                    style={{
                      borderRadius: "var(--mantine-radius-sm)",
                      minWidth: 32,
                      minHeight: 32,
                      opacity: canAddAsset() ? 1 : 0.7,
                    }}
                  >
                    <IconPlus size={16} />
                  </ActionIcon>
                </Tooltip>
                <Badge
                  size="xs"
                  variant="filled"
                  color={assets.length >= MAX_ASSETS ? "gray" : "blue"}
                  className="absolute -top-2 -right-4 min-w-[18px] h-[18px] text-[9px] font-semibold flex items-center justify-center rounded-full shadow-sm"
                  style={{
                    border: "1px solid white",
                    boxShadow:
                      "0 1px 3px rgba(0, 0, 0, 0.1), 0 0 0 1px rgba(255, 255, 255, 0.5)",
                  }}
                >
                  {assets.length}/{MAX_ASSETS}
                </Badge>
              </Box>
            </Tabs.List>
          </div>
        </Box>
      </Tabs>
    </Box>
  );
}
