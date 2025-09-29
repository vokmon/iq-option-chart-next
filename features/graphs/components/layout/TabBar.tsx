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
import { useAssetStore } from "@/stores/assetStore";
import { getCandleSizeLabel, getCandleColor } from "@/utils/candleColors";
import { useTranslations } from "next-intl";
import { useTabScroll } from "../../hooks/tab/useTabScroll";
import { useTabAssetHandlers } from "../../hooks/tab/useTabAssetHandlers";
import { useTabScrollEffects } from "../../hooks/tab/useTabScrollEffects";
import { useDigitalOptionsStore } from "@/stores/digitalOptionsStore";
import Image from "next/image";

export function TabBar() {
  const t = useTranslations();
  const theme = useMantineTheme();
  const { colorScheme } = useMantineColorScheme();
  const { assets } = useAssetStore();
  const { activeInformation } = useDigitalOptionsStore();
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
              {assets.map((asset) => {
                const activeData =
                  activeInformation[asset.asset?.activeId || 0];
                return (
                  <Tabs.Tab
                    key={asset.id}
                    value={asset.id}
                    data-tab-id={asset.id}
                    rightSection={
                      canRemoveAsset(asset.id) ? (
                        <div
                          onClick={(e) => handleRemoveAsset(asset.id, e)}
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
                            e.currentTarget.style.backgroundColor =
                              "transparent";
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
                        activeAssetId === asset.id
                          ? colorScheme === "dark"
                            ? "var(--mantine-color-blue-9)"
                            : "var(--mantine-color-blue-1)"
                          : "transparent",
                      borderColor:
                        activeAssetId === asset.id
                          ? "var(--mantine-color-blue-6)"
                          : "var(--mantine-color-gray-3)",
                      borderWidth: "1px",
                      transition: "all 0.2s ease",
                    }}
                  >
                    <Group gap="xs" style={{ width: "100%" }}>
                      {activeData?.imageUrl && (
                        <div className="w-6 h-6">
                          <Image
                            src={activeData.imageUrl}
                            alt={activeData.name}
                            width={20}
                            height={20}
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
                              : undefined,
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
                  style={{
                    borderRadius: "var(--mantine-radius-sm)",
                    flexShrink: 0,
                    cursor: canAddAsset() ? "pointer" : "not-allowed",
                    minWidth: 32,
                    minHeight: 32,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    opacity: canAddAsset() ? 1 : 0.7,
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
