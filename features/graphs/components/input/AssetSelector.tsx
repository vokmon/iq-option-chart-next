import { Select, Box, Image, Text } from "@mantine/core";
import { useTranslations } from "next-intl";
import { useMemo } from "react";
import { useDigitalOptionsStore } from "@/stores/digitalOptionsStore";
import { useAvailableAssets } from "../../hooks/useAvailableAssets";

interface AssetSelectorProps {
  className?: string;
  selectedActiveId?: string;
  onAssetSelect?: (activeId: string) => void;
}

export function AssetSelector({
  className,
  selectedActiveId = "none",
  onAssetSelect,
}: AssetSelectorProps) {
  const t = useTranslations();
  const assetLabel = t("Asset") as string;
  const otcLabel = t("OTC") as string;

  const { activeInformation } = useDigitalOptionsStore();
  const availableAssets = useAvailableAssets();

  const groupedOptions = useMemo(() => {
    const options = availableAssets.map((a) => {
      const activeInfo = activeInformation[a.activeId as unknown as number];
      return {
        value: String(a.activeId),
        label:
          activeInfo?.name ||
          (a.name ?? `Asset ${a.activeId}`).replace(/-op$/i, ""),
      };
    });

    const groupedOptions = options.reduce(
      (acc: Record<string, typeof options>, option) => {
        const activeInfo = activeInformation[option.value as unknown as number];
        // Check if the original name ends with "-OTC" (case insensitive)

        const group = activeInfo?.isOtc ? otcLabel : assetLabel;
        if (!acc[group]) {
          acc[group] = [];
        }
        acc[group].push(option);
        return acc;
      },
      {}
    );

    return groupedOptions;
  }, [availableAssets, activeInformation, otcLabel, assetLabel]);

  const selectData = Object.entries(groupedOptions)
    .sort(([a], [b]) => {
      // Sort so "Asset" comes first, then "OTC"
      if (a === assetLabel && b === otcLabel) return -1;
      if (a === otcLabel && b === assetLabel) return 1;
      return 0;
    })
    .map(([group, options]) => ({
      group,
      items: options,
    }));

  const activeData = activeInformation[selectedActiveId as unknown as number];

  return (
    <Select
      label={t("Asset")}
      placeholder={t("Choose an asset")}
      value={selectedActiveId}
      onChange={(value) => onAssetSelect?.(value || "none")}
      data={selectData}
      searchable
      className={className}
      disabled={selectedActiveId !== "none"}
      maxDropdownHeight={600}
      styles={{
        input: {
          fontWeight: 700,
          color: "var(--mantine-color-text) !important",
          opacity: "1 !important",
        },
      }}
      leftSectionWidth={40}
      leftSection={
        activeInformation[selectedActiveId as unknown as number]?.imageUrl && (
          <div className="w-6 h-6">
            <Image
              src={activeData.imageUrl}
              alt={activeData.name}
              width={5}
              height={5}
            />
          </div>
        )
      }
      renderOption={({ option }) => {
        const activeId = parseInt(option.value);
        const activeInfo = activeInformation[activeId as unknown as number];

        return (
          <Box style={{ display: "flex", alignItems: "center", gap: "8px" }}>
            {activeInfo?.imageUrl && (
              <div className="w-7 h-7">
                <Image
                  src={activeInfo.imageUrl}
                  alt={activeInfo.name || option.label}
                  width={5}
                  height={5}
                  style={{ borderRadius: "4px" }}
                />
              </div>
            )}
            <Text size="sm">{activeInfo?.name || option.label}</Text>
          </Box>
        );
      }}
      comboboxProps={
        {
          // dropdownPadding: 16,
          // middlewares: { flip: false, shift: false },
        }
      }
    />
  );
}
