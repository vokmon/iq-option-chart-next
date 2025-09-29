"use client";

import { Text } from "@mantine/core";
import { useSdk } from "@/hooks/useSdk";
import { useEffect, useState } from "react";

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
          Expired
        </Text>
      </div>
    );
  }

  // Calculate time components
  const days = Math.floor(timeLeft / (24 * 60 * 60));
  const hours = Math.floor((timeLeft % (24 * 60 * 60)) / (60 * 60));
  const minutes = Math.floor((timeLeft % (60 * 60)) / 60);
  const seconds = Math.floor(timeLeft % 60);

  // Format the countdown display
  let display = "";
  if (days > 0) {
    display = `${days}d ${hours}h ${minutes}m`;
  } else if (hours > 0) {
    display = `${hours}h ${minutes}m ${seconds}s`;
  } else if (minutes > 0) {
    display = `${minutes}m ${seconds}s`;
  } else {
    display = `${seconds}s`;
  }

  return (
    <div className={className}>
      <Text size="sm" fw={500} c="blue">
        {display}
      </Text>
    </div>
  );
}
