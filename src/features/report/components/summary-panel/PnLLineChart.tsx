"use client";

import { Divider, ThemeIcon } from "@mantine/core";
import { LineChart } from "@mantine/charts";
import "@mantine/charts/styles.css";
import { Balance, Position } from "@quadcode-tech/client-sdk-js";
import {
  IconChartLine,
  IconTrendingUp,
  IconBolt,
  IconTarget,
  IconAlertTriangle,
  IconChartArea,
  IconTrendingDown,
} from "@tabler/icons-react";
import { useTranslations } from "next-intl";
import { useMemo } from "react";
import { formatDateTime } from "@/utils/dateTime";
import { formatAmount } from "@/utils/currency";
import { useSettingsStore } from "@/stores/settingsStore";
import { useDailyBalanceSnapshot } from "@/hooks/useDailyBalanceSnapshot";
import { useDailyBalanceStore } from "@/stores/dailyBalanceStore";
import {
  calculateDailyLossLimit,
  calculateDailyProfitTarget,
} from "@/utils/dailySettingUtils";

interface PnLLineChartProps {
  balance: Balance | null;
  closedPositions: Position[];
}

export default function PnLLineChart({
  balance,
  closedPositions,
}: PnLLineChartProps) {
  const t = useTranslations();

  const { tradingGoals } = useSettingsStore();
  const { getStartingBalance } = useDailyBalanceStore();

  const { profitTargetPercentage, lossLimitPercentage } = tradingGoals;

  // Transform data for the chart
  const chartData = useMemo(() => {
    if (!closedPositions || closedPositions.length === 0) {
      return [];
    }

    // Sort positions by closeTime
    const sortedPositions = [...closedPositions].sort(
      (a, b) =>
        (a.closeTime ? a.closeTime.getTime() : 0) -
        (b.closeTime ? b.closeTime.getTime() : 0)
    );

    // Calculate cumulative P&L
    let cumulativePnL = 0;
    const result = sortedPositions.map((position, index) => {
      cumulativePnL += position.pnl ?? 0;
      return {
        closeTime: index + (position.closeTime?.getTime() ?? 0),
        cumulativePnL: cumulativePnL,
        pnl: position.pnl,
        profitTarget: calculateDailyProfitTarget(
          getStartingBalance(balance!.id!)?.startingAmount ?? 0,
          profitTargetPercentage
        ),
        lossLimit: -calculateDailyLossLimit(
          getStartingBalance(balance!.id!)?.startingAmount ?? 0,
          lossLimitPercentage
        ),
      };
    });

    return result;
  }, [
    closedPositions,
    getStartingBalance,
    balance,
    profitTargetPercentage,
    lossLimitPercentage,
  ]);

  return (
    <fieldset className="mx-auto w-[100%] border border-slate-200 dark:border-slate-700 rounded-xl p-6 bg-gradient-to-br from-slate-50 via-blue-50/30 to-indigo-50/40 dark:from-slate-900/40 dark:via-blue-900/10 dark:to-indigo-900/15 shadow-sm">
      <legend className="px-4 text-lg font-semibold text-slate-700 dark:text-slate-300 flex items-center gap-2">
        <ThemeIcon size="md" radius="xl" variant="light" color="blue">
          <IconChartLine size={18} />
        </ThemeIcon>
        {t("Performance Tracker")}
      </legend>

      <div className="mt-4">
        <LineChart
          h={300}
          data={chartData}
          dataKey="closeTime"
          series={[
            {
              name: "cumulativePnL",
              color: "indigo.6",
              label: t("Trading Results in"),
            },
            {
              name: "profitTarget",
              color: "green",
              label: t("Profit Target"),
            },
            {
              name: "lossLimit",
              color: "red",
              label: t("Loss Limit"),
            },
          ]}
          xAxisProps={{
            label: "",
            tickFormatter: (value) => formatDateTime(value),
          }}
          yAxisProps={{
            label: "",
            tickFormatter: (value) =>
              formatAmount(value, balance?.currency, {
                noDecimals: true,
              }),
            allowDecimals: true,
          }}
          gridAxis="xy"
          mx={"md"}
          withTooltip
          curveType="linear"
          strokeWidth={2}
          tooltipProps={{
            // eslint-disable-next-line @typescript-eslint/no-unused-vars
            content: ({ label, payload }) => {
              if (payload && payload.length > 0) {
                const data = payload[0].payload;
                return (
                  <div className="bg-white dark:bg-slate-800 p-4 rounded-xl shadow-xl border border-slate-200 dark:border-slate-600 backdrop-blur-sm">
                    {/* Header */}
                    <div className="flex items-center gap-2 mb-3">
                      <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                      <p className="font-semibold text-slate-700 dark:text-slate-300 text-base">
                        {formatDateTime(data.closeTime)}
                      </p>
                    </div>

                    {/* Performance Section */}
                    <div className="space-y-2 mb-3">
                      <div className="flex justify-between items-center">
                        <div className="flex items-center gap-1.5">
                          <IconTrendingUp
                            size={14}
                            className={`${
                              data.cumulativePnL >= 0
                                ? "text-blue-500 dark:text-blue-400"
                                : "text-orange-500 dark:text-orange-400"
                            }`}
                          />
                          <span className="text-sm text-slate-600 dark:text-slate-400">
                            Total Performance
                          </span>
                        </div>
                        <span
                          className={`font-semibold text-sm ${
                            data.cumulativePnL >= 0
                              ? "text-green-600 dark:text-green-400"
                              : "text-red-600 dark:text-red-400"
                          }`}
                        >
                          {formatAmount(data.cumulativePnL, balance?.currency)}
                        </span>
                      </div>
                      <div className="flex justify-between items-center">
                        <div className="flex items-center gap-1.5">
                          <IconBolt
                            size={14}
                            className={`${
                              data.pnl >= 0
                                ? "text-yellow-500 dark:text-yellow-400"
                                : "text-red-500 dark:text-red-400"
                            }`}
                          />
                          <span className="text-sm text-slate-600 dark:text-slate-400">
                            Trade Result
                          </span>
                        </div>
                        <span
                          className={`font-semibold text-sm ${
                            data.pnl >= 0
                              ? "text-green-600 dark:text-green-400"
                              : "text-red-600 dark:text-red-400"
                          }`}
                        >
                          {formatAmount(data.pnl, balance?.currency)}
                        </span>
                      </div>
                    </div>

                    <Divider className="my-3 border-slate-200 dark:border-slate-600" />

                    {/* Goals Section */}
                    <div className="space-y-2">
                      <div className="flex justify-between items-center">
                        <div className="flex items-center gap-1.5">
                          <IconTarget
                            size={14}
                            className="text-green-500 dark:text-green-400"
                          />
                          <span className="text-sm text-slate-600 dark:text-slate-400">
                            Profit Target
                          </span>
                        </div>
                        <span className="font-semibold text-sm text-green-600 dark:text-green-400">
                          {formatAmount(data.profitTarget, balance?.currency)}
                        </span>
                      </div>
                      <div className="flex justify-between items-center">
                        <div className="flex items-center gap-1.5">
                          <IconAlertTriangle
                            size={14}
                            className="text-red-500 dark:text-red-400"
                          />
                          <span className="text-sm text-slate-600 dark:text-slate-400">
                            Loss Limit
                          </span>
                        </div>
                        <span className="font-semibold text-sm text-red-600 dark:text-red-400">
                          {formatAmount(data.lossLimit, balance?.currency)}
                        </span>
                      </div>
                    </div>
                  </div>
                );
              }
              return null;
            },
          }}
          withDots
          withLegend
          legendProps={{
            layout: "vertical",
            verticalAlign: "bottom",
            content: ({ payload }) => {
              return (
                <div className="flex flex-row items-center gap-7 mt-3">
                  {payload?.map((item, index) => {
                    return (
                      <div
                        key={index}
                        className="flex items-center gap-2 px-3 py-1 rounded-xl text-gray-200 shadow-md"
                        style={{ backgroundColor: item.color }}
                      >
                        {item.value === "profitTarget" ? (
                          <IconTrendingUp size={16} />
                        ) : item.value === "lossLimit" ? (
                          <IconTrendingDown size={16} />
                        ) : (
                          <IconChartArea size={16} />
                        )}
                        {t(item.value as string)}
                      </div>
                    );
                  })}
                </div>
              );
            },
          }}
        />
      </div>
    </fieldset>
  );
}
