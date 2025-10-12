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
  type SupportResistanceConfig,
  type SupportResistanceData,
} from "@/types/indicators/supportResistance";
import { calculateSupportResistanceForCandles } from "@/utils/indicators/supportResistance";
import { getSupportResistanceColors } from "@/utils/indicatorColors";

export interface SupportResistanceSeries {
  resistance: ISeriesApi<"Line"> | null;
  support: ISeriesApi<"Line"> | null;
}

export interface UseSupportResistanceChartProps {
  showSupportResistance: boolean;
  supportResistanceConfig: SupportResistanceConfig;
}

export interface UseSupportResistanceChartReturn {
  createSupportResistanceSeries: (chart: IChartApi) => SupportResistanceSeries;
  updateSupportResistanceData: (
    series: SupportResistanceSeries,
    candles: Candle[],
    isUpdate?: boolean
  ) => void;
  clearSupportResistanceData: (series: SupportResistanceSeries) => void;
  destroySupportResistanceSeries: (
    chart: IChartApi,
    series: SupportResistanceSeries
  ) => void;
  recreateSupportResistanceSeries: (
    chart: IChartApi,
    series: SupportResistanceSeries
  ) => SupportResistanceSeries;
}

export function useSupportResistanceChart({
  showSupportResistance,
  supportResistanceConfig,
}: UseSupportResistanceChartProps): UseSupportResistanceChartReturn {
  const seriesRef = useRef<SupportResistanceSeries>({
    resistance: null,
    support: null,
  });

  const createSupportResistanceSeries = useCallback(
    (chart: IChartApi): SupportResistanceSeries => {
      if (!showSupportResistance) {
        return { resistance: null, support: null };
      }

      const colors = getSupportResistanceColors();

      const resistanceSeries = chart.addSeries(LineSeries, {
        color: colors.resistance,
        lineWidth: 2,
        lineStyle: LineStyle.Solid,
        lastValueVisible: false,
        priceFormat: {
          type: "price",
          precision: 3,
          minMove: 0.00001,
        },
      });

      const supportSeries = chart.addSeries(LineSeries, {
        color: colors.support,
        lineWidth: 2,
        lineStyle: LineStyle.Solid,
        lastValueVisible: false,
        priceFormat: {
          type: "price",
          precision: 3,
          minMove: 0.00001,
        },
      });

      const series = {
        resistance: resistanceSeries,
        support: supportSeries,
      };
      seriesRef.current = series;
      return series;
    },
    [showSupportResistance]
  );

  const formatSRDataForChart = useCallback(
    (srData: SupportResistanceData[]) => {
      const resistanceData = srData
        .filter((d) => d.resistance !== null)
        .map((d) => ({
          time: d.time as UTCTimestamp,
          value: d.resistance!,
        }));

      const supportData = srData
        .filter((d) => d.support !== null)
        .map((d) => ({
          time: d.time as UTCTimestamp,
          value: d.support!,
        }));

      return { resistanceData, supportData };
    },
    []
  );

  const updateSupportResistanceData = useCallback(
    (series: SupportResistanceSeries, candles: Candle[], isUpdate = false) => {
      if (
        !showSupportResistance ||
        candles.length < supportResistanceConfig.boxPeriod
      ) {
        return;
      }

      const srData = calculateSupportResistanceForCandles(
        candles,
        supportResistanceConfig
      );

      if (srData.length === 0) return;

      const { resistanceData, supportData } = formatSRDataForChart(srData);

      if (isUpdate && srData.length > 0) {
        // Update only the latest data point
        const latestSR = srData[srData.length - 1];
        if (latestSR.resistance !== null) {
          series.resistance?.update({
            time: latestSR.time as UTCTimestamp,
            value: latestSR.resistance,
          });
        }

        if (latestSR.support !== null) {
          series.support?.update({
            time: latestSR.time as UTCTimestamp,
            value: latestSR.support,
          });
        }
      } else {
        // Set all data
        series.resistance?.setData(resistanceData);
        series.support?.setData(supportData);
      }
    },
    [showSupportResistance, supportResistanceConfig, formatSRDataForChart]
  );

  const clearSupportResistanceData = useCallback(
    (series: SupportResistanceSeries) => {
      series.resistance?.setData([]);
      series.support?.setData([]);
    },
    []
  );

  const destroySupportResistanceSeries = useCallback(
    (chart: IChartApi, series: SupportResistanceSeries) => {
      try {
        if (series.resistance) {
          chart.removeSeries(series.resistance);
        }
        if (series.support) {
          chart.removeSeries(series.support);
        }
      } catch (error) {
        console.warn("Error destroying Support & Resistance series:", error);
      }
    },
    []
  );

  const recreateSupportResistanceSeries = useCallback(
    (
      chart: IChartApi,
      series: SupportResistanceSeries
    ): SupportResistanceSeries => {
      // Destroy existing series
      destroySupportResistanceSeries(chart, series);
      // Create new series
      return createSupportResistanceSeries(chart);
    },
    [createSupportResistanceSeries, destroySupportResistanceSeries]
  );

  return {
    createSupportResistanceSeries,
    updateSupportResistanceData,
    clearSupportResistanceData,
    destroySupportResistanceSeries,
    recreateSupportResistanceSeries,
  };
}
