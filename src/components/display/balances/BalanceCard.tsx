"use client";

import { Balance, BalanceType } from "@quadcode-tech/client-sdk-js";
import { Text, Badge, Group, Stack } from "@mantine/core";
import { useEffect, useState } from "react";
import { useTranslations } from "next-intl";
import { formatAmount } from "@/utils/currency";

type BalanceCardProps = {
  balance: Balance;
};

export default function BalanceCard({ balance }: BalanceCardProps) {
  const [amount, setAmount] = useState(balance.amount);
  const t = useTranslations();

  useEffect(() => {
    balance.subscribeOnUpdate((balance) => {
      setAmount(balance.amount);
    });
    return () => {
      balance.unsubscribeOnUpdate((balance) => {
        setAmount(balance.amount);
      });
    };
  }, [balance]);

  const getBalanceTypeColor = (type: BalanceType | undefined) => {
    switch (type) {
      case BalanceType.Real:
        return "green";
      case BalanceType.Demo:
        return "orange";
      default:
        return "gray";
    }
  };

  const getBalanceTypeLabel = (type: BalanceType | undefined) => {
    switch (type) {
      case BalanceType.Real:
        return "Real";
      case BalanceType.Demo:
        return "Practice";
      default:
        return "Unknown";
    }
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md py-4 px-6 border border-gray-200 dark:border-gray-700">
      <Group justify="space-between" align="flex-start">
        <Stack gap="xs">
          <Group gap="sm">
            <Text size="sm" fw={500} c="var(--mantine-color-gray-7)">
              {t("Balance")} #{balance.id}
            </Text>
            <Badge
              color={getBalanceTypeColor(balance.type)}
              variant="light"
              size="sm"
            >
              {getBalanceTypeLabel(balance.type)}
            </Badge>
          </Group>

          <Stack gap="xs">
            <div>
              <Text size="xs" c="var(--mantine-color-gray-6)" className="mb-1">
                {t("Available Balance")}
              </Text>
              <Text size="xl" fw={700} c="var(--mantine-color-gray-9)">
                {formatAmount(amount, balance.currency)}
              </Text>
            </div>
          </Stack>
        </Stack>
      </Group>
    </div>
  );
}
