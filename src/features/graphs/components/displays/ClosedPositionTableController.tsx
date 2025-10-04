import { useDigitalOptionsStore } from "@/stores/digitalOptionsStore";
import { useSelectedBalance } from "@/features/graphs/hooks/positions/useSelectedBalance";
import { useGetClosedPositions } from "@/features/graphs/hooks/positions/useFilteredPositions";
import ClosedPositionsPanel from "@/components/display/positions/ClosedPositionsPanel";
import PositionsPanelLoader from "@/components/display/positions/elements/PositionsPanelLoader";
import { useClosedPositionsLoading } from "@/hooks/positions/useGetClosedPositions";

export default function ClosedPositionTableController() {
  const { activeInformation } = useDigitalOptionsStore();
  const { selectedBalance } = useSelectedBalance();
  const closedPositionsForSelectedBalance = useGetClosedPositions();

  const isLoading = useClosedPositionsLoading();

  if (isLoading) {
    return <PositionsPanelLoader />;
  }

  if (closedPositionsForSelectedBalance.length === 0) {
    return null;
  }

  return (
    <div className="h-full w-full relative overflow-y-auto ">
      <div className="h-full w-full absolute">
        <ClosedPositionsPanel
          closedPositions={closedPositionsForSelectedBalance}
          activeInformation={activeInformation}
          balance={selectedBalance}
          itemsPerPage={20}
        />
      </div>
    </div>
  );
}
