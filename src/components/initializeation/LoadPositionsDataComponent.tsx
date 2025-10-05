"use client";

import { useGetClosedPositions } from "@/hooks/positions/useGetClosedPositions";
import { useGetOpenPositions } from "@/hooks/positions/useGetOpenPositions";
import { useSubscribeToPositionsUpdates } from "@/hooks/positions/useSubscribeToPositionsUpdates";
import { notifications } from "@mantine/notifications";
import { Position } from "@quadcode-tech/client-sdk-js";
import { PositionClosedNotification } from "@/components/notifications/PositionClosedNotification";
import { useEffect, useState } from "react";
import { useSdk } from "@/hooks/useSdk";
import { checkSameDay } from "@/utils/dateTime";

export default function LoadPositionsDataComponent() {
  const { sdk } = useSdk();
  const [date, setDate] = useState(new Date());
  useEffect(() => {
    sdk.subscribeOnWsCurrentTime((currentTime) => {
      setDate((previousDate) => {
        const isSameDay = checkSameDay(previousDate, currentTime);
        if (isSameDay) {
          return previousDate;
        }
        return currentTime;
      });
    });

    return () => {
      sdk.unsubscribeOnWsCurrentTime(() => {});
    };
  }, [sdk]);

  useGetOpenPositions();
  useGetClosedPositions(date);
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
