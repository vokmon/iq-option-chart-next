"use client";

import { ThemeIcon } from "@mantine/core";
import { LineChart } from "@mantine/charts";
import "@mantine/charts/styles.css";
import { Balance, Position } from "@quadcode-tech/client-sdk-js";
import { GroupedPositions } from "./type/groupPositionType";

interface ChartDataPoint {
  closeTime: number;
  [key: string]: number | string;
}
import { IconChartLine } from "@tabler/icons-react";
import { useTranslations } from "next-intl";
import { useMemo } from "react";
import { formatDateTime } from "@/utils/dateTime";
import { formatAmount } from "@/utils/currency";
import { useDigitalOptionsStore } from "@/stores/digitalOptionsStore";
import Image from "next/image";

type AssetLineChartProps = {
  balance: Balance | null;
  groupedPositions: GroupedPositions;
};

export default function AssetLineChart({
  balance,
  groupedPositions,
}: AssetLineChartProps) {
  const t = useTranslations();
  const { activeInformation } = useDigitalOptionsStore();

  // Transform data for the chart
  const chartData = useMemo(() => {
    if (!groupedPositions || Object.keys(groupedPositions).length === 0) {
      return [];
    }

    // Get all unique timestamps across all assets
    const allTimestamps = new Set<number>();
    Object.values(groupedPositions).forEach((positions) => {
      positions.forEach((position: Position) => {
        if (position.closeTime) {
          allTimestamps.add(position.closeTime.getTime());
        }
      });
    });

    const sortedTimestamps = Array.from(allTimestamps).sort((a, b) => a - b);

    // Create data points for each timestamp
    return sortedTimestamps.map((timestamp, index) => {
      const dataPoint: ChartDataPoint = {
        closeTime: index + timestamp,
      } as ChartDataPoint;

      // Calculate cumulative P&L for each asset at this timestamp
      Object.entries(groupedPositions).forEach(([activeId, positions]) => {
        const assetPositions = positions
          .filter(
            (pos: Position) =>
              pos.closeTime && pos.closeTime.getTime() <= timestamp
          )
          .sort(
            (a: Position, b: Position) =>
              (a.closeTime?.getTime() || 0) - (b.closeTime?.getTime() || 0)
          );

        const cumulativePnL = assetPositions.reduce(
          (sum: number, pos: Position) => sum + (pos.pnl ?? 0),
          0
        );
        const assetName =
          activeInformation[parseInt(activeId)]?.name || `Asset ${activeId}`;
        dataPoint[`asset_${activeId}`] = cumulativePnL;
        dataPoint[`asset_${activeId}_name`] = assetName;
      });

      return dataPoint;
    });
  }, [groupedPositions, activeInformation]);

  // Create series for each asset
  const series = useMemo(() => {
    return Object.keys(groupedPositions).map((activeId) => {
      const asset = activeInformation[parseInt(activeId)];
      const assetName = asset?.name || `Asset ${activeId}`;

      return {
        name: `asset_${activeId}`,
        color: `hsl(${(parseInt(activeId) * 137.5) % 360}, 70%, 50%)`, // Generate unique colors
        label: assetName,
      };
    });
  }, [groupedPositions, activeInformation]);

  return (
    <fieldset className="mx-auto w-[100%] border border-slate-200 dark:border-slate-700 rounded-xl p-6 bg-gradient-to-br from-slate-50 via-blue-50/30 to-indigo-50/40 dark:from-slate-900/40 dark:via-blue-900/10 dark:to-indigo-900/15 shadow-sm">
      <legend className="px-4 text-lg font-semibold text-slate-700 dark:text-slate-300 flex items-center gap-2">
        <ThemeIcon size="md" radius="xl" variant="light" color="blue">
          <IconChartLine size={18} />
        </ThemeIcon>
        {t("Asset Performance Chart")}
      </legend>

      <div className="mt-4">
        <LineChart
          h={300}
          data={chartData}
          dataKey="closeTime"
          series={series}
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
            content: ({ payload }) => {
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

                    {/* Asset Performance Section */}
                    <div className="space-y-2 mb-3">
                      {Object.keys(groupedPositions).map((activeId) => {
                        const asset = activeInformation[parseInt(activeId)];
                        const assetName = asset?.name || `Asset ${activeId}`;
                        const cumulativePnL = data[`asset_${activeId}`] || 0;

                        return (
                          <div
                            key={activeId}
                            className="flex justify-between items-center"
                          >
                            <div className="flex items-center gap-1.5">
                              <Image
                                src={asset?.imageUrl}
                                alt={assetName}
                                width={20}
                                height={20}
                              />
                              {assetName}
                            </div>
                            <span
                              className={`font-semibold text-sm ${
                                cumulativePnL >= 0
                                  ? "text-green-600 dark:text-green-400"
                                  : "text-red-600 dark:text-red-400"
                              }`}
                            >
                              {formatAmount(cumulativePnL, balance?.currency)}
                            </span>
                          </div>
                        );
                      })}
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
                <div className="flex flex-row items-center gap-7 mt-3 flex-wrap">
                  {payload?.map((item, index) => {
                    const asset =
                      activeInformation[
                        parseInt(
                          (item.dataKey as string)?.replace("asset_", "") || ""
                        )
                      ];
                    const assetName = asset?.name || `Asset ${item.dataKey}`;
                    return (
                      <div
                        key={index}
                        className="text-sm flex items-center gap-2 px-4 py-1 rounded-xl text-gray-200 shadow-md"
                        style={{ backgroundColor: item.color }}
                      >
                        <Image
                          src={asset?.imageUrl}
                          alt={assetName}
                          width={20}
                          height={20}
                        />
                        {assetName}
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
