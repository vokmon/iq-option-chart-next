"use client";

import React, { useState, useEffect, useCallback, useRef } from "react";
import {
  Select,
  Group,
  Text,
  Paper,
  Stack,
  Divider,
  Badge,
  Tooltip,
} from "@mantine/core";
import { IconChevronDown, IconAlertTriangle } from "@tabler/icons-react";
import { useTranslations } from "next-intl";
import { useSdk } from "@/hooks/useSdk";
import type { Balance, BalanceType } from "@quadcode-tech/client-sdk-js";

interface BalanceSelectorProps {
  onBalanceChange?: (balance: Balance) => void;
  selectedBalanceId?: number;
}

export default function BalanceSelector({
  onBalanceChange,
  selectedBalanceId,
}: BalanceSelectorProps) {
  const { sdk } = useSdk();
  const t = useTranslations();
  const [balances, setBalances] = useState<Balance[]>([]);
  const [selectedBalance, setSelectedBalance] = useState<Balance | null>(null);
  const [loading, setLoading] = useState(true);
  const onBalanceChangeRef = useRef(onBalanceChange);

  // Update ref when callback changes
  useEffect(() => {
    onBalanceChangeRef.current = onBalanceChange;
  }, [onBalanceChange]);

  // Format currency amount
  const formatAmount = (amount: number, currency: string) => {
    const symbol =
      currency === "USD" ? "$" : currency === "THB" ? "฿" : currency;
    return `${symbol} ${amount.toLocaleString("en-US", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    })}`;
  };

  // Get balance type display name
  const getBalanceTypeDisplay = (type: BalanceType | undefined) => {
    switch (type) {
      case "real":
        return t("Real");
      case "demo":
        return t("Practice");
      default:
        return t("UNKNOWN");
    }
  };

  // Get balance type color
  const getBalanceTypeColor = (type: BalanceType | undefined) => {
    switch (type) {
      case "real":
        return "green";
      case "demo":
        return "orange";
      default:
        return "gray";
    }
  };

  // Load initial balances
  const loadBalances = useCallback(async () => {
    if (!sdk) return;

    try {
      setLoading(true);
      const balancesData = await sdk.balances();
      const balancesList = balancesData.getBalances();
      setBalances(balancesList);

      // Set initial selected balance
      if (balancesList.length > 0) {
        const initialBalance = selectedBalanceId
          ? balancesList.find((b) => b.id === selectedBalanceId) ||
            balancesList[0]
          : balancesList[0];

        setSelectedBalance(initialBalance);
        onBalanceChangeRef.current?.(initialBalance);
      }
    } catch (error) {
      console.error("Failed to load balances:", error);
    } finally {
      setLoading(false);
    }
  }, [sdk, selectedBalanceId]);

  // Subscribe to balance updates
  useEffect(() => {
    if (!sdk || balances.length === 0) return;

    const updateCallbacks: Array<{
      id: number;
      callback: (balance: Balance) => void;
    }> = [];

    // Subscribe to updates for each balance
    balances.forEach((balance) => {
      const callback = (updatedBalance: Balance) => {
        setBalances((prevBalances) =>
          prevBalances.map((b) =>
            b.id === updatedBalance.id ? updatedBalance : b
          )
        );

        // Update selected balance if it's the one that changed
        if (selectedBalance?.id === updatedBalance.id) {
          setSelectedBalance(updatedBalance);
          onBalanceChangeRef.current?.(updatedBalance);
        }
      };

      updateCallbacks.push({ id: balance.id, callback });
      sdk.balances().then((balancesInstance) => {
        balancesInstance.subscribeOnUpdateBalance(balance.id, callback);
      });
    });

    // Cleanup function
    return () => {
      updateCallbacks.forEach(({ id, callback }) => {
        sdk.balances().then((balancesInstance) => {
          balancesInstance.unsubscribeOnUpdateBalance(id, callback);
        });
      });
    };
  }, [sdk, balances, selectedBalance?.id]);

  // Load balances on mount
  useEffect(() => {
    loadBalances();
  }, [loadBalances]);

  // Handle selectedBalanceId prop changes
  useEffect(() => {
    if (selectedBalanceId && balances.length > 0) {
      const balance = balances.find((b) => b.id === selectedBalanceId);
      if (balance && balance.id !== selectedBalance?.id) {
        setSelectedBalance(balance);
        onBalanceChangeRef.current?.(balance);
      }
    }
  }, [selectedBalanceId, balances, selectedBalance?.id]);

  // Handle balance selection
  const handleBalanceChange = (value: string | null) => {
    if (!value) return;

    const balance = balances.find((b) => b.id === parseInt(value));
    if (balance) {
      setSelectedBalance(balance);
      onBalanceChangeRef.current?.(balance);
    }
  };

  if (loading) {
    return (
      <Paper p="md" withBorder>
        <Text size="sm" c="dimmed">
          {t("Loading balances")}
        </Text>
      </Paper>
    );
  }

  if (balances.length === 0) {
    return (
      <Paper p="md" withBorder>
        <Text size="sm" c="dimmed">
          {t("No balances available")}
        </Text>
      </Paper>
    );
  }

  // Create detailed balance info for tooltip
  const balanceInfo = selectedBalance ? (
    <Stack gap="xs" p="xs">
      <Group justify="space-between">
        <Text size="sm" fw={500}>
          {t("Available")}
        </Text>
        <Text size="sm" fw={600}>
          {formatAmount(selectedBalance.amount, selectedBalance.currency)}
        </Text>
      </Group>
      <Group justify="space-between">
        <Text size="sm" fw={500}>
          {t("Investment")}
        </Text>
        <Text size="sm" fw={600}>
          $ 0.00
        </Text>
      </Group>
      <Divider size="xs" />
    </Stack>
  ) : null;

  return (
    <Paper p="sm" withBorder>
      <Stack gap="sm">
        {/* Compact Balance Display */}
        {selectedBalance && (
          <Tooltip label={balanceInfo} position="bottom" withArrow multiline>
            <Group justify="space-between" align="center">
              <Badge
                color={getBalanceTypeColor(selectedBalance.type)}
                variant="light"
                size="sm"
              >
                {getBalanceTypeDisplay(selectedBalance.type)}
              </Badge>
              <Group gap="xs" align="center">
                {selectedBalance.amount === 0 && (
                  <IconAlertTriangle
                    size={16}
                    color="orange"
                    style={{ flexShrink: 0 }}
                  />
                )}
                <Text
                  size="md"
                  fw={600}
                  c={
                    selectedBalance.amount === 0
                      ? "orange"
                      : getBalanceTypeColor(selectedBalance.type)
                  }
                  style={{ cursor: "pointer" }}
                >
                  {formatAmount(
                    selectedBalance.amount,
                    selectedBalance.currency
                  )}
                </Text>
              </Group>
            </Group>
          </Tooltip>
        )}

        {/* Balance Selector Dropdown */}
        <Select
          placeholder={t("Select balance")}
          value={selectedBalance?.id.toString()}
          onChange={handleBalanceChange}
          data={balances.map((balance) => ({
            value: balance.id.toString(),
            label: `${getBalanceTypeDisplay(balance.type)} - ${formatAmount(
              balance.amount,
              balance.currency
            )}`,
          }))}
          rightSection={<IconChevronDown size={16} />}
          size="xs"
          styles={{
            option: {
              fontSize: "0.875rem", // text-sm equivalent
              padding: "8px 12px",
            },
          }}
        />
      </Stack>
    </Paper>
  );
}
