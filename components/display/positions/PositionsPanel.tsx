import ClosePositionCard from "./ClosePositionCard";
import OpenPositionCard from "./OpenPositionCard";
import { Active, Balance, Position } from "@quadcode-tech/client-sdk-js";

interface PositionsPanelProps {
  openPositions: Position[];
  closedPositions: Position[];
  activeInformation?: Record<number, Active>;
  balance?: Balance;
}

export default function PositionsPanel({
  openPositions,
  closedPositions,
  activeInformation,
  balance,
}: PositionsPanelProps) {
  return (
    <div className="flex flex-col gap-1">
      {openPositions.map((position) => {
        const activeInfo = activeInformation?.[position.activeId as number];

        return (
          <OpenPositionCard
            key={position.externalId}
            position={position}
            activeInfo={activeInfo}
            balance={balance}
          />
        );
      })}
      {closedPositions.map((position) => {
        const activeInfo = activeInformation?.[position.activeId as number];

        return (
          <ClosePositionCard
            key={position.externalId}
            position={position}
            activeInfo={activeInfo}
            balance={balance}
          />
        );
      })}
    </div>
  );
}
