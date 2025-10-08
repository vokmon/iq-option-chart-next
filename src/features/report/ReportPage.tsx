"use client";

import { useState } from "react";
import useGetClosedPositionsByDate from "./hooks/useGetClosedPositionsByDate";
import DateRangeSelector from "@/components/input/date/DateRangeSelector";
import Title from "./components/Title";
import SummaryPanel from "./components/summary-panel/SummaryPanel";
import BalanceSelector from "@/components/input/BalanceSelector";
import { Balance } from "@quadcode-tech/client-sdk-js";
import AssetSummaryPanel from "./components/asset-panel/AssetSummaryPanel";
import { useGetActiveInformation } from "@/hooks/assets/useGetActiveInformation";
import ReportLoader from "./components/loading/ReportLoader";
import ReportEmpty from "./components/loading/ReportEmpty";

export default function ReportPage() {
  const [selectedDates, setSelectedDates] = useState<Date[]>([new Date()]);
  const [balance, setBalance] = useState<Balance | null>(null);

  const { data: closedPositions, isLoading } = useGetClosedPositionsByDate({
    dates: selectedDates,
    balanceId: balance?.id,
  });

  useGetActiveInformation(closedPositions?.map((p) => p.activeId!) || []);
  if (isLoading) {
    return <ReportLoader />;
  }

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <Title />
        <div className="flex items-center gap-2">
          <DateRangeSelector
            selectedDates={selectedDates}
            onDatesChange={setSelectedDates}
            className="w-64 min-h-14 shadow-xl"
          />
          <BalanceSelector
            selectedBalanceId={balance?.id}
            onBalanceChange={setBalance}
          />
        </div>
      </div>

      {closedPositions?.length === 0 ? (
        <ReportEmpty />
      ) : (
        <>
          {/* Enhanced Summary Panel */}
          <SummaryPanel
            balance={balance}
            closedPositions={closedPositions || []}
          />

          {/* Asset Summary Panel */}
          <AssetSummaryPanel
            balance={balance}
            closedPositions={closedPositions || []}
          />
        </>
      )}
    </div>
  );
}
