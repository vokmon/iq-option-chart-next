"use client";

import { Center, Stack, Text } from "@mantine/core";
import { IconChartCandle } from "@tabler/icons-react";

interface SignalFirestoreEmptyStateProps {
  message?: string;
  icon?: React.ReactNode;
  className?: string;
}

export default function SignalFirestoreEmptyState({
  message = "No signals available",
  icon,
  className = "h-full bg-gray-100",
}: SignalFirestoreEmptyStateProps) {
  return (
    <Center className={className}>
      <Stack align="center" gap="md">
        {icon || <IconChartCandle size={48} className="text-gray-400" />}
        <Text size="sm" c="dimmed" ta="center">
          {message}
        </Text>
      </Stack>
    </Center>
  );
}
