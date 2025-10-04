import { useMemo } from "react";
import { usePositionsStore } from "@/stores/positionsStore";

export interface UseOrderReferenceLinesProps {
  activeId: number;
}

export function useOrderReferenceLines({
  activeId,
}: UseOrderReferenceLinesProps) {
  const { openPositions } = usePositionsStore();
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
