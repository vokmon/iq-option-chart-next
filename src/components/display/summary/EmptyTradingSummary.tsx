import { Group, Text, Box } from "@mantine/core";
import { IconChartBar } from "@tabler/icons-react";
import React from "react";
import { useTranslations } from "next-intl";

export default function EmptyTradingSummary() {
  const t = useTranslations();
  return (
    <Group justify="center" align="center" h="100%" className="w-full gap-3">
      <Box
        className="flex items-center justify-center w-8 h-8 rounded-full"
        style={{
          background:
            "linear-gradient(135deg, var(--mantine-color-green-1) 0%, var(--mantine-color-green-2) 50%, var(--mantine-color-green-3) 100%)",
          boxShadow: "0 2px 8px rgba(34, 197, 94, 0.15)",
        }}
      >
        <IconChartBar
          size={18}
          style={{
            background:
              "linear-gradient(135deg, var(--mantine-color-green-6) 0%, var(--mantine-color-green-8) 100%)",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
            backgroundClip: "text",
          }}
        />
      </Box>
      <Text size="sm" c="dimmed">
        {t("No trades completed yet")}
      </Text>
    </Group>
  );
}
