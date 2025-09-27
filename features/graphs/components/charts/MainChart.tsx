import { useEffect, useRef } from "react";
import {
  CandlestickSeries,
  createChart,
  type UTCTimestamp,
} from "lightweight-charts";
import { useSdk } from "@/hooks/useSdk";
import { Candle, RealTimeChartDataLayer } from "@quadcode-tech/client-sdk-js";
import { useBollingerBandsChart } from "@/features/graphs/hooks/indicators/bollinger-bands/useBollingerBandsChart";
import { useDonchianChart } from "@/features/graphs/hooks/indicators/donchian-channels/useDonchianChart";
import { useBollingerBandsTabQuery } from "@/features/graphs/hooks/indicators/bollinger-bands/useBollingerBandsTabQuery";
import { useDonchianTabQuery } from "@/features/graphs/hooks/indicators/donchian-channels/useDonchianTabQuery";
import { useThemeChange } from "@/hooks/useThemeChange";

interface MainChartProps {
  activeId: number;
  candleSize: number;
  chartHeight?: number;
  chartMinutesBack?: number;
}

export function MainChart({
  activeId,
  candleSize,
  chartHeight = 400,
  chartMinutesBack = 60,
}: MainChartProps) {
  const { sdk } = useSdk();
  const containerRef = useRef<HTMLDivElement>(null);
  const earliestLoadedRef = useRef<number | null>(null);
  const fetchingRef = useRef<boolean>(false);

  // Query parameter hooks for indicators
  const { showBollingerBands, bollingerConfig } = useBollingerBandsTabQuery();
  const { showDonchian, donchianConfig } = useDonchianTabQuery();

  // Bollinger Bands hook
  const {
    createBollingerBandsSeries,
    updateBollingerBandsData,
    destroyBollingerBandsSeries,
    recreateBollingerBandsSeries,
  } = useBollingerBandsChart({
    showBollingerBands,
    bollingerBandsConfig: bollingerConfig,
  });

  // Donchian Channels hook
  const {
    createDonchianSeries,
    updateDonchianData,
    destroyDonchianSeries,
    recreateDonchianSeries,
  } = useDonchianChart({
    showDonchian,
    donchianConfig,
  });

  // Theme change detection
  const { onThemeChange } = useThemeChange();

  useEffect(() => {
    if (!sdk || !containerRef.current) return;

    let isDisposed = false;
    let chartLayer: RealTimeChartDataLayer;
    const unsubscribeFunctions: (() => void)[] = [];

    const chart = createChart(containerRef.current, {
      layout: {
        textColor: "black",
        attributionLogo: false,
        background: { color: "transparent" },
      },
      height: chartHeight,
      timeScale: {
        timeVisible: true,
        secondsVisible: false,
        barSpacing: 60, // Extremely thin bars
        minBarSpacing: 30, // Minimum bar spacing
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
        precision: 6,
        minMove: 0.001,
      },
      lastValueVisible: true,
      priceLineWidth: 4,
    });

    // Create Bollinger Bands series
    let bollingerBandsSeries = createBollingerBandsSeries(chart);

    // Create Donchian Channels series
    let donchianSeries = createDonchianSeries(chart);

    // Handle theme changes by recreating series
    const cleanupThemeChange = onThemeChange(() => {
      if (isDisposed) return;

      // Recreate series with a small delay to ensure CSS variables are updated
      setTimeout(() => {
        if (isDisposed) return;

        // Recreate Bollinger Bands series
        if (showBollingerBands) {
          bollingerBandsSeries = recreateBollingerBandsSeries(
            chart,
            bollingerBandsSeries
          );
          // Re-update data with current candles
          if (chartLayer) {
            const allCandles = chartLayer.getAllCandles();
            updateBollingerBandsData(bollingerBandsSeries, allCandles);
          }
        }

        // Recreate Donchian Channels series
        if (showDonchian) {
          donchianSeries = recreateDonchianSeries(chart, donchianSeries);
          // Re-update data with current candles
          if (chartLayer) {
            const allCandles = chartLayer.getAllCandles();
            updateDonchianData(donchianSeries, allCandles);
          }
        }
      }, 100); // 100ms delay to ensure CSS variables are updated
    });

    const initChart = async () => {
      if (isDisposed) return;

      chartLayer = await sdk.realTimeChartDataLayer(activeId, candleSize);
      if (isDisposed) return;

      const from = Math.floor(Date.now() / 1000) - chartMinutesBack * 60;
      const candles = await chartLayer.fetchAllCandles(from);
      if (isDisposed) return;

      const format = (cs: Candle[]) =>
        cs.map((c) => ({
          time: c.from as UTCTimestamp,
          open: c.open,
          high: c.max,
          low: c.min,
          close: c.close,
        }));

      if (isDisposed) return;

      series.setData(format(candles));

      // Update Bollinger Bands data
      updateBollingerBandsData(bollingerBandsSeries, candles);

      // Update Donchian Channels data
      updateDonchianData(donchianSeries, candles);

      if (candles.length > 0) {
        earliestLoadedRef.current = candles[0].from as number;
      }

      // Subscribe to candle changes
      chartLayer.subscribeOnLastCandleChanged((candle: Candle) => {
        if (isDisposed) return;

        try {
          series.update({
            time: candle.from as UTCTimestamp,
            open: candle.open,
            high: candle.max,
            low: candle.min,
            close: candle.close,
          });

          // Update Bollinger Bands with the latest data
          const allCandles = chartLayer.getAllCandles();
          updateBollingerBandsData(bollingerBandsSeries, allCandles, true);

          // Update Donchian Channels with the latest data
          updateDonchianData(donchianSeries, allCandles, true);
        } catch (error) {
          console.warn("Error updating candle data:", error);
        }
      });
      unsubscribeFunctions.push(() => {
        chartLayer.unsubscribeOnLastCandleChanged(() => {});
      });

      // Subscribe to consistency recovery

      chartLayer.subscribeOnConsistencyRecovered(() => {
        if (isDisposed) return;

        try {
          const all = chartLayer.getAllCandles();
          series.setData(format(all));

          // Recalculate Bollinger Bands after consistency recovery
          updateBollingerBandsData(bollingerBandsSeries, all);

          // Recalculate Donchian Channels after consistency recovery
          updateDonchianData(donchianSeries, all);
        } catch (error) {
          console.warn("Error handling consistency recovery:", error);
        }
      });
      unsubscribeFunctions.push(() => {
        chartLayer.unsubscribeOnConsistencyRecovered(() => {});
      });

      // Subscribe to time range changes
      chart.timeScale().subscribeVisibleTimeRangeChange((range) => {
        if (
          isDisposed ||
          !range ||
          !earliestLoadedRef.current ||
          fetchingRef.current
        )
          return;

        if ((range.from as number) <= earliestLoadedRef.current) {
          fetchingRef.current = true;
          const fetchFrom = earliestLoadedRef.current - chartMinutesBack * 60;

          chartLayer
            .fetchAllCandles(fetchFrom)
            .then((moreData: Candle[]) => {
              if (isDisposed) return;

              try {
                const formatted = format(moreData);

                series.setData(formatted); // можно заменить на merge если нужно
                if (formatted.length > 0) {
                  earliestLoadedRef.current = formatted[0].time;
                }

                // Update Bollinger Bands with new historical data
                updateBollingerBandsData(bollingerBandsSeries, moreData);

                // Update Donchian Channels with new historical data
                updateDonchianData(donchianSeries, moreData);
              } catch (error) {
                console.warn("Error fetching historical data:", error);
              }
            })
            .catch((error: Error) => {
              console.warn("Error fetching historical data:", error);
            })
            .finally(() => {
              fetchingRef.current = false;
            });
        }
      });

      unsubscribeFunctions.push(() => {
        chart.timeScale().unsubscribeVisibleTimeRangeChange(() => {});
      });
    };

    initChart().catch((error) => {
      console.warn("Error initializing chart:", error);
    });

    return () => {
      isDisposed = true;

      // Clean up theme change listener
      cleanupThemeChange();

      // Unsubscribe from all subscriptions
      unsubscribeFunctions.forEach((unsubscribe) => {
        try {
          unsubscribe();
        } catch (error) {
          console.warn("Error unsubscribing:", error);
        }
      });

      // Clean up Bollinger Bands series
      try {
        destroyBollingerBandsSeries(chart, bollingerBandsSeries);
      } catch (error) {
        console.warn("Error destroying Bollinger Bands series:", error);
      }

      // Clean up Donchian Channels series
      try {
        destroyDonchianSeries(chart, donchianSeries);
      } catch (error) {
        console.warn("Error destroying Donchian Channels series:", error);
      }

      // Remove the chart
      try {
        chart.remove();
      } catch (error) {
        console.warn("Error removing chart:", error);
      }
    };
  }, [
    sdk,
    containerRef,
    activeId,
    candleSize,
    chartHeight,
    chartMinutesBack,
    showBollingerBands,
    bollingerConfig,
    createBollingerBandsSeries,
    updateBollingerBandsData,
    destroyBollingerBandsSeries,
    showDonchian,
    donchianConfig,
    createDonchianSeries,
    updateDonchianData,
    destroyDonchianSeries,
    onThemeChange,
    recreateBollingerBandsSeries,
    recreateDonchianSeries,
  ]);

  return (
    <div
      ref={containerRef}
      style={{ marginTop: "0px", width: "100%", height: chartHeight }}
    />
  );
}
