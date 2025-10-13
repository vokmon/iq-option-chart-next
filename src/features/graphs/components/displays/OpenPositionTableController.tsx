import { useDigitalOptionsStore } from "@/stores/digitalOptionsStore";
import { useSelectedBalance } from "@/features/graphs/hooks/positions/useSelectedBalance";
import { useGetOpenPositions } from "@/features/graphs/hooks/positions/useFilteredPositions";
import { Position } from "@quadcode-tech/client-sdk-js";
import { notifications } from "@mantine/notifications";
import SellPositionNotitication from "@/components/notifications/SellPositionNotitication";
import OpenPositionsPanel from "@/components/display/positions/OpenPositionsPanel";

export default function OpenPositionTableController() {
  const { activeInformation } = useDigitalOptionsStore();
  const { selectedBalance } = useSelectedBalance();
  const openPositionsForSelectedBalance = useGetOpenPositions();

  if (openPositionsForSelectedBalance.length === 0) {
    return null;
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
    <div className="w-full mb-1">
      <OpenPositionsPanel
        openPositions={openPositionsForSelectedBalance}
        activeInformation={activeInformation}
        balance={selectedBalance}
        onSellClick={handleSellClick}
        cardClassName="bg-gray-300"
        textColor="black"
      />
    </div>
  );
}
