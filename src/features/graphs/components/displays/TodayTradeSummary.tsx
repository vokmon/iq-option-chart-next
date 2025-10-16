import React, { useState } from "react";
import { useSelectedBalance } from "../../hooks/positions/useSelectedBalance";
import { useGetClosedPositions } from "../../hooks/positions/useFilteredPositions";
import TradeSummary from "@/components/display/summary/TradeSummary";
import { useClosedPositionsLoading } from "@/hooks/positions/useGetClosedPositions";
import TraderSummaryLoader from "@/components/display/summary/TraderSummaryLoader";
import { useGetTargetGoal } from "../../hooks/summary/useGetTargetGoal";
import PositionsDetailsModal from "./PositionsDetailsModal";

export default function TodayTradeSummary() {
  const [positionsDetailsModalOpened, setPositionsDetailsModalOpened] =
    useState(false);
  const { selectedBalance } = useSelectedBalance();
  const closedPositionsForSelectedBalance = useGetClosedPositions();
  const isLoading = useClosedPositionsLoading();

  const { dailyProfitTarget, dailyLossLimit } =
    useGetTargetGoal(selectedBalance);

  if (isLoading) {
    return <TraderSummaryLoader />;
  }
  return (
    <>
      <TradeSummary
        closedPositions={closedPositionsForSelectedBalance}
        balance={selectedBalance}
        dailyProfitTarget={dailyProfitTarget}
        dailyLossLimit={dailyLossLimit}
        onPnLClick={() => {
          setPositionsDetailsModalOpened(true);
        }}
      />
      <PositionsDetailsModal
        opened={positionsDetailsModalOpened}
        onClose={() => setPositionsDetailsModalOpened(false)}
      />
    </>
  );
}
