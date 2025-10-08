"use client";

import { ThemeIcon } from "@mantine/core";
import { DonutChart } from "@mantine/charts";
import "@mantine/charts/styles.css";
import { useTranslations } from "next-intl";
import { useMemo } from "react";
import { formatAmount } from "@/utils/currency";
import { useDigitalOptionsStore } from "@/stores/digitalOptionsStore";
import { GroupedPositions } from "./type/groupPositionType";
import { Balance, Position } from "@quadcode-tech/client-sdk-js";
import Image from "next/image";

type AssetDonutChartProps = {
  balance: Balance | null;
  groupedPositions: GroupedPositions;
};

export default function AssetDonutChart({
  balance,
  groupedPositions,
}: AssetDonutChartProps) {
  const t = useTranslations();
  const { activeInformation } = useDigitalOptionsStore();

  // Calculate trade count data for each asset
  const chartData = useMemo(() => {
    return Object.entries(groupedPositions)
      .map(([activeId, positions]) => {
        const tradeCount = positions.length;
        const totalPnL = positions.reduce(
          (sum: number, pos: Position) => sum + (pos.pnl ?? 0),
          0
        );
        const asset = activeInformation[parseInt(activeId)];
        const assetName = asset?.name || `Asset ${activeId}`;

        return {
          name: assetName,
          value: tradeCount, // Use trade count for chart size
          tradeCount: tradeCount,
          pnl: totalPnL, // Keep P&L for tooltip
          color: `hsl(${(parseInt(activeId) * 137.5) % 360}, 70%, 50%)`,
          activeId: parseInt(activeId),
        };
      })
      .filter((item) => item.value > 0); // Only show assets with trades
  }, [groupedPositions, activeInformation]);

  return (
    <div className="mt-4 flex">
      <DonutChart
        h={300}
        data={chartData}
        withTooltip
        tooltipProps={{
          content: ({ payload }) => {
            if (payload && payload.length > 0) {
              const data = payload[0].payload;
              const asset = activeInformation[data.activeId];
              return (
                <div className="bg-white dark:bg-slate-800 p-4 rounded-xl shadow-xl border border-slate-200 dark:border-slate-600 backdrop-blur-sm">
                  <div className="flex items-center gap-2 mb-2">
                    <div
                      className="w-3 h-3 rounded-full"
                      style={{ backgroundColor: data.color }}
                    ></div>
                    <Image
                      src={asset?.imageUrl}
                      alt={asset?.name}
                      width={20}
                      height={20}
                    />
                    <p className="font-semibold text-slate-700 dark:text-slate-300">
                      {data.name}
                    </p>
                  </div>
                  <div className="space-y-1">
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-slate-600 dark:text-slate-400">
                        {t("Trades")}:
                      </span>
                      <span className="font-semibold text-sm text-blue-600 dark:text-blue-400">
                        {data.tradeCount}
                      </span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-slate-600 dark:text-slate-400">
                        {t("Profit/Loss")}:
                      </span>
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
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-slate-600 dark:text-slate-400">
                        {t("Percentage")}:
                      </span>
                      <span className="font-semibold text-sm text-slate-700 dark:text-slate-300">
                        {(
                          (data.value /
                            chartData.reduce(
                              (sum: number, item: { value: number }) =>
                                sum + item.value,
                              0
                            )) *
                          100
                        ).toFixed(1)}
                        %
                      </span>
                    </div>
                  </div>
                </div>
              );
            }
            return null;
          },
        }}
        size={200}
        thickness={40}
        paddingAngle={2}
        withLabels
        withLabelsLine
        labelsType="percent"
      />
      <div className="flex flex-col gap-2 justify-center w-full">
        {chartData.map((item) => {
          const asset = activeInformation[item.activeId];
          return (
            <div
              className="flex items-center gap-2 text-sm"
              key={item.activeId}
            >
              <div
                className="w-3 h-3 rounded-full"
                style={{ backgroundColor: item.color }}
              />
              <Image
                src={asset?.imageUrl}
                alt={asset?.name}
                width={20}
                height={20}
              />
              {asset?.name}
            </div>
          );
        })}
      </div>
    </div>
  );
}
