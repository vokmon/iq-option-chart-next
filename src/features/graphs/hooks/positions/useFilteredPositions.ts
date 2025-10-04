import { useMemo } from "react";
import { useOpenPositionsStore } from "@/stores/positions/openPositionsStore";
import { useClosedPositionsStore } from "@/stores/positions/closedPositionsStore";
import { useSelectedBalance } from "@/features/graphs/hooks/positions/useSelectedBalance";

export function useGetOpenPositions() {
  const { openPositions } = useOpenPositionsStore();
  const { selectedBalanceId } = useSelectedBalance();

  const openPositionsForSelectedBalance = useMemo(() => {
    return openPositions.filter(
      (position) => position.balanceId === selectedBalanceId
    );
  }, [openPositions, selectedBalanceId]);

  return openPositionsForSelectedBalance;
}

export function useGetClosedPositions() {
  const { closedPositions } = useClosedPositionsStore();
  const { selectedBalanceId } = useSelectedBalance();

  const closedPositionsForSelectedBalance = useMemo(() => {
    return closedPositions.filter(
      (position) => position.balanceId === selectedBalanceId
    );
  }, [closedPositions, selectedBalanceId]);

  return closedPositionsForSelectedBalance;
}
