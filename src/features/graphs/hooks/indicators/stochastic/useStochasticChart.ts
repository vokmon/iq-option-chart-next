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
  type StochasticConfig,
  type StochasticData,
} from "@/types/indicators/stochastic";
import { calculateStochasticForCandles } from "@/utils/indicators/stochastic";
import { getStochasticColors } from "@/utils/indicatorColors";

export interface StochasticSeries {
  k: ISeriesApi<"Line"> | null;
  d: ISeriesApi<"Line"> | null;
  upper: ISeriesApi<"Line"> | null;
  lower: ISeriesApi<"Line"> | null;
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
  recreateStochasticSeries: (
    chart: IChartApi,
    series: StochasticSeries
  ) => StochasticSeries;
}

export function useStochasticChart({
  showStochastic,
  stochasticConfig,
}: UseStochasticChartProps): UseStochasticChartReturn {
  const seriesRef = useRef<StochasticSeries | null>(null);

  const createStochasticSeries = useCallback(
    (chart: IChartApi): StochasticSeries => {
      if (!showStochastic) {
        return { k: null, d: null, upper: null, lower: null };
      }

      const colors = getStochasticColors();

      const kSeries = chart.addSeries(LineSeries, {
        color: colors.k,
        lineWidth: 3,
        lineStyle: LineStyle.Solid,
        // title: "Stochastic %K",
        priceFormat: {
          type: "price",
          precision: 1,
          minMove: 0.1,
        },
      });

      const dSeries = chart.addSeries(LineSeries, {
        color: colors.d,
        lineWidth: 3,
        lineStyle: LineStyle.Solid,
        // title: "Stochastic %D",
        priceFormat: {
          type: "price",
          precision: 1,
          minMove: 0.1,
        },
      });

      const upperSeries = chart.addSeries(LineSeries, {
        color: colors.upper,
        lineWidth: 1,
        lineStyle: LineStyle.Solid,
        // title: "Overbought (80)",
        lastValueVisible: false,
        priceFormat: {
          type: "price",
          precision: 1,
          minMove: 0.1,
        },
      });

      const lowerSeries = chart.addSeries(LineSeries, {
        color: colors.lower,
        lineWidth: 1,
        lineStyle: LineStyle.Solid,
        // title: "Oversold (20)",
        lastValueVisible: false,
        priceFormat: {
          type: "price",
          precision: 1,
          minMove: 0.1,
        },
      });

      const series = {
        k: kSeries,
        d: dSeries,
        upper: upperSeries,
        lower: lowerSeries,
      };
      seriesRef.current = series;
      return series;
    },
    [showStochastic]
  );

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
        candles,
        stochasticConfig
      );

      if (stochasticData.length === 0) return;

      const { kData, dData } = formatStochasticDataForChart(stochasticData);

      // Create threshold lines data (constant values at 80 and 20)
      const upperData = stochasticData.map((d) => ({
        time: d.time as UTCTimestamp,
        value: 80,
      }));
      const lowerData = stochasticData.map((d) => ({
        time: d.time as UTCTimestamp,
        value: 20,
      }));

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
        series.upper?.update({
          time: latestStochastic.time as UTCTimestamp,
          value: 80,
        });
        series.lower?.update({
          time: latestStochastic.time as UTCTimestamp,
          value: 20,
        });
      } else {
        // Set all data
        series.k?.setData(kData);
        series.d?.setData(dData);
        series.upper?.setData(upperData);
        series.lower?.setData(lowerData);
      }
    },
    [showStochastic, stochasticConfig, formatStochasticDataForChart]
  );

  const clearStochasticData = useCallback((series: StochasticSeries) => {
    series.k?.setData([]);
    series.d?.setData([]);
    series.upper?.setData([]);
    series.lower?.setData([]);
  }, []);

  const destroyStochasticSeries = useCallback(
    (chart: IChartApi, series: StochasticSeries) => {
      if (series.k) chart.removeSeries(series.k);
      if (series.d) chart.removeSeries(series.d);
      if (series.upper) chart.removeSeries(series.upper);
      if (series.lower) chart.removeSeries(series.lower);
      seriesRef.current = null;
    },
    []
  );

  const recreateStochasticSeries = useCallback(
    (chart: IChartApi, series: StochasticSeries): StochasticSeries => {
      // Destroy existing series
      destroyStochasticSeries(chart, series);
      // Create new series with updated colors
      return createStochasticSeries(chart);
    },
    [createStochasticSeries, destroyStochasticSeries]
  );

  return {
    createStochasticSeries,
    updateStochasticData,
    clearStochasticData,
    destroyStochasticSeries,
    recreateStochasticSeries,
  };
}
