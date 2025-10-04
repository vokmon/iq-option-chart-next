"use client";

import { Switch, NumberInput, Text, Indicator } from "@mantine/core";
import { useTranslations } from "next-intl";
import { IconRobot } from "@tabler/icons-react";
import { Balance } from "@quadcode-tech/client-sdk-js";
import { getCurrencySymbol } from "@/utils/currency";

interface AutoTradeSelectorProps {
  onAutoTradeChange?: (enabled: boolean, positionCount: number) => void;
  enabled?: boolean;
  tradeAmount?: number;
  onTradeAmountChange?: (amount: number) => void;
  balance?: Balance;
}

export default function AutoTradeSelector({
  onAutoTradeChange,
  enabled = false,
  tradeAmount = 0,
  onTradeAmountChange,
  balance,
}: AutoTradeSelectorProps) {
  const t = useTranslations();

  const handleToggleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const enabled = event.currentTarget.checked;
    onAutoTradeChange?.(enabled, tradeAmount);
  };

  return (
    <div
      className={`flex gap-3 h-full w-full items-center p-2 rounded-lg border transition-all duration-300 hover:shadow-md ${
        enabled
          ? "border-blue-300 bg-blue-50 dark:bg-blue-900/20"
          : "border-gray-200 dark:border-gray-700 bg-gradient-to-r from-gray-50 to-gray-100 dark:from-gray-800 dark:to-gray-700"
      }`}
    >
      {/* Robot Icon with Animation */}
      <div className="flex items-center gap-2">
        <div className="relative">
          <div
            className={`flex items-center justify-center w-8 h-8 rounded-full bg-gradient-to-br ${
              enabled
                ? "from-blue-400 to-blue-600"
                : "from-gray-100 via-gray-200 to-gray-300"
            }`}
          >
            <Indicator
              inline
              processing
              color="green"
              offset={-3}
              size={14}
              withBorder
              position="top-end"
              disabled={!enabled}
            >
              <IconRobot
                size={18}
                className={
                  enabled ? "text-white" : "text-gray-400 dark:text-gray-500"
                }
              />
            </Indicator>
          </div>
        </div>

        <Text
          className={`text-xs font-medium transition-colors duration-300 whitespace-nowrap ${
            enabled ? "text-blue-800" : "text-gray-600 dark:text-gray-400"
          }`}
          size="xs"
        >
          {t("Auto Trade")}
        </Text>
      </div>

      {/* Toggle Switch */}
      <Switch
        checked={enabled}
        onChange={handleToggleChange}
        size="md"
        color="blue"
        className="transition-all duration-300"
        styles={{
          track: {
            backgroundColor: enabled ? "#2563eb" : "#9ca3af",
            border: "none",
            transition: "all 0.3s ease",
          },
          thumb: {
            backgroundColor: "white",
            border: "2px solid transparent",
            transition: "all 0.3s ease",
            boxShadow: enabled
              ? "0 2px 8px rgba(59, 130, 246, 0.3)"
              : "0 2px 4px rgba(0, 0, 0, 0.1)",
          },
        }}
      />

      {/* Position Count Input with Animation */}
      {enabled && (
        <div className="flex items-center gap-2 animate-fade-in">
          <div className="flex items-center gap-1">
            <NumberInput
              placeholder={t("Amount")}
              value={tradeAmount}
              onChange={(value) => onTradeAmountChange?.(Number(value))}
              min={1}
              step={1}
              size="xs"
              w="100%"
              styles={{
                input: {
                  fontWeight: 600,
                  textAlign: "center",
                  backgroundColor: "#eff6ff",
                  border: "1px solid #93c5fd",
                  transition: "all 0.3s ease",
                  "&:focus": {
                    borderColor: "#3b82f6",
                    boxShadow: "0 0 0 2px rgba(59, 130, 246, 0.1)",
                  },
                },
              }}
              leftSection={getCurrencySymbol(balance?.currency)}
            />
          </div>
        </div>
      )}
    </div>
  );
}
