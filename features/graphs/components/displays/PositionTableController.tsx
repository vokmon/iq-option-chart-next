import PositionsPanel from "@/components/display/positions/PositionsPanel";
import { useDigitalOptionsStore } from "@/stores/digitalOptionsStore";
import { useSelectedBalance } from "@/features/graphs/hooks/positions/useSelectedBalance";
import { useFilteredPositions } from "@/features/graphs/hooks/positions/useFilteredPositions";

export default function PositionTableController() {
  const { activeInformation } = useDigitalOptionsStore();
  const { selectedBalance } = useSelectedBalance();
  const { openPositionsForSelectedBalance, closedPositionsForSelectedBalance } =
    useFilteredPositions();

  return (
    <div className="h-full w-full relative overflow-y-auto ">
      <div className="h-full w-full absolute">
        <PositionsPanel
          openPositions={openPositionsForSelectedBalance}
          closedPositions={closedPositionsForSelectedBalance}
          activeInformation={activeInformation}
          balance={selectedBalance}
        />
      </div>
    </div>
  );
}
