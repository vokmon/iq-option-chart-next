"use client";

import React from "react";
import { NumberInput, ActionIcon, Menu } from "@mantine/core";
import { IconChevronDown } from "@tabler/icons-react";
import { useTranslations } from "next-intl";
import { Balance } from "@quadcode-tech/client-sdk-js";
import { formatAmount } from "@/utils/currency";

interface AmountInputProps {
  value?: number;
  onChange?: (amount: number) => void;
  disabled?: boolean;
  leftSection?: React.ReactNode;
  quickAmounts?: number[];
  size?: "xs" | "sm" | "md" | "lg" | "xl";
  placeholder?: string;
  balance?: Balance;
}

export default function AmountInput({
  value,
  onChange,
  disabled = false,
  leftSection,
  quickAmounts = [1, 10, 100, 1000, 10000],
  size = "xs",
  placeholder,
  balance,
}: AmountInputProps) {
  const t = useTranslations();

  return (
    <NumberInput
      placeholder={placeholder || t("Enter amount")}
      value={value}
      onChange={(val) => {
        const newAmount = typeof val === "number" ? val : 0;
        onChange?.(newAmount);
      }}
      leftSection={leftSection}
      rightSection={
        <Menu position="bottom-end" shadow="md" width={150}>
          <Menu.Target>
            <ActionIcon
              variant="subtle"
              color="gray"
              size="sm"
              disabled={disabled}
              aria-label="Quick amounts"
            >
              <IconChevronDown size={16} />
            </ActionIcon>
          </Menu.Target>
          <Menu.Dropdown>
            <Menu.Label>{t("Quick amounts")}</Menu.Label>
            {quickAmounts.map((quickAmount) => (
              <Menu.Item
                key={quickAmount}
                onClick={() => onChange?.(quickAmount)}
                style={{
                  fontWeight: value === quickAmount ? 600 : 400,
                  backgroundColor:
                    value === quickAmount
                      ? "var(--mantine-color-blue-0)"
                      : undefined,
                }}
              >
                {formatAmount(quickAmount, balance?.currency)}
              </Menu.Item>
            ))}
          </Menu.Dropdown>
        </Menu>
      }
      step={1}
      disabled={disabled}
      size={size}
      styles={{
        input: {
          fontWeight: 600,
          textAlign: "center",
        },
      }}
      thousandSeparator
    />
  );
}
