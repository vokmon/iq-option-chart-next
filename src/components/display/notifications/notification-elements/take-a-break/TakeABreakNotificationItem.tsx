"use client";

import { BreakWarningEvent } from "@/stores/notifications/breakWarningStore";
import { Box, Group, Text, ThemeIcon, Badge } from "@mantine/core";
import { IconCoffee } from "@tabler/icons-react";
import { useTranslations } from "next-intl";
import { getBalanceTypeColor, getBalanceTypeLabel } from "@/utils/balanceType";
import { formatDateTime } from "@/utils/dateTime";
import CountdownWithProgressBar from "@/components/display/countdown/CountdownWithProgressBar";

export default function TakeABreakNotificationItem({
  warning,
  onComplete,
}: {
  warning: BreakWarningEvent;
  onComplete?: () => void;
}) {
  const t = useTranslations();

  const lossRate = Math.round((warning.lossCount / warning.totalOrders) * 100);

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
      <div className="grid grid-cols-4 gap-2 mb-2">
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
      <CountdownWithProgressBar
        title={t("Take your time")}
        subtitle={t(
          "I've turned off auto-trading for you When you're ready to try again, just turn it back on"
        )}
        triggerTime={warning.triggerTime}
        expiresAt={warning.expiresAt}
        onComplete={onComplete}
      />
    </Box>
  );
}
