import PositionsPanel from "@/components/display/positions/PositionsPanel";
import { useDigitalOptionsStore } from "@/stores/digitalOptionsStore";
import { useSelectedBalance } from "@/features/graphs/hooks/positions/useSelectedBalance";
import { useFilteredPositions } from "@/features/graphs/hooks/positions/useFilteredPositions";
import { Position } from "@quadcode-tech/client-sdk-js";
import { notifications } from "@mantine/notifications";
import SellPositionNotitication from "@/components/notifications/SellPositionNotitication";
import { useClosedPositionsLoading } from "@/hooks/positions/useGetClosedPositions";
import PositionsPanelLoader from "@/components/display/positions/PositionsPanelLoader";

export default function PositionTableController() {
  const { activeInformation } = useDigitalOptionsStore();
  const { selectedBalance } = useSelectedBalance();
  const { openPositionsForSelectedBalance, closedPositionsForSelectedBalance } =
    useFilteredPositions();

  const isLoading = useClosedPositionsLoading();

  if (isLoading) {
    return <PositionsPanelLoader />;
  }

  const handleSellClick = async (position: Position) => {
    await position.sell();
    notifications.show({
      title: "Success",
      message: <SellPositionNotitication position={position} />,
      color: "green",
      position: "top-right",
    });
  };

  return (
    <div className="h-full w-full relative overflow-y-auto ">
      <div className="h-full w-full absolute">
        <PositionsPanel
          openPositions={openPositionsForSelectedBalance}
          closedPositions={closedPositionsForSelectedBalance}
          activeInformation={activeInformation}
          balance={selectedBalance}
          onSellClick={handleSellClick}
          itemsPerPage={20}
        />
      </div>
    </div>
  );
}
