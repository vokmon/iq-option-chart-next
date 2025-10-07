"use client";

import { ThemeIcon } from "@mantine/core";
import { Balance, Position } from "@quadcode-tech/client-sdk-js";
import { IconChartLine } from "@tabler/icons-react";
import { useTranslations } from "next-intl";

interface PnLLineChartProps {
  balance: Balance | null;
  closedPositions: Position[];
}

export default function PnLLineChart({
  balance,
  closedPositions,
}: PnLLineChartProps) {
  const t = useTranslations();
  return (
    <fieldset className="mx-auto w-[100%] border border-slate-200 dark:border-slate-700 rounded-xl p-6 bg-gradient-to-br from-slate-50 via-blue-50/30 to-indigo-50/40 dark:from-slate-900/40 dark:via-blue-900/10 dark:to-indigo-900/15 shadow-sm">
      <legend className="px-4 text-lg font-semibold text-slate-700 dark:text-slate-300 flex items-center gap-2">
        <ThemeIcon size="md" radius="xl" variant="light" color="blue">
          <IconChartLine size={18} />
        </ThemeIcon>
        {t("P&L Progression")}
      </legend>

      {balance?.id}
      {closedPositions.length}
    </fieldset>
  );
}
