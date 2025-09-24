import { useRef, useCallback } from "react";
import {
  LineSeries,
  LineStyle,
  type ISeriesApi,
  type UTCTimestamp,
  type IChartApi,
} from "lightweight-charts";
import { Candle } from "@quadcode-tech/client-sdk-js";
import {
  calculateStochasticForCandles,
  type StochasticConfig,
  type StochasticData,
} from "@/utils/stochastic";

export interface StochasticSeries {
  k: ISeriesApi<"Line"> | null;
  d: ISeriesApi<"Line"> | null;
}

export interface UseStochasticChartProps {
  showStochastic: boolean;
  stochasticConfig: StochasticConfig;
}

export interface UseStochasticChartReturn {
  createStochasticSeries: (chart: IChartApi) => StochasticSeries;
  updateStochasticData: (
    series: StochasticSeries,
    candles: Candle[],
    isUpdate?: boolean
  ) => void;
  clearStochasticData: (series: StochasticSeries) => void;
  destroyStochasticSeries: (chart: IChartApi, series: StochasticSeries) => void;
}

export function useStochasticChart({
  showStochastic,
  stochasticConfig,
}: UseStochasticChartProps): UseStochasticChartReturn {
  const seriesRef = useRef<StochasticSeries | null>(null);

  const createStochasticSeries = useCallback(
    (chart: IChartApi): StochasticSeries => {
      if (!showStochastic) {
        return { k: null, d: null };
      }

      const kSeries = chart.addSeries(LineSeries, {
        color: "#FF6B6B", // Red for %K line
        lineWidth: 2,
        lineStyle: LineStyle.Solid,
        // title: "Stochastic %K",
        priceFormat: {
          type: "price",
          precision: 2,
          minMove: 0.01,
        },
      });

      const dSeries = chart.addSeries(LineSeries, {
        color: "#4ECDC4", // Teal for %D line
        lineWidth: 2,
        lineStyle: LineStyle.Solid,
        // title: "Stochastic %D",
        priceFormat: {
          type: "price",
          precision: 2,
          minMove: 0.01,
        },
      });

      const series = {
        k: kSeries,
        d: dSeries,
      };
      seriesRef.current = series;
      return series;
    },
    [showStochastic]
  );

  const formatCandlesForStochastic = useCallback((cs: Candle[]) => {
    return cs.map((c) => ({
      time: c.from as number,
      high: c.max,
      low: c.min,
      close: c.close,
    }));
  }, []);

  const formatStochasticDataForChart = useCallback(
    (stochasticData: StochasticData[]) => {
      const kData = stochasticData.map((d) => ({
        time: d.time as UTCTimestamp,
        value: d.k,
      }));
      const dData = stochasticData.map((d) => ({
        time: d.time as UTCTimestamp,
        value: d.d,
      }));

      return { kData, dData };
    },
    []
  );

  const updateStochasticData = useCallback(
    (series: StochasticSeries, candles: Candle[], isUpdate = false) => {
      if (
        !showStochastic ||
        candles.length < stochasticConfig.kPeriod + stochasticConfig.dPeriod
      ) {
        return;
      }

      const stochasticData = calculateStochasticForCandles(
        formatCandlesForStochastic(candles),
        stochasticConfig
      );

      if (stochasticData.length === 0) return;

      const { kData, dData } = formatStochasticDataForChart(stochasticData);

      if (isUpdate && stochasticData.length > 0) {
        // Update only the latest data point
        const latestStochastic = stochasticData[stochasticData.length - 1];
        series.k?.update({
          time: latestStochastic.time as UTCTimestamp,
          value: latestStochastic.k,
        });
        series.d?.update({
          time: latestStochastic.time as UTCTimestamp,
          value: latestStochastic.d,
        });
      } else {
        // Set all data
        series.k?.setData(kData);
        series.d?.setData(dData);
      }
    },
    [
      showStochastic,
      stochasticConfig,
      formatCandlesForStochastic,
      formatStochasticDataForChart,
    ]
  );

  const clearStochasticData = useCallback((series: StochasticSeries) => {
    series.k?.setData([]);
    series.d?.setData([]);
  }, []);

  const destroyStochasticSeries = useCallback(
    (chart: IChartApi, series: StochasticSeries) => {
      if (series.k) chart.removeSeries(series.k);
      if (series.d) chart.removeSeries(series.d);
      seriesRef.current = null;
    },
    []
  );

  return {
    createStochasticSeries,
    updateStochasticData,
    clearStochasticData,
    destroyStochasticSeries,
  };
}
