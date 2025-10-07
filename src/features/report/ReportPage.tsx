"use client";

import { useState } from "react";
import useGetClosedPositionsByDate from "./hooks/useGetClosedPositionsByDate";
import DateRangeSelector from "@/components/input/date/DateRangeSelector";
import Title from "./components/Title";
import ReportLoader from "./components/ReportLoader";
import SummaryPanel from "./components/summary-panel/SummaryPanel";
import BalanceSelector from "@/components/input/BalanceSelector";
import { Balance } from "@quadcode-tech/client-sdk-js";

export default function ReportPage() {
  const [selectedDates, setSelectedDates] = useState<Date[]>([new Date()]);
  const [balance, setBalance] = useState<Balance | null>(null);

  const { data: closedPositions, isLoading } = useGetClosedPositionsByDate({
    dates: selectedDates,
  });

  if (isLoading) {
    return <ReportLoader />;
  }

  const selectedClosedPositions = closedPositions?.filter(
    (position) => position.balanceId === balance?.id
  );

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <Title />
        <div className="flex items-center gap-2">
          <DateRangeSelector
            selectedDates={selectedDates}
            onDatesChange={setSelectedDates}
            className="w-64"
          />
          <BalanceSelector
            selectedBalanceId={balance?.id}
            onBalanceChange={setBalance}
          />
        </div>
      </div>

      {/* Enhanced Summary Panel */}
      <SummaryPanel
        balance={balance}
        closedPositions={selectedClosedPositions || []}
      />
    </div>
  );
}
