"use client";

import { useEffect, useState } from "react";
import { Group, Text, Progress } from "@mantine/core";
import { IconClock } from "@tabler/icons-react";

interface CountdownWithProgressBarProps {
  title?: string;
  subtitle?: string;
  triggerTime: number;
  expiresAt: number;
  onComplete?: () => void;
}

export default function CountdownWithProgressBar({
  title,
  subtitle,
  triggerTime,
  expiresAt,
  onComplete,
}: CountdownWithProgressBarProps) {
  const [timeRemaining, setTimeRemaining] = useState<number>(0);

  // Calculate time remaining until break period ends
  useEffect(() => {
    const updateTimeRemaining = () => {
      const now = Date.now();
      const remaining = Math.max(0, expiresAt - now);
      setTimeRemaining(remaining);
      if (remaining <= 0) {
        onComplete?.();
      }
    };

    updateTimeRemaining();
    const interval = setInterval(updateTimeRemaining, 1000);

    return () => clearInterval(interval);
  }, [expiresAt, onComplete]);

  const formatTimeRemaining = (ms: number) => {
    const minutes = Math.floor(ms / (1000 * 60));
    const seconds = Math.floor((ms % (1000 * 60)) / 1000);
    return `${minutes}:${seconds.toString().padStart(2, "0")}`;
  };

  const getProgressPercentage = () => {
    const totalDuration = expiresAt - triggerTime;
    const elapsed = Date.now() - triggerTime;
    return Math.min(100, Math.max(0, (elapsed / totalDuration) * 100));
  };

  return (
    <>
      <Group justify="space-between" align="center">
        {title && (
          <Text size="sm" fw={600} c="gray.8">
            {title}
          </Text>
        )}
        <Group gap="xs">
          <IconClock size={16} />
          <Text size="sm" fw={600} c="orange.6">
            {formatTimeRemaining(timeRemaining)}
          </Text>
        </Group>
      </Group>

      <Progress
        value={getProgressPercentage()}
        color="orange"
        size="sm"
        radius="xl"
        animated
      />

      {subtitle && (
        <Text size="xs" c="dimmed" ta="center" mt="sm">
          {subtitle}
        </Text>
      )}
    </>
  );
}
