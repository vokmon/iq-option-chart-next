import { useRef, useCallback } from "react";
import {
  LineSeries,
  LineStyle,
  type ISeriesApi,
  type UTCTimestamp,
  type IChartApi,
} from "lightweight-charts";
import { Position } from "@quadcode-tech/client-sdk-js";
import { getPositionColor } from "@/utils/positionColors";
import { formatAmount } from "@/utils/currency";
import { useOrderReferenceLines } from "./useOrderReferenceLines";
import { formatSecondsToMMSS, formatTime } from "@/utils/dateTime";
import { useSdk } from "@/hooks/useSdk";

export interface PositionReferenceLine {
  series: ISeriesApi<"Line"> | null;
  position: Position;
}

export interface UsePositionReferenceLinesProps {
  activeId: number;
}

export interface UsePositionReferenceLinesReturn {
  createPositionReferenceLines: (chart: IChartApi) => PositionReferenceLine[];
  updatePositionReferenceLines: (
    referenceLines: PositionReferenceLine[],
    chart: IChartApi
  ) => void;
  destroyPositionReferenceLines: (
    chart: IChartApi,
    referenceLines: PositionReferenceLine[]
  ) => void;
  recreatePositionReferenceLines: (
    chart: IChartApi,
    referenceLines: PositionReferenceLine[]
  ) => PositionReferenceLine[];
}

export function usePositionReferenceLines({
  activeId,
}: UsePositionReferenceLinesProps): UsePositionReferenceLinesReturn {
  const positions = useOrderReferenceLines({
    activeId,
  });
  const { sdk } = useSdk();
  const referenceLinesRef = useRef<PositionReferenceLine[]>([]);
  const lastPositionsRef = useRef<Position[]>([]);

  const getPositionTitle = useCallback(
    (position: Position) => {
      const direction = position.direction?.toUpperCase() || "UNKNOWN";
      const directionEmoji =
        direction === "CALL" ? "⬆️" : direction === "PUT" ? "⬇️" : "";
      const pnlIcon =
        (position?.pnl || 0) > 0
          ? `🟢`
          : (position?.pnl || 0) < 0
          ? `🔴`
          : `⚪`;

      const pnl = formatAmount(position.pnl || 0);

      const remainingTime = formatSecondsToMMSS(
        Math.round(
          (position.expirationTime!.getTime() - sdk.currentTime().getTime()) /
            1000
        )
      );

      return `${direction} ${directionEmoji} (${position.openQuote}) ${pnlIcon} ${pnl} ${remainingTime}`;
    },
    [sdk]
  );

  const createPositionReferenceLines = useCallback(
    (chart: IChartApi): PositionReferenceLine[] => {
      // Check if positions have actually changed
      const positionsChanged =
        positions.length !== lastPositionsRef.current.length ||
        positions.some((pos, index) => {
          const lastPos = lastPositionsRef.current[index];
          return (
            !lastPos ||
            pos.openQuote !== lastPos.openQuote ||
            pos.expirationTime?.getTime() !==
              lastPos.expirationTime?.getTime() ||
            pos.direction !== lastPos.direction
          );
        });

      if (!positionsChanged && referenceLinesRef.current.length > 0) {
        return referenceLinesRef.current;
      }

      // Clear existing reference lines
      referenceLinesRef.current.forEach((refLine) => {
        if (refLine.series) {
          try {
            chart.removeSeries(refLine.series);
          } catch (error) {
            // Series might already be removed or invalid, ignore the error
            console.warn("Error removing series:", error);
          }
        }
      });

      // Clear the ref to prevent stale references
      referenceLinesRef.current = [];

      const newReferenceLines: PositionReferenceLine[] = [];

      positions.forEach((position) => {
        if (position.status?.toLowerCase().includes("closed")) {
          return;
        }
        if (!position.openQuote || !position.expirationTime) {
          return;
        }

        const color = getPositionColor(position.direction);
        const title = getPositionTitle(position);

        // Create horizontal line at openQuote level
        const series = chart.addSeries(LineSeries, {
          color,
          lineWidth: 4,
          lineStyle: LineStyle.Solid,
          title,
          lastValueVisible: false,
          priceFormat: {
            type: "price",
            precision: 6,
            minMove: 0.000001,
          },
        });

        // Create horizontal line at openQuote level from current time to expiration time
        const currentTime = Math.floor(Date.now() / 1000) as UTCTimestamp;
        const expirationTime = Math.floor(
          position.expirationTime.getTime() / 1000
        ) as UTCTimestamp;

        // Ensure we have different timestamps and proper ordering
        const startTime = currentTime;
        const endTime = Math.max(
          expirationTime,
          currentTime + 1
        ) as UTCTimestamp; // Ensure at least 1 second difference

        series.setData([
          {
            time: startTime,
            value: position.openQuote,
          },
          {
            time: endTime,
            value: position.openQuote,
          },
        ]);

        newReferenceLines.push({
          series,
          position,
        });
      });

      referenceLinesRef.current = newReferenceLines;
      lastPositionsRef.current = [...positions];
      return newReferenceLines;
    },
    [positions, getPositionTitle]
  );

  const updatePositionReferenceLines = useCallback(
    (referenceLines: PositionReferenceLine[], chart: IChartApi) => {
      // For now, just recreate all lines since positions don't change frequently
      // In a more optimized version, we could track changes and update only what's needed
      createPositionReferenceLines(chart);
    },
    [createPositionReferenceLines]
  );

  const destroyPositionReferenceLines = useCallback(
    (chart: IChartApi, referenceLines: PositionReferenceLine[]) => {
      referenceLines.forEach((refLine) => {
        if (refLine.series) {
          try {
            chart.removeSeries(refLine.series);
          } catch (error) {
            // Series might already be removed or invalid, ignore the error
            console.warn("Error removing series:", error);
          }
        }
      });
      referenceLinesRef.current = [];
    },
    []
  );

  const recreatePositionReferenceLines = useCallback(
    (
      chart: IChartApi,
      referenceLines: PositionReferenceLine[]
    ): PositionReferenceLine[] => {
      // Destroy existing series
      destroyPositionReferenceLines(chart, referenceLines);
      // Create new series with updated colors
      return createPositionReferenceLines(chart);
    },
    [createPositionReferenceLines, destroyPositionReferenceLines]
  );

  return {
    createPositionReferenceLines,
    updatePositionReferenceLines,
    destroyPositionReferenceLines,
    recreatePositionReferenceLines,
  };
}
