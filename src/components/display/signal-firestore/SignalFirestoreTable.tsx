"use client";

import { Table, Text, Group, Stack, Badge, Indicator } from "@mantine/core";
import {
  IconTrendingUp,
  IconTrendingDown,
  IconBell,
} from "@tabler/icons-react";
import { TradingSignal } from "@/types/signal/FireStoreSignal";
import { formatDateTime } from "@/utils/dateTime";

interface SignalFirestoreTableProps {
  signals: TradingSignal[];
}

export default function SignalFirestoreTable({
  signals,
}: SignalFirestoreTableProps) {
  return (
    <Table striped stripedColor="gray.1" bg="gray.2">
      <Table.Tbody>
        {signals.map((signal) => {
          const minutes = signal.timeframe === "oneMinute" ? 1 : 5;
          const isNew =
            new Date().getTime() - signal.timestamp.getTime() <
            1000 * 60 * minutes;
          return (
            <Table.Tr key={signal.id}>
              <Table.Td pr={1}>
                {isNew ? (
                  <Indicator
                    color="orange.5"
                    size={8}
                    position="top-start"
                    offset={2}
                    processing
                    ml={4}
                  >
                    <IconBell
                      size={24}
                      className="text-orange-500 animate-pulse"
                    />
                  </Indicator>
                ) : (
                  <div className="w-[26px]" />
                )}
              </Table.Td>
              <Table.Td pl={1}>
                <Stack gap={4}>
                  <Group gap="xs" wrap="nowrap" justify="space-between">
                    <Group>
                      <Text fw={600} size="sm">
                        {signal.currencyPair}
                      </Text>
                      <Text size="sm" c="dimmed">
                        |
                      </Text>
                      <Group gap={4}>
                        {getActionIcon(signal.action)}
                        <Text
                          size="sm"
                          fw={600}
                          c={getActionColor(signal.action)}
                        >
                          {signal.action}
                        </Text>
                      </Group>
                    </Group>
                  </Group>

                  <Group justify="space-between">
                    <Text size="sm" c="dimmed">
                      {formatDateTime(signal.timestamp)}
                    </Text>
                    <Badge
                      size="sm"
                      color={getZoneColor(signal.zone)}
                      variant="light"
                      w={120}
                    >
                      {signal.zone}
                    </Badge>
                  </Group>
                </Stack>
              </Table.Td>
            </Table.Tr>
          );
        })}
      </Table.Tbody>
    </Table>
  );
}

const getActionIcon = (action: "BUY" | "SELL") => {
  return action === "BUY" ? (
    <IconTrendingUp size={16} className="text-green-600" />
  ) : (
    <IconTrendingDown size={16} className="text-red-600" />
  );
};

const getActionColor = (action: "BUY" | "SELL") => {
  return action === "BUY" ? "green" : "red";
};

const getZoneColor = (zone: "Support zone" | "Resistance zone") => {
  return zone === "Support zone" ? "blue" : "orange";
};
