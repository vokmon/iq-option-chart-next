"use client";

import React from "react";
import { Text, Group, Badge, Box } from "@mantine/core";
import { useTranslations } from "next-intl";
import { formatDateTime } from "@/utils/dateTime";
import { formatAmount } from "@/utils/currency";
import { getBalanceTypeColor, getBalanceTypeLabel } from "@/utils/balanceType";
import { BalanceGoalFulfillment } from "@/stores/notifications/goalFulfillmentStore";

interface GoalFulfillmentNotificationItemProps {
  fulfillment: BalanceGoalFulfillment;
}

export default function GoalFulfillmentNotificationItem({
  fulfillment,
}: GoalFulfillmentNotificationItemProps) {
  const t = useTranslations();

  const getNotificationIcon = (type: string) => {
    return type === "profit" ? "🎉" : "⚠️";
  };

  const getNotificationColor = (type: string) => {
    return type === "profit" ? "green" : "red";
  };

  return (
    <Box
      p="sm"
      style={{
        borderRadius: "8px",
        border: `1px solid ${
          fulfillment.type === "profit"
            ? "var(--mantine-color-green-2)"
            : "var(--mantine-color-red-2)"
        }`,
        background:
          fulfillment.type === "profit"
            ? "var(--mantine-color-green-0)"
            : "var(--mantine-color-red-0)",
      }}
    >
      <Group justify="space-between" align="flex-start">
        <Group gap="sm" align="flex-start" style={{ flex: 1 }}>
          <Text size="lg">{getNotificationIcon(fulfillment.type)}</Text>
          <Box style={{ flex: 1 }}>
            <Text size="sm" fw={600} c={getNotificationColor(fulfillment.type)}>
              {fulfillment.type === "profit"
                ? t("Profit Target Reached")
                : t("Loss Limit Reached")}
            </Text>
            <Group gap="xs" mt={4}>
              <Text size="xs" c="dimmed">
                {t("Balance")}:
              </Text>
              <Badge
                color={getBalanceTypeColor(
                  fulfillment.balance.balanceType?.toString() || ""
                )}
                variant="light"
                size="xs"
              >
                {t(
                  getBalanceTypeLabel(
                    fulfillment.balance.balanceType?.toString() || ""
                  )
                )}
              </Badge>
            </Group>
            <Text size="xs" c="dimmed" mt={2}>
              {t("Target")}:{" "}
              {formatAmount(
                fulfillment.targetValue,
                fulfillment.balance.balanceCurrency
              )}
            </Text>
            <Text
              size="xs"
              c={fulfillment.actualValue >= 0 ? "green" : "red"}
              fw={500}
              mt={1}
            >
              {t("Actual")}:{" "}
              {formatAmount(
                fulfillment.actualValue,
                fulfillment.balance.balanceCurrency
              )}
            </Text>
            <Text size="xs" c="dimmed" mt={2}>
              {formatDateTime(new Date(fulfillment.createdAt))}
            </Text>
          </Box>
        </Group>
      </Group>
    </Box>
  );
}
