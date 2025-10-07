"use client";

import { IconX } from "@tabler/icons-react";
import { ActionIcon, Text, Group, Stack } from "@mantine/core";
import { useTranslations } from "next-intl";

interface DateSummaryProps {
  selectedDates: Date[];
  onDateRemove: (index: number) => void;
}

export default function DateSummary({
  selectedDates,
  onDateRemove,
}: DateSummaryProps) {
  const t = useTranslations();

  if (selectedDates.length === 0) return null;

  return (
    <Stack gap="xs">
      <Text size="xs" className="text-gray-800">
        {t("Selected")} {selectedDates.length}{" "}
        {selectedDates.length === 1 ? t("date") : t("dates")}:
      </Text>
      <Group gap="xs">
        {selectedDates.map((date, index) => (
          <Group
            key={index}
            gap="xs"
            style={{
              backgroundColor: "var(--mantine-color-blue-1)",
              padding: "4px 8px",
              borderRadius: "var(--mantine-radius-sm)",
              border: "1px solid var(--mantine-color-blue-3)",
            }}
          >
            <Text size="xs" className="text-gray-800">
              {date.toLocaleDateString("en-GB")}
            </Text>
            <ActionIcon
              size="xs"
              variant="subtle"
              color="blue"
              onClick={() => onDateRemove(index)}
            >
              <IconX size={10} />
            </ActionIcon>
          </Group>
        ))}
      </Group>
    </Stack>
  );
}
