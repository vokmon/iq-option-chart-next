"use client";

import React, { useState } from "react";
import { Paper, Stack, NumberInput } from "@mantine/core";
import { useTranslations } from "next-intl";
import type { Balance } from "@quadcode-tech/client-sdk-js";
import BalanceSelector from "./BalanceSelector";
import OrderDirectionSelector from "./OrderDirectionSelector";

interface TradingPanelProps {
  onBalanceChange?: (balance: Balance) => void;
  onCall?: (amount: number) => void;
  onPut?: (amount: number) => void;
  disabled?: boolean;
  selectedBalanceId?: number;
  minAmount?: number;
  maxAmount?: number;
  defaultAmount?: number;
}

export default function TradingPanel({
  onBalanceChange,
  onCall,
  onPut,
  disabled = false,
  selectedBalanceId,
  minAmount = 1,
  maxAmount = 10000,
  defaultAmount,
}: TradingPanelProps) {
  const t = useTranslations();
  const [amount, setAmount] = useState<number | undefined>(defaultAmount);

  const handleCall = () => {
    if (amount !== undefined) {
      onCall?.(amount);
    }
  };

  const handlePut = () => {
    if (amount !== undefined) {
      onPut?.(amount);
    }
  };

  return (
    <Paper p="sm" withBorder radius="md">
      <Stack gap="sm">
        {/* Balance Selection */}
        <BalanceSelector
          onBalanceChange={onBalanceChange}
          selectedBalanceId={selectedBalanceId}
        />

        {/* Amount Input Field */}
        <NumberInput
          placeholder={t("Enter amount")}
          value={amount}
          onChange={(value) => setAmount(typeof value === "number" ? value : 0)}
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

        {/* Order Direction Selector */}
        <OrderDirectionSelector
          onCall={handleCall}
          onPut={handlePut}
          disabled={disabled || !amount || amount < minAmount}
          size="sm"
          fullWidth
        />
      </Stack>
    </Paper>
  );
}
