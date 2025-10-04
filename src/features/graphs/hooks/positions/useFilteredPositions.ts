import { useMemo } from "react";
import { usePositionsStore } from "@/stores/positionsStore";
import { useSelectedBalance } from "@/features/graphs/hooks/positions/useSelectedBalance";

export function useFilteredPositions() {
  const { openPositions, closedPositions } = usePositionsStore();
  const { selectedBalanceId } = useSelectedBalance();

  const openPositionsForSelectedBalance = useMemo(() => {
    return openPositions.filter(
      (position) => position.balanceId === selectedBalanceId
    );
  }, [openPositions, selectedBalanceId]);

  const closedPositionsForSelectedBalance = useMemo(() => {
    return closedPositions.filter(
      (position) => position.balanceId === selectedBalanceId
    );
  }, [closedPositions, selectedBalanceId]);

  return {
    openPositionsForSelectedBalance,
    closedPositionsForSelectedBalance,
  };
}
