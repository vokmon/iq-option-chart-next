"use client";

import { useGetClosedPositions } from "@/hooks/positions/useGetClosedPositions";
import { useGetOpenPositions } from "@/hooks/positions/useGetOpenPositions";
import { useSubscribeToPositionsUpdates } from "@/hooks/positions/useSubscribeToPositionsUpdates";
import { notifications } from "@mantine/notifications";
import { Position } from "@quadcode-tech/client-sdk-js";
import { PositionClosedNotification } from "@/components/notifications/PositionClosedNotification";

export default function LoadPositionsDataComponent() {
  useGetOpenPositions();
  useGetClosedPositions();
  useSubscribeToPositionsUpdates({ onPositionClosed: handlePositionClosed });
  return null;
}

const handlePositionClosed = (position: Position) => {
  setTimeout(() => {
    notifications.show({
      title: "Position closed",
      message: <PositionClosedNotification position={position} />,
      color: "blue",
      position: "top-right",
    });
  }, 100);
};
