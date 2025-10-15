"use client";

import { ThemeIcon } from "@mantine/core";
import { LineChart } from "@mantine/charts";
import "@mantine/charts/styles.css";
import { Balance, Position } from "@quadcode-tech/client-sdk-js";
import { IconChartLine, IconCalendar } from "@tabler/icons-react";
import { useTranslations } from "next-intl";
import { useMemo } from "react";
import { formatAmount } from "@/utils/currency";
import { formatDate } from "@/utils/dateTime";

type PnlLineChartGroupByDayProps = {
  balance: Balance | null;
  closedPositions: Position[];
};

export default function PnlLineChartGroupByDay({
  balance,
  closedPositions,
}: PnlLineChartGroupByDayProps) {
  const t = useTranslations();

  // Helper function to format milliseconds since midnight as HH:MM:SS
  const formatTimeOfDay = (milliseconds: number): string => {
    const totalSeconds = Math.floor(milliseconds / 1000);
    const hours = Math.floor(totalSeconds / 3600);
    const minutes = Math.floor((totalSeconds % 3600) / 60);
    const seconds = totalSeconds % 60;
    return `${hours.toString().padStart(2, "0")}:${minutes
      .toString()
      .padStart(2, "0")}:${seconds.toString().padStart(2, "0")}`;
  };

  // Group positions by day and calculate cumulative P&L for each day
  const { chartData, daySeries } = useMemo(() => {
    if (!closedPositions || closedPositions.length === 0) {
      return { chartData: [], daySeries: [] };
    }

    // Sort positions by closeTime
    const sortedPositions = [...closedPositions].sort(
      (a, b) =>
        (a.closeTime ? a.closeTime.getTime() : 0) -
        (b.closeTime ? b.closeTime.getTime() : 0)
    );

    // Group positions by day
    const positionsByDay: Record<string, Position[]> = {};
    sortedPositions.forEach((position) => {
      if (position.closeTime) {
        const date = new Date(position.closeTime);
        const dayKey = `${date.getFullYear()}-${String(
          date.getMonth() + 1
        ).padStart(2, "0")}-${String(date.getDate()).padStart(2, "0")}`;
        if (!positionsByDay[dayKey]) {
          positionsByDay[dayKey] = [];
        }
        positionsByDay[dayKey].push(position);
      }
    });

    // Get sorted day keys
    const dayKeys = Object.keys(positionsByDay).sort();

    // Collect time points for each day separately and find the first/last time for each day
    const dayTimePoints: Record<string, number[]> = {};
    const firstTimeByDay: Record<string, number> = {};
    const lastTimeByDay: Record<string, number> = {};

    // First pass: collect time points for each day and find the first/last time
    dayKeys.forEach((dayKey) => {
      const positions = positionsByDay[dayKey];
      const timePoints = new Set<number>();
      let firstTime = Infinity;
      let lastTime = 0;

      positions.forEach((position) => {
        if (position.closeTime) {
          const date = new Date(position.closeTime);
          // Get time within the day (hours * 3600000 + minutes * 60000 + seconds * 1000 + ms)
          const timeOfDay =
            date.getHours() * 3600000 +
            date.getMinutes() * 60000 +
            date.getSeconds() * 1000 +
            date.getMilliseconds();
          timePoints.add(timeOfDay);
          firstTime = Math.min(firstTime, timeOfDay);
          lastTime = Math.max(lastTime, timeOfDay);
        }
      });

      dayTimePoints[dayKey] = Array.from(timePoints).sort((a, b) => a - b);
      firstTimeByDay[dayKey] = firstTime;
      lastTimeByDay[dayKey] = lastTime;
    });

    // Collect all unique time points across all days for the x-axis
    const allTimePointsSet = new Set<number>();
    Object.values(dayTimePoints).forEach((timePoints) => {
      timePoints.forEach((time) => allTimePointsSet.add(time));
    });

    // Sort all time points
    const allTimePoints = Array.from(allTimePointsSet).sort((a, b) => a - b);

    // Create data structure
    const data = allTimePoints.map((timeOfDay) => {
      const dataPoint: Record<string, number> = {
        timeOfDay: timeOfDay,
      };

      // For each day, calculate cumulative P&L up to this time point
      dayKeys.forEach((dayKey) => {
        // Only add data if this time is between the first and last trade time for this day
        if (
          timeOfDay >= firstTimeByDay[dayKey] &&
          timeOfDay <= lastTimeByDay[dayKey]
        ) {
          const positions = positionsByDay[dayKey];
          let cumulativePnL = 0;

          positions.forEach((position) => {
            if (position.closeTime) {
              const date = new Date(position.closeTime);
              const posTimeOfDay =
                date.getHours() * 3600000 +
                date.getMinutes() * 60000 +
                date.getSeconds() * 1000 +
                date.getMilliseconds();

              // Only include positions up to this time point
              if (posTimeOfDay <= timeOfDay) {
                cumulativePnL += position.pnl ?? 0;
              }
            }
          });

          // Set the value
          dataPoint[dayKey] = cumulativePnL;
        }
        // If timeOfDay is outside this day's trading range, don't set any value (undefined)
        // This will cause the line to only show during actual trading times
      });

      return dataPoint;
    });

    // Create series configuration with HSL color generation
    const series = dayKeys.map((dayKey, index) => ({
      name: dayKey,
      color: `hsl(${(index * 137.5) % 360}, 70%, 50%)`,
      label: formatDate(dayKey),
    }));

    return { chartData: data, daySeries: series };
  }, [closedPositions]);

  if (chartData.length === 0) {
    return (
      <fieldset className="mx-auto w-[100%] border border-slate-200 dark:border-slate-700 rounded-xl p-6 bg-gradient-to-br from-slate-50 via-blue-50/30 to-indigo-50/40 dark:from-slate-900/40 dark:via-blue-900/10 dark:to-indigo-900/15 shadow-sm">
        <legend className="px-4 text-lg font-semibold text-slate-700 dark:text-slate-300 flex items-center gap-2">
          <ThemeIcon size="md" radius="xl" variant="light" color="blue">
            <IconChartLine size={18} />
          </ThemeIcon>
          {t("Daily Performance Tracker")}
        </legend>
        <div className="mt-4 text-center text-slate-500 dark:text-slate-400">
          {t("No data available")}
        </div>
      </fieldset>
    );
  }

  return (
    <fieldset className="mx-auto w-[100%] border border-slate-200 dark:border-slate-700 rounded-xl p-6 bg-gradient-to-br from-slate-50 via-purple-50/30 to-pink-50/40 dark:from-slate-900/40 dark:via-purple-900/10 dark:to-pink-900/15 shadow-sm">
      <legend className="px-4 text-lg font-semibold text-slate-700 dark:text-slate-300 flex items-center gap-2">
        <ThemeIcon size="md" radius="xl" variant="light" color="violet">
          <IconCalendar size={18} />
        </ThemeIcon>
        {t("Daily Performance Tracker")}
      </legend>

      <div className="mt-4">
        <LineChart
          h={300}
          data={chartData}
          dataKey="timeOfDay"
          series={daySeries}
          xAxisProps={{
            label: "",
            tickFormatter: (value) => {
              // Convert timeOfDay (ms since midnight) to HH:MM:SS
              return formatTimeOfDay(Number(value));
            },
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
            content: ({ label, payload }) => {
              if (payload && payload.length > 0) {
                // Convert label (timeOfDay in ms) to formatted time
                const timeStr = formatTimeOfDay(Number(label));

                return (
                  <div className="bg-white dark:bg-slate-800 p-4 rounded-xl shadow-xl border border-slate-200 dark:border-slate-600 backdrop-blur-sm">
                    {/* Header */}
                    <div className="flex items-center gap-2 mb-3">
                      <div className="w-2 h-2 bg-violet-500 rounded-full"></div>
                      <p className="font-semibold text-slate-700 dark:text-slate-300 text-base">
                        {timeStr}
                      </p>
                    </div>

                    {/* Daily Performance */}
                    <div className="space-y-2">
                      {payload.map((item, index) => {
                        if (item.value !== undefined && item.name) {
                          return (
                            <div
                              key={index}
                              className="flex justify-between items-center"
                            >
                              <div className="flex items-center gap-2">
                                <div
                                  className="w-3 h-3 rounded-full"
                                  style={{ backgroundColor: item.color }}
                                ></div>
                                <span className="text-sm text-slate-600 dark:text-slate-400">
                                  {formatDate(item.name)}
                                </span>
                              </div>
                              <span
                                className={`font-semibold text-sm ml-2 ${
                                  Number(item.value) >= 0
                                    ? "text-green-600 dark:text-green-400"
                                    : "text-red-600 dark:text-red-400"
                                }`}
                              >
                                {formatAmount(
                                  Number(item.value),
                                  balance?.currency
                                )}
                              </span>
                            </div>
                          );
                        }
                        return null;
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
            // content: ({ payload }) => {
            //   return (
            //     <div className="flex flex-wrap items-center gap-3 mt-3 justify-center">
            //       {payload?.map((item, index) => {
            //         return (
            //           <div
            //             key={index}
            //             className="flex items-center gap-2 px-3 py-1 rounded-xl text-gray-200 shadow-md text-sm"
            //             style={{ backgroundColor: item.color }}
            //           >
            //             <IconCalendar size={14} />
            //             {item.value}
            //           </div>
            //         );
            //       })}
            //     </div>
            //   );
            // },
          }}
        />
      </div>
    </fieldset>
  );
}
