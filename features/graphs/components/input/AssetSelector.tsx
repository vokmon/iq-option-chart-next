import { Select, Box, Image, Text } from "@mantine/core";
import { useTranslations } from "next-intl";
import { useMemo } from "react";
import { useDigitalOptionsStore } from "@/stores/digitalOptionsStore";

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
  const { actives, activeInformation } = useDigitalOptionsStore();

  const groupedOptions = useMemo(() => {
    const options = actives.map((a) => {
      return {
        value: String(a.activeId),
        label: (a.name ?? `Asset ${a.activeId}`).replace(/-op$/i, ""),
      };
    });

    const groupedOptions = options.reduce(
      (acc: Record<string, typeof options>, option) => {
        // Check if the original name ends with "-OTC" (case insensitive)
        const originalName =
          actives.find((a) => String(a.activeId) === option.value)?.name ?? "";
        const group = originalName.toLowerCase().endsWith("-otc")
          ? t("OTC")
          : t("Asset");
        if (!acc[group]) {
          acc[group] = [];
        }
        acc[group].push(option);
        return acc;
      },
      {}
    );

    return groupedOptions;
  }, [actives, t]);

  const selectData = Object.entries(groupedOptions)
    .sort(([a], [b]) => {
      // Sort so "Asset" comes first, then "OTC"
      if (a === t("Asset") && b === t("OTC")) return -1;
      if (a === t("OTC") && b === t("Asset")) return 1;
      return 0;
    })
    .map(([group, options]) => ({
      group,
      items: options,
    }));

  return (
    <Select
      label={t("Asset")}
      placeholder={t("Choose an asset")}
      value={selectedActiveId}
      onChange={(value) => onAssetSelect?.(value || "none")}
      data={selectData}
      searchable
      className={className}
      maxDropdownHeight={600}
      styles={{
        input: {
          fontWeight: 700,
        },
      }}
      leftSectionWidth={40}
      leftSection={
        activeInformation[selectedActiveId as unknown as number]?.imageUrl && (
          <div className="w-6 h-6">
            <Image
              src={
                activeInformation[selectedActiveId as unknown as number]
                  .imageUrl
              }
              alt={
                activeInformation[selectedActiveId as unknown as number].name
              }
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
            <Text size="sm">{option.label}</Text>
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
