import { useEffect } from "react";
import { useAmountHistoryStore } from "@/stores/assets/amountHistoryStore";

export function useAmountHistory(activeId?: number, balanceId?: number) {
  const { getAmountHistory, updateLastActive } = useAmountHistoryStore();

  // Get amount history without side effects
  const amountHistory = getAmountHistory(activeId!, balanceId!);

  // Update lastActive when component mounts or when activeId/balanceId changes
  useEffect(() => {
    if (activeId && balanceId) {
      updateLastActive(activeId, balanceId);
    }
  }, [activeId, balanceId, updateLastActive]);

  return amountHistory;
}
