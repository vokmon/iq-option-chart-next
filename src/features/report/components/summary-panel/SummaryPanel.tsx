"use client";

import { Paper, Stack, Title } from "@mantine/core";
import SummaryMetricsGrid from "./SummaryMetricsGrid";
import PnLLineChart from "./PnLLineChart";
import ClosedPositionsTable from "./ClosedPositionsTable";
import { Balance, Position } from "@quadcode-tech/client-sdk-js";
import { useTranslations } from "next-intl";
import PnlLineChartGroupByDay from "./PnlLineChartGroupByDay";

interface SummaryPanelProps {
  balance: Balance | null;
  closedPositions: Position[];
}

export default function SummaryPanel({
  balance,
  closedPositions,
}: SummaryPanelProps) {
  const t = useTranslations();
  return (
    <Paper
      p="xl"
      withBorder
      className="bg-gradient-to-br from-gray-50 via-slate-50/60 to-zinc-50/40 dark:from-gray-900/60 dark:via-slate-800/40 dark:to-zinc-800/30 shadow-sm min-h-screen"
    >
      <Title order={2}>{t("Summary")}</Title>
      <Stack gap="lg">
        {/* Summary Metrics Grid */}
        <SummaryMetricsGrid
          balance={balance}
          closedPositions={closedPositions}
        />

        {/* P&L Line Chart */}
        <PnLLineChart balance={balance} closedPositions={closedPositions} />

        {/* P&L Line Chart Group By Day */}
        <PnlLineChartGroupByDay
          balance={balance}
          closedPositions={closedPositions}
        />

        {/* Closed Positions Table */}
        <ClosedPositionsTable
          balance={balance}
          closedPositions={closedPositions}
        />
      </Stack>
    </Paper>
  );
}
