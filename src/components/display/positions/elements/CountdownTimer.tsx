"use client";

import { Text } from "@mantine/core";
import { useSdk } from "@/hooks/useSdk";
import { useEffect, useState } from "react";
import { formatSecondsToMMSS } from "@/utils/dateTime";

interface CountdownTimerProps {
  endTime: Date;
  className?: string;
}

export default function CountdownTimer({
  endTime,
  className,
}: CountdownTimerProps) {
  const { sdk } = useSdk();
  const [timeLeft, setTimeLeft] = useState<number>(0);

  useEffect(() => {
    if (!sdk) return;

    const updateCountdown = () => {
      const now = sdk.currentTime();
      const remaining = (endTime.getTime() - now.getTime()) / 1000;
      setTimeLeft(remaining);
    };

    // Initial calculation
    updateCountdown();

    // Set up interval to update every second
    const interval = setInterval(updateCountdown, 1000);

    // Cleanup interval on unmount
    return () => clearInterval(interval);
  }, [sdk, endTime]);

  if (!sdk) {
    return (
      <div className={className}>
        <Text size="sm" fw={500} c="gray">
          Loading...
        </Text>
      </div>
    );
  }

  if (timeLeft <= 0) {
    return (
      <div className={className}>
        <Text size="sm" fw={500} c="red">
          00:00
        </Text>
      </div>
    );
  }

  // Format the countdown display using utility function
  const display = formatSecondsToMMSS(timeLeft);

  return (
    <div className={className}>
      <Text size="sm" fw={500} c="gray.9">
        {display}
      </Text>
    </div>
  );
}
