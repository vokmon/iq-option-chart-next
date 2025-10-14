"use client";

import { Text, Table, Stack, Badge, ThemeIcon } from "@mantine/core";
import { Balance, Position } from "@quadcode-tech/client-sdk-js";
import { GroupedPositions } from "./type/groupPositionType";
import { useDigitalOptionsStore } from "@/stores/digitalOptionsStore";
import { formatAmount } from "@/utils/currency";
import { useTranslations } from "next-intl";
import { IconChartBar } from "@tabler/icons-react";
import Image from "next/image";
import { useMemo } from "react";

interface AssetSummaryTableProps {
  groupedPositions: GroupedPositions;
  balance: Balance | null;
}

export default function AssetSummaryTable({
  groupedPositions,
  balance,
}: AssetSummaryTableProps) {
  const t = useTranslations();
  const { activeInformation } = useDigitalOptionsStore();

  // Calculate summary for each active
  const assetSummaries = useMemo(() => {
    return Object.entries(groupedPositions)
      .map(([activeId, positions]) => {
        const totalPnL = positions.reduce(
          (sum: number, pos: Position) => sum + (pos.pnl ?? 0),
          0
        );
        const winCount = positions.filter(
          (pos: Position) => (pos.pnl ?? 0) > 0
        ).length;
        const lossCount = positions.filter(
          (pos: Position) => (pos.pnl ?? 0) < 0
        ).length;
        const winRate =
          positions.length > 0 ? (winCount / positions.length) * 100 : 0;

        return {
          activeId: parseInt(activeId),
          positions,
          totalPnL,
          winCount,
          lossCount,
          winRate,
          totalTrades: positions.length,
        };
      })
      .sort((a, b) => b.totalPnL - a.totalPnL); // Sort by P&L descending (most profitable first)
  }, [groupedPositions]);

  return (
    <fieldset className="w-[800px] border border-slate-200 dark:border-slate-700 rounded-xl p-6 bg-gradient-to-br from-slate-50 via-blue-50/30 to-indigo-50/40 dark:from-slate-900/40 dark:via-blue-900/10 dark:to-indigo-900/15 shadow-sm">
      <legend className="px-4 text-lg font-semibold text-slate-700 dark:text-slate-300 flex items-center gap-2">
        <ThemeIcon size="md" radius="xl" variant="light" color="blue">
          <IconChartBar size={18} />
        </ThemeIcon>
        {t("Asset Performance")}
      </legend>
      <Stack gap="md">
        <Table>
          <Table.Thead>
            <Table.Tr>
              <Table.Th>{t("Asset")}</Table.Th>
              <Table.Th>{t("Trades")}</Table.Th>
              <Table.Th>{t("Win Rate")}</Table.Th>
              <Table.Th>{t("Profit/Loss")}</Table.Th>
            </Table.Tr>
          </Table.Thead>
          <Table.Tbody>
            {assetSummaries.map((summary) => {
              const active = activeInformation[summary.activeId];
              return (
                <Table.Tr key={summary.activeId}>
                  <Table.Td>
                    <div className="flex flex-row items-center gap-2">
                      {active && active.imageUrl && (
                        <Image
                          src={active.imageUrl}
                          alt={active.name}
                          width={25}
                          height={25}
                        />
                      )}
                      <Text fw={500}>
                        {active?.name || `Asset ${summary.activeId}`}
                      </Text>
                    </div>
                  </Table.Td>
                  <Table.Td>
                    <Badge
                      color="blue"
                      variant="light"
                      size="lg"
                      w="60px"
                      style={{ textTransform: "none" }}
                    >
                      {summary.totalTrades}
                    </Badge>
                  </Table.Td>
                  <Table.Td>
                    <Badge
                      color={summary.winRate >= 50 ? "green" : "red"}
                      variant="light"
                      size="lg"
                      w="80px"
                      style={{ textTransform: "none" }}
                    >
                      {summary.winRate.toFixed(1)}%
                    </Badge>
                  </Table.Td>
                  <Table.Td>
                    <Text c={summary.totalPnL >= 0 ? "green" : "red"} fw={500}>
                      {summary.totalPnL >= 0 ? "+" : ""}
                      {formatAmount(summary.totalPnL, balance?.currency)}
                    </Text>
                  </Table.Td>
                </Table.Tr>
              );
            })}
          </Table.Tbody>
        </Table>
      </Stack>
    </fieldset>
  );
}
