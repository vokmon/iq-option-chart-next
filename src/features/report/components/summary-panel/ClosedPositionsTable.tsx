"use client";

import { useState } from "react";
import {
  Text,
  Table,
  Pagination,
  Stack,
  Group,
  Badge,
  ThemeIcon,
} from "@mantine/core";
import { Balance, Position } from "@quadcode-tech/client-sdk-js";
import { formatDateTime } from "@/utils/dateTime";
import { formatAmount } from "@/utils/currency";
import { useDigitalOptionsStore } from "@/stores/digitalOptionsStore";
import Image from "next/image";
import { useTranslations } from "next-intl";
import { IconTable } from "@tabler/icons-react";

const itemsPerPage = 10;

interface ClosedPositionsTableProps {
  balance: Balance | null;
  closedPositions: Position[];
}

export default function ClosedPositionsTable({
  balance,
  closedPositions,
}: ClosedPositionsTableProps) {
  const t = useTranslations();
  const { activeInformation } = useDigitalOptionsStore();
  const [activePage, setActivePage] = useState(1);
  const totalPages = Math.ceil(closedPositions.length / itemsPerPage);
  const startIndex = (activePage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentPageData = closedPositions.slice(startIndex, endIndex);

  return (
    <fieldset className="mx-auto w-full border border-slate-200 dark:border-slate-700 rounded-xl p-6 bg-gradient-to-br from-slate-50 via-blue-50/30 to-indigo-50/40 dark:from-slate-900/40 dark:via-blue-900/10 dark:to-indigo-900/15 shadow-sm">
      <legend className="px-4 text-lg font-semibold text-slate-700 dark:text-slate-300 flex items-center gap-2">
        <ThemeIcon size="md" radius="xl" variant="light" color="blue">
          <IconTable size={18} />
        </ThemeIcon>
        {t("Order History")}
      </legend>
      <Stack gap="md">
        <Table>
          <Table.Thead>
            <Table.Tr>
              <Table.Th>{t("Open Time")}</Table.Th>
              <Table.Th>{t("Closed Time")}</Table.Th>
              <Table.Th>{t("Asset")}</Table.Th>
              <Table.Th>{t("Direction")}</Table.Th>
              <Table.Th>{t("Invest")}</Table.Th>
              <Table.Th>{t("Profit/Loss")}</Table.Th>
              <Table.Th>{t("Status")}</Table.Th>
            </Table.Tr>
          </Table.Thead>
          <Table.Tbody>
            {currentPageData.map((position, index) => {
              const activeInfo = activeInformation[position.activeId as number];
              return (
                <Table.Tr key={index}>
                  <Table.Td>
                    {formatDateTime(position?.openTime?.getTime() || 0)}
                  </Table.Td>
                  <Table.Td>
                    {formatDateTime(position?.closeTime?.getTime() || 0)}
                  </Table.Td>
                  <Table.Td>
                    <div className="flex flex-row items-center gap-2">
                      <Image
                        src={activeInfo.imageUrl}
                        alt={activeInfo.name}
                        width={25}
                        height={25}
                      />
                      {activeInfo.name}
                    </div>
                  </Table.Td>
                  <Table.Td>
                    <Badge
                      color={position.direction === "call" ? "green" : "red"}
                      variant="light"
                      size="lg"
                      w="80px"
                      style={{ textTransform: "none" }}
                    >
                      <div className="flex flex-row justify-start items-center gap-2">
                        {position.direction?.toUpperCase()}
                      </div>
                    </Badge>
                  </Table.Td>
                  <Table.Td>
                    {formatAmount(position.invest || 0, balance?.currency)}
                  </Table.Td>
                  <Table.Td>
                    <Text c={position.pnl! >= 0 ? "green" : "red"} fw={500}>
                      {position.pnl! >= 0 ? "+" : ""}
                      {formatAmount(position.pnl || 0, balance?.currency)}
                    </Text>
                  </Table.Td>
                  <Table.Td>
                    <Badge
                      size="lg"
                      color={
                        position.pnl === 0
                          ? "gray"
                          : (position.pnl ?? 0) > 0
                          ? "green"
                          : "red"
                      }
                      w="80px"
                      variant="light"
                      style={{ textTransform: "none" }}
                    >
                      <div className="flex flex-row justify-start items-center gap-1">
                        {(position?.pnl ?? 0) > 0
                          ? t("Win")
                          : (position?.pnl ?? 0) < 0
                          ? t("Loss")
                          : t("Even")}
                      </div>
                    </Badge>
                  </Table.Td>
                </Table.Tr>
              );
            })}
          </Table.Tbody>
        </Table>

        {totalPages > 1 && (
          <Group justify="center">
            <Pagination
              value={activePage}
              onChange={setActivePage}
              total={totalPages}
              size="sm"
            />
          </Group>
        )}
      </Stack>
    </fieldset>
  );
}
