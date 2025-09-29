import { useRef, useCallback } from "react";
import {
  LineSeries,
  LineStyle,
  type ISeriesApi,
  type UTCTimestamp,
  type IChartApi,
} from "lightweight-charts";
import { Position } from "@quadcode-tech/client-sdk-js";
import { useTradingStore } from "@/stores/tradingStore";
import { useAssetStore } from "@/stores/assetStore";
import { getPositionColor } from "@/utils/positionColors";

export interface PositionReferenceLine {
  series: ISeriesApi<"Line"> | null;
  position: Position;
}

export interface UsePositionReferenceLinesProps {
  positions: Position[];
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
  positions,
}: UsePositionReferenceLinesProps): UsePositionReferenceLinesReturn {
  const referenceLinesRef = useRef<PositionReferenceLine[]>([]);
  const lastPositionsRef = useRef<Position[]>([]);
  const { getAllOrders } = useTradingStore();
  const { getActiveAsset } = useAssetStore();
  const activeAsset = getActiveAsset();

  const getPositionTitle = useCallback(
    (position: Position) => {
      // Check if any of the position's order IDs match user-created orders
      const userOrders = activeAsset?.id ? getAllOrders(activeAsset.id) : [];
      const userOrderIds = new Set(userOrders.map((order) => order.id));
      const isByUser =
        position.orderIds?.some((orderId) => userOrderIds.has(orderId)) ??
        false;

      const direction = position.direction?.toUpperCase() || "UNKNOWN";
      const directionEmoji =
        direction === "CALL" ? "⬆️" : direction === "PUT" ? "⬇️" : "";
      const icon = isByUser ? "👤" : "🤖";
      return `${icon} ${direction} ${directionEmoji} (${position.openQuote})`;
    },
    [getAllOrders, activeAsset?.id]
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
          lastValueVisible: true,
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

        series.setData([
          {
            time: currentTime,
            value: position.openQuote,
          },
          {
            time: expirationTime,
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
