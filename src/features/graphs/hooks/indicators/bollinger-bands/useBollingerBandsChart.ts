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
  type BollingerBandsConfig,
  type BollingerBandsData,
} from "@/types/indicators/bollingerBands";
import { calculateBollingerBandsForCandles } from "@/utils/indicators/bollingerBands";
import { getBollingerColors } from "@/utils/indicatorColors";

export interface BollingerBandsSeries {
  upper: ISeriesApi<"Line"> | null;
  lower: ISeriesApi<"Line"> | null;
}

export interface UseBollingerBandsChartProps {
  showBollingerBands: boolean;
  bollingerBandsConfig: BollingerBandsConfig;
}

export interface UseBollingerBandsChartReturn {
  createBollingerBandsSeries: (chart: IChartApi) => BollingerBandsSeries;
  updateBollingerBandsData: (
    series: BollingerBandsSeries,
    candles: Candle[],
    isUpdate?: boolean
  ) => void;
  clearBollingerBandsData: (series: BollingerBandsSeries) => void;
  destroyBollingerBandsSeries: (
    chart: IChartApi,
    series: BollingerBandsSeries
  ) => void;
  recreateBollingerBandsSeries: (
    chart: IChartApi,
    series: BollingerBandsSeries
  ) => BollingerBandsSeries;
}

export function useBollingerBandsChart({
  showBollingerBands,
  bollingerBandsConfig,
}: UseBollingerBandsChartProps): UseBollingerBandsChartReturn {
  const seriesRef = useRef<BollingerBandsSeries | null>(null);

  const createBollingerBandsSeries = useCallback(
    (chart: IChartApi): BollingerBandsSeries => {
      if (!showBollingerBands) {
        return { upper: null, lower: null };
      }

      const colors = getBollingerColors();

      const upperBandSeries = chart.addSeries(LineSeries, {
        color: colors.primary,
        lineWidth: 2,
        lineStyle: LineStyle.Solid,
        // title: "BB Upper",
        lastValueVisible: false,
        priceFormat: {
          type: "price",
          precision: 3,
          minMove: 0.00001,
        },
      });

      const lowerBandSeries = chart.addSeries(LineSeries, {
        color: colors.primary,
        lineWidth: 2,
        lineStyle: LineStyle.Solid,
        // title: "BB Lower",
        lastValueVisible: false,
        priceFormat: {
          type: "price",
          precision: 3,
          minMove: 0.00001,
        },
      });

      const series = {
        upper: upperBandSeries,
        lower: lowerBandSeries,
      };
      seriesRef.current = series;
      return series;
    },
    [showBollingerBands]
  );

  const formatBBDataForChart = useCallback((bbData: BollingerBandsData[]) => {
    const upperData = bbData.map((d) => ({
      time: d.time as UTCTimestamp,
      value: d.upper,
    }));

    const lowerData = bbData.map((d) => ({
      time: d.time as UTCTimestamp,
      value: d.lower,
    }));

    return { upperData, lowerData };
  }, []);

  const updateBollingerBandsData = useCallback(
    (series: BollingerBandsSeries, candles: Candle[], isUpdate = false) => {
      if (!showBollingerBands || candles.length < bollingerBandsConfig.period) {
        return;
      }

      const bbData = calculateBollingerBandsForCandles(
        candles,
        bollingerBandsConfig
      );

      if (bbData.length === 0) return;

      const { upperData, lowerData } = formatBBDataForChart(bbData);

      if (isUpdate && bbData.length > 0) {
        // Update only the latest data point
        const latestBB = bbData[bbData.length - 1];
        series.upper?.update({
          time: latestBB.time as UTCTimestamp,
          value: latestBB.upper,
        });

        series.lower?.update({
          time: latestBB.time as UTCTimestamp,
          value: latestBB.lower,
        });
      } else {
        // Set all data
        series.upper?.setData(upperData);

        series.lower?.setData(lowerData);
      }
    },
    [showBollingerBands, bollingerBandsConfig, formatBBDataForChart]
  );

  const clearBollingerBandsData = useCallback(
    (series: BollingerBandsSeries) => {
      series.upper?.setData([]);

      series.lower?.setData([]);
    },
    []
  );

  const destroyBollingerBandsSeries = useCallback(
    (chart: IChartApi, series: BollingerBandsSeries) => {
      if (series.upper) chart.removeSeries(series.upper);

      if (series.lower) chart.removeSeries(series.lower);
      seriesRef.current = null;
    },
    []
  );

  const recreateBollingerBandsSeries = useCallback(
    (chart: IChartApi, series: BollingerBandsSeries): BollingerBandsSeries => {
      // Destroy existing series
      destroyBollingerBandsSeries(chart, series);
      // Create new series with updated colors
      return createBollingerBandsSeries(chart);
    },
    [createBollingerBandsSeries, destroyBollingerBandsSeries]
  );

  return {
    createBollingerBandsSeries,
    updateBollingerBandsData,
    clearBollingerBandsData,
    destroyBollingerBandsSeries,
    recreateBollingerBandsSeries,
  };
}
