import { useEffect, useRef } from "react";
import { createChart } from "lightweight-charts";
import { useSdk } from "@/hooks/useSdk";
import { Candle, RealTimeChartDataLayer } from "@quadcode-tech/client-sdk-js";
import { useStochasticChart } from "@/hooks/indicators/stochastic/useStochasticChart";
import { useStochasticQuery } from "@/hooks/indicators/stochastic/useStochasticQuery";

interface StochasticChartProps {
  activeId: number;
  candleSize: number;
  chartHeight?: number;
  chartMinutesBack?: number;
}

export function StochasticChart({
  activeId,
  candleSize,
  chartHeight = 200,
  chartMinutesBack = 60,
}: StochasticChartProps) {
  const { sdk } = useSdk();
  const containerRef = useRef<HTMLDivElement>(null);
  const earliestLoadedRef = useRef<number | null>(null);
  const fetchingRef = useRef<boolean>(false);

  // Query parameter hooks for stochastic oscillator
  const { showStochastic, stochasticConfig } = useStochasticQuery();

  // Stochastic Oscillator hook
  const {
    createStochasticSeries,
    updateStochasticData,
    destroyStochasticSeries,
  } = useStochasticChart({
    showStochastic,
    stochasticConfig,
  });

  useEffect(() => {
    if (!sdk || !containerRef.current || !showStochastic) return;

    let isDisposed = false;
    let chartLayer: RealTimeChartDataLayer;
    const unsubscribeFunctions: (() => void)[] = [];

    const chart = createChart(containerRef.current, {
      layout: { textColor: "black", attributionLogo: false },
      height: chartHeight,
      timeScale: {
        timeVisible: true,
        secondsVisible: false,
        barSpacing: 80,
        minBarSpacing: 40,
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
        scaleMargins: {
          top: 0.1,
          bottom: 0.1,
        },
        mode: 0, // Price mode for better control
        autoScale: true,
      },
    });

    // Create Stochastic Oscillator series
    const stochasticSeries = createStochasticSeries(chart);

    const initChart = async () => {
      if (isDisposed) return;

      chartLayer = await sdk.realTimeChartDataLayer(activeId, candleSize);
      if (isDisposed) return;

      const from = Math.floor(Date.now() / 1000) - chartMinutesBack * 60;
      const candles = await chartLayer.fetchAllCandles(from);
      if (isDisposed) return;

      // Update Stochastic Oscillator data
      updateStochasticData(stochasticSeries, candles);

      // Auto-fit the chart to show the data better
      setTimeout(() => {
        if (!isDisposed) {
          chart.timeScale().fitContent();
        }
      }, 100);

      if (candles.length > 0) {
        earliestLoadedRef.current = candles[0].from as number;
      }

      // Subscribe to candle changes
      chartLayer.subscribeOnLastCandleChanged(() => {
        if (isDisposed) return;

        try {
          // Update Stochastic Oscillator with the latest data
          const allCandles = chartLayer.getAllCandles();
          updateStochasticData(stochasticSeries, allCandles, true);
        } catch (error) {
          console.warn("Error updating stochastic data:", error);
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
          // Recalculate Stochastic Oscillator after consistency recovery
          updateStochasticData(stochasticSeries, all);
        } catch (error) {
          console.warn(
            "Error handling stochastic consistency recovery:",
            error
          );
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
                if (moreData.length > 0) {
                  earliestLoadedRef.current = moreData[0].from as number;
                }

                // Update Stochastic Oscillator with new historical data
                updateStochasticData(stochasticSeries, moreData);
              } catch (error) {
                console.warn(
                  "Error fetching stochastic historical data:",
                  error
                );
              }
            })
            .catch((error: Error) => {
              console.warn("Error fetching stochastic historical data:", error);
            })
            .finally(() => {
              fetchingRef.current = false;
            });
        }
      });
    };

    unsubscribeFunctions.push(() => {
      chart.timeScale().unsubscribeVisibleTimeRangeChange(() => {});
    });

    initChart().catch((error) => {
      console.warn("Error initializing stochastic chart:", error);
    });

    return () => {
      isDisposed = true;

      // Unsubscribe from all subscriptions
      unsubscribeFunctions.forEach((unsubscribe) => {
        try {
          unsubscribe();
        } catch (error) {
          console.warn("Error unsubscribing from stochastic chart:", error);
        }
      });

      // Clean up Stochastic Oscillator series
      try {
        destroyStochasticSeries(chart, stochasticSeries);
      } catch (error) {
        console.warn("Error destroying stochastic series:", error);
      }

      // Remove the chart
      try {
        chart.remove();
      } catch (error) {
        console.warn("Error removing stochastic chart:", error);
      }
    };
  }, [
    sdk,
    containerRef,
    activeId,
    candleSize,
    chartHeight,
    chartMinutesBack,
    showStochastic,
    stochasticConfig,
    createStochasticSeries,
    updateStochasticData,
    destroyStochasticSeries,
  ]);

  if (!showStochastic) {
    return null;
  }

  return (
    <div
      ref={containerRef}
      style={{ marginTop: "10px", width: "100%", height: chartHeight }}
    />
  );
}
