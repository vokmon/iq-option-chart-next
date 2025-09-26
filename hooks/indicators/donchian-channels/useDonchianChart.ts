import { useRef, useCallback } from "react";
import {
  LineSeries,
  AreaSeries,
  LineStyle,
  type ISeriesApi,
  type UTCTimestamp,
  type IChartApi,
} from "lightweight-charts";
import { Candle } from "@quadcode-tech/client-sdk-js";
import {
  calculateDonchianForCandles,
  type DonchianConfig,
  type DonchianData,
} from "@/utils/indicators/donchian";

export interface DonchianSeries {
  upper: ISeriesApi<"Line"> | null;
  middle: ISeriesApi<"Line"> | null;
  lower: ISeriesApi<"Line"> | null;
  area: ISeriesApi<"Area"> | null;
}

export interface UseDonchianChartProps {
  showDonchian: boolean;
  donchianConfig: DonchianConfig;
}

export interface UseDonchianChartReturn {
  createDonchianSeries: (chart: IChartApi) => DonchianSeries;
  updateDonchianData: (
    series: DonchianSeries,
    candles: Candle[],
    isUpdate?: boolean
  ) => void;
  clearDonchianData: (series: DonchianSeries) => void;
  destroyDonchianSeries: (chart: IChartApi, series: DonchianSeries) => void;
}

export function useDonchianChart({
  showDonchian,
  donchianConfig,
}: UseDonchianChartProps): UseDonchianChartReturn {
  const seriesRef = useRef<DonchianSeries | null>(null);

  const createDonchianSeries = useCallback(
    (chart: IChartApi): DonchianSeries => {
      if (!showDonchian) {
        return {
          upper: null,
          middle: null,
          lower: null,
          area: null,
        };
      }

      const upperChannelSeries = chart.addSeries(LineSeries, {
        color: "#AB47BC", // Light pastel purple
        lineWidth: 2,
        lineStyle: LineStyle.Solid,
        // title: "Donchian Upper",
        lastValueVisible: false,
        priceFormat: {
          type: "price",
          precision: 3,
          minMove: 0.00001,
        },
      });

      const middleChannelSeries = chart.addSeries(LineSeries, {
        color: "#CE93D8", // Medium pastel purple
        lineWidth: 2,
        lineStyle: LineStyle.Solid,
        // title: "Donchian Middle",
        lastValueVisible: false,
        priceFormat: {
          type: "price",
          precision: 3,
          minMove: 0.00001,
        },
      });

      const lowerChannelSeries = chart.addSeries(LineSeries, {
        color: "#AB47BC", // Light pastel purple (same as upper)
        lineWidth: 2,
        lineStyle: LineStyle.Solid,
        // title: "Donchian Lower",
        lastValueVisible: false,
        priceFormat: {
          type: "price",
          precision: 3,
          minMove: 0.00001,
        },
      });

      const areaSeries = chart.addSeries(AreaSeries, {
        topColor: "rgba(206, 147, 216, 0.3)",
        bottomColor: "rgba(206, 147, 216, 0)",
        lineColor: "transparent", // Hide the boundary lines
        priceLineVisible: false,
        lastValueVisible: false,
        visible: true, // Keep the area visible but hide labels
      });

      const series = {
        upper: upperChannelSeries,
        middle: middleChannelSeries,
        lower: lowerChannelSeries,
        area: areaSeries,
      };
      seriesRef.current = series;
      return series;
    },
    [showDonchian]
  );

  const formatCandlesForDonchian = useCallback((cs: Candle[]) => {
    return cs.map((c) => ({
      time: c.from as number,
      high: c.max,
      low: c.min,
    }));
  }, []);

  const formatDonchianDataForChart = useCallback(
    (donchianData: DonchianData[]) => {
      const upperData = donchianData.map((d) => ({
        time: d.time as UTCTimestamp,
        value: d.upper,
      }));
      const middleData = donchianData.map((d) => ({
        time: d.time as UTCTimestamp,
        value: d.middle,
      }));
      const lowerData = donchianData.map((d) => ({
        time: d.time as UTCTimestamp,
        value: d.lower,
      }));

      // Area data with both top and bottom values
      const areaData = donchianData.map((d) => ({
        time: d.time as UTCTimestamp,
        value: d.upper, // Top line (upper channel)
        bottomValue: d.lower, // Bottom line (lower channel)
      }));

      return { upperData, middleData, lowerData, areaData };
    },
    []
  );

  const updateDonchianData = useCallback(
    (series: DonchianSeries, candles: Candle[], isUpdate = false) => {
      if (!showDonchian || candles.length < donchianConfig.period) {
        return;
      }

      const donchianData = calculateDonchianForCandles(
        formatCandlesForDonchian(candles),
        donchianConfig
      );

      if (donchianData.length === 0) return;

      const { upperData, middleData, lowerData, areaData } =
        formatDonchianDataForChart(donchianData);

      if (isUpdate && donchianData.length > 0) {
        // Update only the latest data point
        const latestDonchian = donchianData[donchianData.length - 1];
        series.upper?.update({
          time: latestDonchian.time as UTCTimestamp,
          value: latestDonchian.upper,
        });
        series.middle?.update({
          time: latestDonchian.time as UTCTimestamp,
          value: latestDonchian.middle,
        });
        series.lower?.update({
          time: latestDonchian.time as UTCTimestamp,
          value: latestDonchian.lower,
        });
        series.area?.update({
          time: latestDonchian.time as UTCTimestamp,
          value: latestDonchian.upper,
          bottomValue: latestDonchian.lower,
        } as { time: UTCTimestamp; value: number; bottomValue: number });
      } else {
        // Set all data
        series.upper?.setData(upperData);
        series.middle?.setData(middleData);
        series.lower?.setData(lowerData);
        series.area?.setData(areaData);
      }
    },
    [
      showDonchian,
      donchianConfig,
      formatCandlesForDonchian,
      formatDonchianDataForChart,
    ]
  );

  const clearDonchianData = useCallback((series: DonchianSeries) => {
    series.upper?.setData([]);
    series.middle?.setData([]);
    series.lower?.setData([]);
    series.area?.setData([]);
  }, []);

  const destroyDonchianSeries = useCallback(
    (chart: IChartApi, series: DonchianSeries) => {
      if (series.upper) chart.removeSeries(series.upper);
      if (series.middle) chart.removeSeries(series.middle);
      if (series.lower) chart.removeSeries(series.lower);
      if (series.area) chart.removeSeries(series.area);
      seriesRef.current = null;
    },
    []
  );

  return {
    createDonchianSeries,
    updateDonchianData,
    clearDonchianData,
    destroyDonchianSeries,
  };
}
