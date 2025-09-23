import { useEffect, useRef } from "react";
import {
  CandlestickSeries,
  createChart,
  type UTCTimestamp,
} from "lightweight-charts";
import { useSdk } from "../hooks/useSdk";
import { Candle } from "@quadcode-tech/client-sdk-js";

interface ChartProps {
  activeId: number;
  candleSize: number;
  chartHeight?: number;
  chartMinutesBack?: number;
}

export function Chart({
  activeId,
  candleSize,
  chartHeight = 400,
  chartMinutesBack = 60,
}: ChartProps) {
  const sdk = useSdk();
  const containerRef = useRef<HTMLDivElement>(null);
  const earliestLoadedRef = useRef<number | null>(null);
  const fetchingRef = useRef<boolean>(false);

  useEffect(() => {
    if (!sdk || !containerRef.current) return;

    const chart = createChart(containerRef.current, {
      layout: { textColor: "black" },
      height: chartHeight,
      timeScale: {
        timeVisible: true,
        secondsVisible: false,
        barSpacing: 100, // Increase bar spacing to make candles larger
        minBarSpacing: 64, // Minimum bar spacing
        tickMarkFormatter: (time: number) => {
          const date = new Date(time * 1000);
          return date.toLocaleTimeString("en-US", {
            hour: "2-digit",
            minute: "2-digit",
            hour12: false,
          });
        },
      },
      rightPriceScale: {
        visible: true,
        borderVisible: false,
      },
    });

    const series = chart.addSeries(CandlestickSeries, {
      priceFormat: {
        type: "price",
        precision: 3,
        minMove: 0.001,
      },
    });

    const initChart = async () => {
      const chartLayer = await sdk.realTimeChartDataLayer(activeId, candleSize);
      const from = Math.floor(Date.now() / 1000) - chartMinutesBack * 60;
      const candles = await chartLayer.fetchAllCandles(from);

      const format = (cs: Candle[]) =>
        cs.map((c) => ({
          time: c.from as UTCTimestamp,
          open: c.open,
          high: c.max,
          low: c.min,
          close: c.close,
        }));

      series.setData(format(candles));

      if (candles.length > 0) {
        earliestLoadedRef.current = candles[0].from as number;
      }

      chartLayer.subscribeOnLastCandleChanged((candle) => {
        series.update({
          time: candle.from as UTCTimestamp,
          open: candle.open,
          high: candle.max,
          low: candle.min,
          close: candle.close,
        });
      });

      chartLayer.subscribeOnConsistencyRecovered(() => {
        const all = chartLayer.getAllCandles();
        series.setData(format(all));
      });

      chart.timeScale().subscribeVisibleTimeRangeChange((range) => {
        if (!range || !earliestLoadedRef.current || fetchingRef.current) return;

        if ((range.from as number) <= earliestLoadedRef.current) {
          fetchingRef.current = true;
          const fetchFrom = earliestLoadedRef.current - chartMinutesBack * 60;

          chartLayer
            .fetchAllCandles(fetchFrom)
            .then((moreData) => {
              const formatted = format(moreData);

              series.setData(formatted); // можно заменить на merge если нужно
              if (formatted.length > 0) {
                earliestLoadedRef.current = formatted[0].time;
              }
            })
            .finally(() => {
              fetchingRef.current = false;
            });
        }
      });
    };

    initChart().then();

    return () => {
      chart.remove();
    };
  }, [sdk, containerRef, activeId, candleSize, chartHeight, chartMinutesBack]);

  return (
    <div
      ref={containerRef}
      style={{ marginTop: "20px", width: "100%", height: chartHeight }}
    />
  );
}
