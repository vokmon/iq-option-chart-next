"use client";

import React, { useState, useEffect, useCallback, useRef } from "react";
import {
  Group,
  Text,
  Paper,
  Stack,
  Divider,
  Badge,
  Tooltip,
  Modal,
  Button,
  ActionIcon,
} from "@mantine/core";
import {
  IconChevronDown,
  IconAlertTriangle,
  IconCheck,
} from "@tabler/icons-react";
import { useTranslations } from "next-intl";
import { useSdk } from "@/hooks/useSdk";
import { formatAmount } from "@/utils/currency";
import { getBalanceTypeLabel, getBalanceTypeColor } from "@/utils/balanceType";
import type { Balance } from "@quadcode-tech/client-sdk-js";

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
  const [modalOpened, setModalOpened] = useState(false);
  const onBalanceChangeRef = useRef(onBalanceChange);

  // Update ref when callback changes
  useEffect(() => {
    onBalanceChangeRef.current = onBalanceChange;
  }, [onBalanceChange]);

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
  const handleBalanceChange = (balance: Balance) => {
    setSelectedBalance(balance);
    onBalanceChangeRef.current?.(balance);
    setModalOpened(false);
  };

  if (loading) {
    return (
      <Paper p="sm" withBorder>
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
    <Stack gap="xs" p={"xs"}>
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
    <>
      <Paper p="xs" withBorder>
        <Stack gap="sm">
          {/* Balance Display with Clickable Account Selector */}
          {selectedBalance && (
            <Tooltip label={balanceInfo} position="bottom" withArrow multiline>
              <Group justify="space-between" align="center">
                {/* Clickable Account Type Badge */}
                <Badge
                  color={getBalanceTypeColor(
                    selectedBalance.type?.toString() || ""
                  )}
                  variant="filled"
                  size="lg"
                  style={{ cursor: "pointer", textTransform: "none" }}
                  onClick={() => setModalOpened(true)}
                  rightSection={
                    <ActionIcon
                      size="xs"
                      color="white"
                      variant="transparent"
                      onClick={(e) => {
                        e.stopPropagation();
                        setModalOpened(true);
                      }}
                    >
                      <IconChevronDown size={12} />
                    </ActionIcon>
                  }
                >
                  {t(
                    getBalanceTypeLabel(selectedBalance.type?.toString() || "")
                  )}
                </Badge>

                {/* Balance Amount */}
                <Group gap="xs" align="center">
                  {selectedBalance.amount === 0 && (
                    <IconAlertTriangle
                      size={16}
                      color="orange"
                      style={{ flexShrink: 0 }}
                    />
                  )}
                  <Text
                    fw={700}
                    c={
                      selectedBalance.amount === 0
                        ? "orange"
                        : getBalanceTypeColor(
                            selectedBalance.type?.toString() || ""
                          )
                    }
                    className="!text-sm"
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
        </Stack>
      </Paper>

      {/* Account Selection Modal */}
      <Modal
        opened={modalOpened}
        onClose={() => setModalOpened(false)}
        title={t("Select Account")}
        size="sm"
        centered
      >
        <Stack gap="sm">
          {balances.map((balance) => (
            <Button
              key={balance.id}
              variant={selectedBalance?.id === balance.id ? "filled" : "light"}
              color={getBalanceTypeColor(balance.type?.toString() || "")}
              justify="space-between"
              leftSection={
                selectedBalance?.id === balance.id ? (
                  <IconCheck size={16} />
                ) : (
                  <div style={{ width: 16 }} />
                )
              }
              rightSection={
                <Text size="sm" fw={500}>
                  {formatAmount(balance.amount, balance.currency)}
                </Text>
              }
              onClick={() => handleBalanceChange(balance)}
              fullWidth
              size="md"
            >
              {t(getBalanceTypeLabel(balance.type?.toString() || ""))}
            </Button>
          ))}
        </Stack>
      </Modal>
    </>
  );
}
