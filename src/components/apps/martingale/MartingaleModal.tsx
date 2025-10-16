"use client";

import {
  Modal,
  Text,
  Group,
  Paper,
  Stack,
  NumberInput,
  Box,
} from "@mantine/core";
import { useState } from "react";
import { useTranslations } from "next-intl";
import { mmCalculatorConfig } from "./config/mmCalculatorConfig";
import MartingaleTable from "./MartingaleTable";

type MartingaleModalProps = {
  opened: boolean;
  onClose: () => void;
};

export default function MartingaleModal({
  opened,
  onClose,
}: MartingaleModalProps) {
  const [orderAmount, setOrderAmount] = useState(
    mmCalculatorConfig.initOrderAmount
  );
  const t = useTranslations();

  const handleOrderAmountChange = (value: string | number) => {
    const numValue = typeof value === "string" ? parseFloat(value) || 0 : value;
    setOrderAmount(numValue);
  };

  const tableConfigs = [
    {
      title: t("Martingale_Count", { count: 2 }),
      incrementRates: mmCalculatorConfig.incrementRates.slice(0, 2),
    },
    {
      title: t("Martingale_Count", { count: 3 }),
      incrementRates: mmCalculatorConfig.incrementRates.slice(0, 3),
    },
    {
      title: t("Martingale_Count", { count: 4 }),
      incrementRates: mmCalculatorConfig.incrementRates.slice(0, 4),
    },
  ];

  return (
    <Modal
      opened={opened}
      onClose={onClose}
      title={
        <Text size="xl" fw={600} className="text-white">
          Martingale Calculator
        </Text>
      }
      size="lg"
      radius="lg"
      className="bg-gray-800 z-1000 relative"
    >
      <Box className="p-4 bg-gray-800 flex flex-col gap-4 rounded-lg">
        {/* Input Section */}
        <Paper className="p-4 rounded-md bg-gray-700">
          <Stack gap="sm">
            <Group justify="space-between" align="center">
              <Text size="sm" fw={500} className="text-white">
                {t("Order")}
              </Text>
              <NumberInput
                value={orderAmount}
                onChange={handleOrderAmountChange}
                placeholder={mmCalculatorConfig.initOrderAmount.toString()}
                size="sm"
                className="w-50"
                classNames={{
                  input: "bg-white text-black text-center",
                }}
              />
            </Group>
            <Group justify="space-between" align="center">
              <Text size="sm" className="text-white">
                {t("Percentage depends on broker")}
              </Text>
              <Text size="sm" fw={500} className="text-white">
                {mmCalculatorConfig.brokerPercentage}%
              </Text>
            </Group>
          </Stack>
        </Paper>
        {tableConfigs.map((config, index) => (
          <Paper key={index} className="p-4 rounded-md bg-gray-700">
            <MartingaleTable
              {...config}
              orderAmount={orderAmount}
              brokerPercentage={mmCalculatorConfig.brokerPercentage}
              suggestedInvesmentPercentage={
                mmCalculatorConfig.suggestedInvesmentPercentage
              }
            />
          </Paper>
        ))}
      </Box>
    </Modal>
  );
}
