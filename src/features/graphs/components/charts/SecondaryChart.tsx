import { useEffect, useRef } from "react";
import { createChart } from "lightweight-charts";
import { useSdk } from "@/hooks/useSdk";
import { Candle, RealTimeChartDataLayer } from "@quadcode-tech/client-sdk-js";
import { useStochasticChart } from "@/features/graphs/hooks/indicators/stochastic/useStochasticChart";
import { useStochasticTabQuery } from "@/features/graphs/hooks/indicators/stochastic/useStochasticTabQuery";
import { useRSIChart } from "@/features/graphs/hooks/indicators/rsi/useRSIChart";
import { useRSITabQuery } from "@/features/graphs/hooks/indicators/rsi/useRSITabQuery";
import { useThemeChange } from "@/hooks/useThemeChange";
import { StochasticComponent } from "../indicators/stochastic/StochasticComponent";
import { RSIComponent } from "../indicators/rsi/RSIComponent";

interface SecondaryChartProps {
  activeId: number;
  candleSize: number;
  chartHeight?: number;
  chartMinutesBack?: number;
}

const chartHeight = 120;

export function SecondaryChart({
  activeId,
  candleSize,
  chartMinutesBack = 60,
}: SecondaryChartProps) {
  const { sdk } = useSdk();
  const containerRef = useRef<HTMLDivElement>(null);
  const earliestLoadedRef = useRef<number | null>(null);
  const fetchingRef = useRef<boolean>(false);

  // Query parameter hooks for stochastic oscillator
  const { showStochastic, stochasticConfig } = useStochasticTabQuery();

  // Query parameter hooks for RSI
  const { showRSI, rsiConfig } = useRSITabQuery();

  // Stochastic Oscillator hook
  const {
    createStochasticSeries,
    updateStochasticData,
    destroyStochasticSeries,
    recreateStochasticSeries,
  } = useStochasticChart({
    showStochastic,
    stochasticConfig,
  });

  // RSI hook
  const {
    createRSISeries,
    updateRSIData,
    destroyRSISeries,
    recreateRSISeries,
  } = useRSIChart({
    showRSI,
    rsiConfig,
  });

  // Theme change detection
  const { onThemeChange } = useThemeChange();

  useEffect(() => {
    if (!sdk || !containerRef.current || (!showStochastic && !showRSI)) return;

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
        barSpacing: 80,
        minBarSpacing: 40,
        rightOffset: 2, // Add space at the end of the chart
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
    let stochasticSeries = createStochasticSeries(chart);

    // Create RSI series
    let rsiSeries = createRSISeries(chart);

    // Handle theme changes by recreating series
    const cleanupThemeChange = onThemeChange(() => {
      if (isDisposed) return;

      // Recreate series with a small delay to ensure CSS variables are updated
      setTimeout(() => {
        if (isDisposed) return;

        if (showStochastic) {
          stochasticSeries = recreateStochasticSeries(chart, stochasticSeries);
        }

        if (showRSI) {
          rsiSeries = recreateRSISeries(chart, rsiSeries);
        }

        // Re-update data with current candles
        if (chartLayer) {
          const allCandles = chartLayer.getAllCandles();
          if (showStochastic) {
            updateStochasticData(stochasticSeries, allCandles);
          }
          if (showRSI) {
            updateRSIData(rsiSeries, allCandles);
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

      // Update Stochastic Oscillator data
      if (showStochastic) {
        updateStochasticData(stochasticSeries, candles);
      }

      // Update RSI data
      if (showRSI) {
        updateRSIData(rsiSeries, candles);
      }

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
          // Update indicators with the latest data
          const allCandles = chartLayer.getAllCandles();
          if (showStochastic) {
            updateStochasticData(stochasticSeries, allCandles, true);
          }
          if (showRSI) {
            updateRSIData(rsiSeries, allCandles, true);
          }
        } catch (error) {
          console.warn("Error updating indicator data:", error);
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
          // Recalculate indicators after consistency recovery
          if (showStochastic) {
            updateStochasticData(stochasticSeries, all);
          }
          if (showRSI) {
            updateRSIData(rsiSeries, all);
          }
        } catch (error) {
          console.warn("Error handling indicator consistency recovery:", error);
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

                // Update indicators with new historical data
                if (showStochastic) {
                  updateStochasticData(stochasticSeries, moreData);
                }
                if (showRSI) {
                  updateRSIData(rsiSeries, moreData);
                }
              } catch (error) {
                console.warn(
                  "Error fetching indicator historical data:",
                  error
                );
              }
            })
            .catch((error: Error) => {
              console.warn("Error fetching indicator historical data:", error);
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
      console.warn("Error initializing secondary chart:", error);
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
          console.warn("Error unsubscribing from secondary chart:", error);
        }
      });

      // Clean up indicator series
      try {
        if (showStochastic) {
          destroyStochasticSeries(chart, stochasticSeries);
        }
        if (showRSI) {
          destroyRSISeries(chart, rsiSeries);
        }
      } catch (error) {
        console.warn("Error destroying indicator series:", error);
      }

      // Remove the chart
      try {
        chart.remove();
      } catch (error) {
        console.warn("Error removing secondary chart:", error);
      }
    };
  }, [
    sdk,
    containerRef,
    activeId,
    candleSize,
    chartMinutesBack,
    showStochastic,
    stochasticConfig,
    showRSI,
    rsiConfig,
    createStochasticSeries,
    updateStochasticData,
    destroyStochasticSeries,
    recreateStochasticSeries,
    createRSISeries,
    updateRSIData,
    destroyRSISeries,
    recreateRSISeries,
    onThemeChange,
  ]);

  if (!showStochastic && !showRSI) {
    return null;
  }

  return (
    <div className="flex flex-row gap-1 w-full">
      <GraphSidebar />
      <div
        ref={containerRef}
        className="relative mt-0 w-full"
        style={{ height: chartHeight }}
      ></div>
    </div>
  );
}

const GraphSidebar = () => {
  return (
    <div className="flex flex-col gap-2">
      <StochasticComponent />
      <RSIComponent />
    </div>
  );
};
