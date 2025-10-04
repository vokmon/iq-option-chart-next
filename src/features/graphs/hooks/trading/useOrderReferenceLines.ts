import { useMemo } from "react";
import { useOpenPositionsStore } from "@/stores/positions/openPositionsStore";

export interface UseOrderReferenceLinesProps {
  activeId: number;
}

export function useOrderReferenceLines({
  activeId,
}: UseOrderReferenceLinesProps) {
  const { openPositions } = useOpenPositionsStore();
  const openPositionsOfActiveAsset = useMemo(() => {
    return openPositions.filter((position) => {
      return (
        position.activeId === activeId &&
        !position.status?.toLowerCase().includes("closed")
      );
    });
  }, [openPositions, activeId]);
  return openPositionsOfActiveAsset;
}
