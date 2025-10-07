"use client";

import { Stack } from "@mantine/core";
import SummaryMetricsGrid from "./SummaryMetricsGrid";
import PnLLineChart from "./PnLLineChart";
import ClosedPositionsTable from "./ClosedPositionsTable";
import { Balance, Position } from "@quadcode-tech/client-sdk-js";

interface SummaryPanelProps {
  balance: Balance | null;
  closedPositions: Position[];
}

export default function SummaryPanel({
  balance,
  closedPositions,
}: SummaryPanelProps) {
  return (
    <Stack gap="lg">
      {/* Summary Metrics Grid */}
      <SummaryMetricsGrid balance={balance} closedPositions={closedPositions} />

      {/* P&L Line Chart */}
      <PnLLineChart balance={balance} closedPositions={closedPositions} />

      {/* Closed Positions Table */}
      <ClosedPositionsTable
        balance={balance}
        closedPositions={closedPositions}
      />
    </Stack>
  );
}
