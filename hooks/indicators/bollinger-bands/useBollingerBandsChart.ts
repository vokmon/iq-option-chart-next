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
  calculateBollingerBandsForCandles,
  type BollingerBandsConfig,
  type BollingerBandsData,
} from "@/utils/indicators/bollingerBands";

export interface BollingerBandsSeries {
  upper: ISeriesApi<"Line"> | null;
  middle: ISeriesApi<"Line"> | null;
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
}

export function useBollingerBandsChart({
  showBollingerBands,
  bollingerBandsConfig,
}: UseBollingerBandsChartProps): UseBollingerBandsChartReturn {
  const seriesRef = useRef<BollingerBandsSeries | null>(null);

  const createBollingerBandsSeries = useCallback(
    (chart: IChartApi): BollingerBandsSeries => {
      if (!showBollingerBands) {
        return { upper: null, middle: null, lower: null };
      }

      const upperBandSeries = chart.addSeries(LineSeries, {
        color: "#42A5F5", // Light pastel blue
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

      const middleBandSeries = chart.addSeries(LineSeries, {
        color: "#90CAF9", // Medium pastel blue
        lineWidth: 2,
        lineStyle: LineStyle.Solid,
        // title: "BB Middle (SMA)",
        lastValueVisible: false,
        priceFormat: {
          type: "price",
          precision: 3,
          minMove: 0.00001,
        },
      });

      const lowerBandSeries = chart.addSeries(LineSeries, {
        color: "#42A5F5", // Light pastel blue (same as upper)
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
        middle: middleBandSeries,
        lower: lowerBandSeries,
      };
      seriesRef.current = series;
      return series;
    },
    [showBollingerBands]
  );

  const formatCandlesForBB = useCallback((cs: Candle[]) => {
    return cs.map((c) => ({
      time: c.from as number,
      close: c.close,
    }));
  }, []);

  const formatBBDataForChart = useCallback((bbData: BollingerBandsData[]) => {
    const upperData = bbData.map((d) => ({
      time: d.time as UTCTimestamp,
      value: d.upper,
    }));
    const middleData = bbData.map((d) => ({
      time: d.time as UTCTimestamp,
      value: d.middle,
    }));
    const lowerData = bbData.map((d) => ({
      time: d.time as UTCTimestamp,
      value: d.lower,
    }));

    return { upperData, middleData, lowerData };
  }, []);

  const updateBollingerBandsData = useCallback(
    (series: BollingerBandsSeries, candles: Candle[], isUpdate = false) => {
      if (!showBollingerBands || candles.length < bollingerBandsConfig.period) {
        return;
      }

      const bbData = calculateBollingerBandsForCandles(
        formatCandlesForBB(candles),
        bollingerBandsConfig
      );

      if (bbData.length === 0) return;

      const { upperData, middleData, lowerData } = formatBBDataForChart(bbData);

      if (isUpdate && bbData.length > 0) {
        // Update only the latest data point
        const latestBB = bbData[bbData.length - 1];
        series.upper?.update({
          time: latestBB.time as UTCTimestamp,
          value: latestBB.upper,
        });
        series.middle?.update({
          time: latestBB.time as UTCTimestamp,
          value: latestBB.middle,
        });
        series.lower?.update({
          time: latestBB.time as UTCTimestamp,
          value: latestBB.lower,
        });
      } else {
        // Set all data
        series.upper?.setData(upperData);
        series.middle?.setData(middleData);
        series.lower?.setData(lowerData);
      }
    },
    [
      showBollingerBands,
      bollingerBandsConfig,
      formatCandlesForBB,
      formatBBDataForChart,
    ]
  );

  const clearBollingerBandsData = useCallback(
    (series: BollingerBandsSeries) => {
      series.upper?.setData([]);
      series.middle?.setData([]);
      series.lower?.setData([]);
    },
    []
  );

  const destroyBollingerBandsSeries = useCallback(
    (chart: IChartApi, series: BollingerBandsSeries) => {
      if (series.upper) chart.removeSeries(series.upper);
      if (series.middle) chart.removeSeries(series.middle);
      if (series.lower) chart.removeSeries(series.lower);
      seriesRef.current = null;
    },
    []
  );

  return {
    createBollingerBandsSeries,
    updateBollingerBandsData,
    clearBollingerBandsData,
    destroyBollingerBandsSeries,
  };
}
