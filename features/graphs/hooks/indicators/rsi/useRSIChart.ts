import { useRef, useCallback } from "react";
import {
  LineSeries,
  LineStyle,
  type ISeriesApi,
  type UTCTimestamp,
  type IChartApi,
} from "lightweight-charts";
import { Candle } from "@quadcode-tech/client-sdk-js";
import { type RSIConfig, type RSIData } from "@/types/indicators/rsi";
import { calculateRSIForCandles } from "@/utils/indicators/rsi";
import { getRSIColors } from "@/utils/indicatorColors";

export interface RSISeries {
  rsi: ISeriesApi<"Line"> | null;
}

export interface UseRSIChartProps {
  showRSI: boolean;
  rsiConfig: RSIConfig;
}

export interface UseRSIChartReturn {
  createRSISeries: (chart: IChartApi) => RSISeries;
  updateRSIData: (
    series: RSISeries,
    candles: Candle[],
    isUpdate?: boolean
  ) => void;
  clearRSIData: (series: RSISeries) => void;
  destroyRSISeries: (chart: IChartApi, series: RSISeries) => void;
  recreateRSISeries: (chart: IChartApi, series: RSISeries) => RSISeries;
}

export function useRSIChart({
  showRSI,
  rsiConfig,
}: UseRSIChartProps): UseRSIChartReturn {
  const seriesRef = useRef<RSISeries | null>(null);

  const createRSISeries = useCallback(
    (chart: IChartApi): RSISeries => {
      if (!showRSI) {
        return { rsi: null };
      }

      const colors = getRSIColors();

      const rsiSeries = chart.addSeries(LineSeries, {
        color: colors.primary,
        lineWidth: 2,
        lineStyle: LineStyle.Solid,
        lastValueVisible: true,
        priceFormat: {
          type: "price",
          precision: 2,
          minMove: 0.01,
        },
      });

      const series = {
        rsi: rsiSeries,
      };
      seriesRef.current = series;
      return series;
    },
    [showRSI]
  );

  const formatRSIDataForChart = useCallback((rsiData: RSIData[]) => {
    const rsiDataPoints = rsiData.map((d) => ({
      time: d.time as UTCTimestamp,
      value: d.rsi,
    }));

    return { rsiDataPoints };
  }, []);

  const updateRSIData = useCallback(
    (series: RSISeries, candles: Candle[], isUpdate = false) => {
      if (!showRSI || candles.length < rsiConfig.period + 1) {
        return;
      }

      const rsiData = calculateRSIForCandles(candles, rsiConfig);

      if (rsiData.length === 0) return;

      const { rsiDataPoints } = formatRSIDataForChart(rsiData);

      if (isUpdate && rsiData.length > 0) {
        // Update only the latest data point
        const latestRSI = rsiData[rsiData.length - 1];
        series.rsi?.update({
          time: latestRSI.time as UTCTimestamp,
          value: latestRSI.rsi,
        });
      } else {
        // Set all data
        series.rsi?.setData(rsiDataPoints);
      }
    },
    [showRSI, rsiConfig, , formatRSIDataForChart]
  );

  const clearRSIData = useCallback((series: RSISeries) => {
    series.rsi?.setData([]);
  }, []);

  const destroyRSISeries = useCallback(
    (chart: IChartApi, series: RSISeries) => {
      if (series.rsi) chart.removeSeries(series.rsi);
      seriesRef.current = null;
    },
    []
  );

  const recreateRSISeries = useCallback(
    (chart: IChartApi, series: RSISeries): RSISeries => {
      // Destroy existing series
      destroyRSISeries(chart, series);
      // Create new series with updated colors
      return createRSISeries(chart);
    },
    [createRSISeries, destroyRSISeries]
  );

  return {
    createRSISeries,
    updateRSIData,
    clearRSIData,
    destroyRSISeries,
    recreateRSISeries,
  };
}
