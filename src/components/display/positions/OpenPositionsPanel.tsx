"use client";

import OpenPositionCard from "./elements/OpenPositionCard";
import { Active, Balance, Position } from "@quadcode-tech/client-sdk-js";

interface OpenPositionsPanelProps {
  openPositions: Position[];
  activeInformation?: Record<number, Active>;
  balance?: Balance;
  onSellClick?: (position: Position) => void;
  cardClassName?: string;
  textColor?: string;
}

export default function OpenPositionsPanel({
  openPositions,
  activeInformation,
  balance,
  onSellClick,
  cardClassName,
  textColor,
}: OpenPositionsPanelProps) {
  if (openPositions.length === 0) {
    return null;
  }
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
            onSellClick={onSellClick}
            className={cardClassName}
            textColor={textColor}
          />
        );
      })}
    </div>
  );
}
