"use client";

import React, { useState } from "react";
import { Paper, Stack, NumberInput, Text, Center } from "@mantine/core";
import { useTranslations } from "next-intl";
import type { Balance } from "@quadcode-tech/client-sdk-js";
import BalanceSelector from "./BalanceSelector";
import OrderDirectionSelector from "./OrderDirectionSelector";
import { getCurrencySymbol } from "@/utils/currency";

interface TradingPanelProps {
  onBalanceChange?: (balance: Balance) => void;
  onCall?: (balance: Balance, amount: number) => void;
  onPut?: (balance: Balance, amount: number) => void;
  onAmountChange?: (amount: number) => void;
  disabled?: boolean;
  selectedBalanceId?: number;
  amount?: number;
  minAmount?: number;
  maxAmount?: number;
}

export default function TradingPanel({
  onBalanceChange,
  onCall,
  onPut,
  onAmountChange,
  disabled = false,
  selectedBalanceId,
  amount,
  minAmount = 1,
  maxAmount = 10000,
}: TradingPanelProps) {
  const t = useTranslations();
  const [selectedBalance, setSelectedBalance] = useState<Balance | null>(null);

  const handleCall = () => {
    if (amount !== undefined) {
      onCall?.(selectedBalance!, amount);
    }
  };

  const handlePut = () => {
    if (amount !== undefined) {
      onPut?.(selectedBalance!, amount);
    }
  };

  // Determine why buttons are disabled
  const getDisabledReason = () => {
    if (disabled) return t("Trading is disabled");
    if (!amount) return t("Please enter an amount");
    if (!selectedBalance) return t("No balance");
    if (selectedBalance?.amount === 0) return t("Insufficient balance");
    return null;
  };

  return (
    <Paper p="sm" withBorder radius="md">
      <Stack gap="sm">
        {/* Balance Selection */}
        <BalanceSelector
          onBalanceChange={(balance) => {
            setSelectedBalance(balance);
            onBalanceChange?.(balance);
          }}
          selectedBalanceId={selectedBalanceId}
        />

        {/* Amount Input Field */}
        <NumberInput
          placeholder={t("Enter amount")}
          value={amount}
          onChange={(value) => {
            const newAmount = typeof value === "number" ? value : 0;
            onAmountChange?.(newAmount);
          }}
          leftSection={getCurrencySymbol(selectedBalance?.currency)}
          min={minAmount}
          max={maxAmount}
          step={1}
          disabled={disabled}
          size="sm"
          styles={{
            input: {
              fontWeight: 600,
              textAlign: "center",
            },
          }}
        />

        {/* Order Direction Selector or Disabled Message */}
        {disabled ||
        !amount ||
        !selectedBalance ||
        selectedBalance?.amount === 0 ? (
          <Center
            style={{
              minHeight: 36,
              padding: "8px 16px",
              backgroundColor: "var(--mantine-color-orange-0)",
              borderRadius: "var(--mantine-radius-sm)",
              border: "1px solid var(--mantine-color-orange-2)",
            }}
          >
            <Text
              size="sm"
              c="orange"
              ta="center"
              fw={500}
              style={{
                fontStyle: "italic",
                letterSpacing: "0.01em",
              }}
            >
              {getDisabledReason()}
            </Text>
          </Center>
        ) : (
          <OrderDirectionSelector
            onCall={handleCall}
            onPut={handlePut}
            size="sm"
            fullWidth
          />
        )}
      </Stack>
    </Paper>
  );
}
