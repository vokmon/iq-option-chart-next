"use client";

import { useMemo } from "react";
import { Balance, Position } from "@quadcode-tech/client-sdk-js";
import AssetSummaryTable from "./AssetSummaryTable";
import { GroupedPositions } from "./type/groupPositionType";
import { Paper, Title } from "@mantine/core";
import { useTranslations } from "next-intl";
import AssetLineChart from "./AssetLineChart";
import AssetDonutChart from "./AssetDonutChart";

interface AssetSummaryPanelProps {
  balance: Balance | null;
  closedPositions: Position[];
}

export default function AssetSummaryPanel({
  balance,
  closedPositions,
}: AssetSummaryPanelProps) {
  const t = useTranslations();
  // Group positions by activeId
  const groupedPositions = useMemo(() => {
    const grouped: GroupedPositions = {};

    closedPositions.forEach((position) => {
      const activeId = position.activeId || 0;
      if (!grouped[activeId]) {
        grouped[activeId] = [];
      }
      grouped[activeId].push(position);
    });

    return grouped;
  }, [closedPositions]);

  return (
    <Paper
      p="xl"
      withBorder
      className="bg-gradient-to-br from-gray-50 via-slate-50/60 to-zinc-50/40 dark:from-gray-900/60 dark:via-slate-800/40 dark:to-zinc-800/30 shadow-sm"
    >
      <Title order={2}>{t("Asset Summary")}</Title>

      <div className="flex flex-col gap-4">
        <div className="flex flex-row justify-center items-center gap-4 w-full">
          <AssetSummaryTable
            groupedPositions={groupedPositions}
            balance={balance}
          />
          <AssetDonutChart
            balance={balance}
            groupedPositions={groupedPositions}
          />
        </div>

        <AssetLineChart balance={balance} groupedPositions={groupedPositions} />
      </div>
    </Paper>
  );
}
