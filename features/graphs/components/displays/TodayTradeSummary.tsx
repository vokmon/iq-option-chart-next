import React from "react";
import { useSelectedBalance } from "../../hooks/positions/useSelectedBalance";
import { useFilteredPositions } from "../../hooks/positions/useFilteredPositions";
import TradeSummary from "@/components/display/summary/TradeSummary";

export default function TodayTradeSummary() {
  const { selectedBalance } = useSelectedBalance();
  const { closedPositionsForSelectedBalance } = useFilteredPositions();
  return (
    <TradeSummary
      closedPositions={closedPositionsForSelectedBalance}
      balance={selectedBalance}
    />
  );
}
