import React from "react";
import { useSelectedBalance } from "../../hooks/positions/useSelectedBalance";
import { useGetClosedPositions } from "../../hooks/positions/useFilteredPositions";
import TradeSummary from "@/components/display/summary/TradeSummary";
import { useClosedPositionsLoading } from "@/hooks/positions/useGetClosedPositions";
import TraderSummaryLoader from "@/components/display/summary/TraderSummaryLoader";

export default function TodayTradeSummary() {
  const { selectedBalance } = useSelectedBalance();
  const closedPositionsForSelectedBalance = useGetClosedPositions();
  const isLoading = useClosedPositionsLoading();

  if (isLoading) {
    return <TraderSummaryLoader />;
  }
  return (
    <TradeSummary
      closedPositions={closedPositionsForSelectedBalance}
      balance={selectedBalance}
    />
  );
}
