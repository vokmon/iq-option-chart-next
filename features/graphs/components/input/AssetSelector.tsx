import { Select, Text } from "@mantine/core";
import { useTranslations } from "next-intl";
import { DigitalOptionsUnderlying } from "@quadcode-tech/client-sdk-js";
import { useMemo, useEffect } from "react";
import { useUrlState } from "@/hooks/useUrlState";

interface AssetSelectorProps {
  actives: DigitalOptionsUnderlying[];
  className?: string;
}

export function AssetSelector({ actives, className }: AssetSelectorProps) {
  const t = useTranslations();
  const [selectedActiveId, setSelectedActiveId] = useUrlState(
    "activeId",
    "none"
  );

  // Auto-select first asset if none is selected and we have actives
  useEffect(() => {
    if (
      actives.length > 0 &&
      (selectedActiveId === "none" || !selectedActiveId)
    ) {
      setSelectedActiveId(String(actives[0].activeId));
    }
  }, [actives, selectedActiveId, setSelectedActiveId]);

  const groupedOptions = useMemo(() => {
    const options = actives.map((a) => ({
      value: String(a.activeId),
      label: (a.name ?? `Asset ${a.activeId}`).replace(/-op$/i, ""),
    }));

    const groupedOptions = options.reduce(
      (acc: Record<string, typeof options>, option) => {
        // Check if the original name ends with "-OP" (case insensitive)
        const originalName =
          actives.find((a) => String(a.activeId) === option.value)?.name ?? "";
        const group = originalName.toLowerCase().endsWith("-op")
          ? "OTC"
          : "Asset";
        if (!acc[group]) {
          acc[group] = [];
        }
        acc[group].push(option);
        return acc;
      },
      {}
    );

    return groupedOptions;
  }, [actives]);

  const selectData = Object.entries(groupedOptions)
    .sort(([a], [b]) => {
      // Sort so "Asset" comes first, then "OTC"
      if (a === "Asset" && b === "OTC") return -1;
      if (a === "OTC" && b === "Asset") return 1;
      return 0;
    })
    .map(([group, options]) => ({
      group,
      items: options,
    }));

  return (
    <Select
      label={t("Asset")}
      placeholder="Choose an asset"
      value={selectedActiveId}
      onChange={setSelectedActiveId}
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
