import { Select } from "@mantine/core";
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
  const { actives } = useDigitalOptionsStore();

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
      comboboxProps={
        {
          // dropdownPadding: 16,
          // middlewares: { flip: false, shift: false },
        }
      }
    />
  );
}
