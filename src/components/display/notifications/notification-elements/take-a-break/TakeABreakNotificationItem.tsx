"use client";

import { BreakWarningEvent } from "@/stores/notifications/breakWarningStore";
import { Box, Group, Text, ThemeIcon, Badge, Progress } from "@mantine/core";
import { IconCoffee, IconClock } from "@tabler/icons-react";
import { useTranslations } from "next-intl";
import { getBalanceTypeColor, getBalanceTypeLabel } from "@/utils/balanceType";
import { formatDateTime } from "@/utils/dateTime";
import { useEffect, useState } from "react";

export default function TakeABreakNotificationItem({
  warning,
}: {
  warning: BreakWarningEvent;
}) {
  const t = useTranslations();
  const [timeRemaining, setTimeRemaining] = useState<number>(0);

  const lossRate = Math.round((warning.lossCount / warning.totalOrders) * 100);

  // Calculate time remaining until break period ends
  useEffect(() => {
    const updateTimeRemaining = () => {
      const now = Date.now();
      const remaining = Math.max(0, warning.expiresAt - now);
      setTimeRemaining(remaining);
    };

    updateTimeRemaining();
    const interval = setInterval(updateTimeRemaining, 1000);

    return () => clearInterval(interval);
  }, [warning.expiresAt]);

  const formatTimeRemaining = (ms: number) => {
    const minutes = Math.floor(ms / (1000 * 60));
    const seconds = Math.floor((ms % (1000 * 60)) / 1000);
    return `${minutes}:${seconds.toString().padStart(2, "0")}`;
  };

  const getProgressPercentage = () => {
    const totalDuration = warning.expiresAt - warning.triggerTime;
    const elapsed = Date.now() - warning.triggerTime;
    return Math.min(100, Math.max(0, (elapsed / totalDuration) * 100));
  };

  return (
    <Box className="p-4 bg-orange-50 dark:bg-orange-900/20 rounded-lg border border-orange-200 dark:border-orange-700">
      {/* Header */}
      <Group justify="space-between" align="flex-start" mb="sm">
        <Group gap="sm">
          <ThemeIcon size="md" radius="xl" variant="light" color="orange">
            <IconCoffee size={30} />
          </ThemeIcon>
          <Text size="md" fw={600} c="orange.7">
            {t("Trading Break Recommended")}
          </Text>
        </Group>
      </Group>

      {/* Main message */}
      <Text size="sm" c="gray.7" mb="md">
        {t(
          "You've experienced consecutive losses over the past {timeWindow} minutes",
          { timeWindow: warning.timeWindow }
        )}
      </Text>

      {/* Account info */}
      <Group justify="space-between" align="center" mb="sm">
        <Group gap="sm">
          <Text size="xs" c="gray.6">
            {t("Account")}
          </Text>
          <Badge
            color={getBalanceTypeColor(warning.balance.balanceType)}
            variant="light"
            size="xs"
          >
            {getBalanceTypeLabel(warning.balance.balanceType)}
          </Badge>
        </Group>
        <Text size="xs" c="dimmed">
          {formatDateTime(warning.triggerTime)}
        </Text>
      </Group>

      {/* Stats grid */}
      <div className="grid grid-cols-4 gap-2">
        <div className="text-center p-2 bg-white dark:bg-gray-900 rounded">
          <Text size="xs" c="dimmed" mb={1}>
            {t("Time")}
          </Text>
          <Text size="sm" fw={600}>
            {warning.timeWindow}m
          </Text>
        </div>

        <div className="text-center p-2 bg-white dark:bg-gray-900 rounded">
          <Text size="xs" c="dimmed" mb={1}>
            {t("Orders")}
          </Text>
          <Text size="sm" fw={600}>
            {warning.totalOrders}
          </Text>
        </div>

        <div className="text-center p-2 bg-white dark:bg-gray-900 rounded">
          <Text size="xs" c="dimmed" mb={1}>
            {t("Lost")}
          </Text>
          <Text size="sm" fw={600} c="red.5">
            {warning.lossCount}
          </Text>
        </div>

        <div className="text-center p-2 bg-white dark:bg-gray-900 rounded">
          <Text size="xs" c="dimmed" mb={1}>
            {t("Rate")}
          </Text>
          <Text size="sm" fw={600} c="red.5">
            {lossRate}%
          </Text>
        </div>
      </div>

      {/* Countdown section */}
      {warning.settings.pauseAutoTrade && (
        <Box className="mt-3 p-3 bg-orange-100 dark:bg-orange-900/30 rounded border border-orange-300 dark:border-orange-600">
          <Group justify="space-between" align="center" mb="xs">
            <Text size="xs" fw={600} c="orange.7">
              {t("Take your time")}
            </Text>
            <Group gap="xs">
              <IconClock size={12} />
              <Text size="xs" fw={600} c="orange.6">
                {formatTimeRemaining(timeRemaining)}
              </Text>
            </Group>
          </Group>

          <Progress
            value={getProgressPercentage()}
            color="orange"
            size="xs"
            radius="xl"
            animated
            className="mb-2"
          />

          <Text size="xs" c="orange.6" ta="center">
            {t("Auto-trading paused")}
          </Text>
        </Box>
      )}
    </Box>
  );
}
