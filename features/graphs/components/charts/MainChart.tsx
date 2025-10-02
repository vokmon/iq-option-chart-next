import { useEffect, useRef } from "react";
import {
  CandlestickSeries,
  createChart,
  type UTCTimestamp,
} from "lightweight-charts";
import { useSdk } from "@/hooks/useSdk";
import { useWindowHeight } from "@/features/graphs/hooks/chart/useWindowHeight";
import { Candle, RealTimeChartDataLayer } from "@quadcode-tech/client-sdk-js";
import { useBollingerBandsChart } from "@/features/graphs/hooks/indicators/bollinger-bands/useBollingerBandsChart";
import { useDonchianChart } from "@/features/graphs/hooks/indicators/donchian-channels/useDonchianChart";
import { useSupportResistanceChart } from "@/features/graphs/hooks/indicators/support-resistance/useSupportResistanceChart";
import { useBollingerBandsTabQuery } from "@/features/graphs/hooks/indicators/bollinger-bands/useBollingerBandsTabQuery";
import { useDonchianTabQuery } from "@/features/graphs/hooks/indicators/donchian-channels/useDonchianTabQuery";
import { useSupportResistanceTabQuery } from "@/features/graphs/hooks/indicators/support-resistance/useSupportResistanceTabQuery";
import { usePositionReferenceLines } from "@/features/graphs/hooks/trading/usePositionReferenceLines";
import { useThemeChange } from "@/hooks/useThemeChange";
import { BollingerBandsComponent } from "../indicators/bollinger/BollingerBandsComponent";
import { DonchianComponent } from "../indicators/donchian/DonchianComponent";
import { useDigitalOptionsStore } from "@/stores/digitalOptionsStore";
import Image from "next/image";
import { Text } from "@mantine/core";
import { SupportResistanceComponent } from "../indicators/support-resistance/SupportResistanceComponent";

interface MainChartProps {
  activeId: number;
  candleSize: number;
  chartMinutesBack?: number;
}

export function MainChart({
  activeId,
  candleSize,
  chartMinutesBack = 60,
}: MainChartProps) {
  const { sdk } = useSdk();
  const containerRef = useRef<HTMLDivElement>(null);
  const earliestLoadedRef = useRef<number | null>(null);
  const fetchingRef = useRef<boolean>(false);
  const chartHeight = useWindowHeight(300);

  // Query parameter hooks for indicators
  const { showBollingerBands, bollingerConfig } = useBollingerBandsTabQuery();
  const { showDonchian, donchianConfig } = useDonchianTabQuery();
  const { showSupportResistance, supportResistanceConfig } =
    useSupportResistanceTabQuery();

  // Order reference lines hook

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

  // Support & Resistance hook
  const {
    createSupportResistanceSeries,
    updateSupportResistanceData,
    destroySupportResistanceSeries,
    recreateSupportResistanceSeries,
  } = useSupportResistanceChart({
    showSupportResistance,
    supportResistanceConfig,
  });

  // Position reference lines hook
  const {
    createPositionReferenceLines,
    updatePositionReferenceLines,
    destroyPositionReferenceLines,
    recreatePositionReferenceLines,
  } = usePositionReferenceLines({
    activeId,
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
        barSpacing: 70, // Extremely thin bars
        minBarSpacing: 40, // Minimum bar spacing
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
      },
    });

    const series = chart.addSeries(CandlestickSeries, {
      priceFormat: {
        type: "price",
        precision: 6,
        minMove: 0.000001,
      },
      lastValueVisible: true,
      priceLineWidth: 4,
      priceLineStyle: 2, // 0 = solid, 1 = dotted, 2 = dashed
    });

    // Create Bollinger Bands series
    let bollingerBandsSeries = createBollingerBandsSeries(chart);

    // Create Donchian Channels series
    let donchianSeries = createDonchianSeries(chart);

    // Create Support & Resistance series
    let supportResistanceSeries = createSupportResistanceSeries(chart);

    // Create Position reference lines
    let positionReferenceLines = createPositionReferenceLines(chart);

    // Handle theme changes by recreating series
    const cleanupThemeChange = onThemeChange(() => {
      if (isDisposed) return;

      // Recreate series with a small delay to ensure CSS variables are updated
      setTimeout(() => {
        if (isDisposed) return;

        const allCandles = chartLayer.getAllCandles();
        // Recreate Bollinger Bands series
        if (showBollingerBands) {
          bollingerBandsSeries = recreateBollingerBandsSeries(
            chart,
            bollingerBandsSeries
          );
          // Re-update data with current candles
          if (chartLayer) {
            updateBollingerBandsData(bollingerBandsSeries, allCandles);
          }
        }

        // Recreate Donchian Channels series
        if (showDonchian) {
          donchianSeries = recreateDonchianSeries(chart, donchianSeries);
          // Re-update data with current candles
          if (chartLayer) {
            updateDonchianData(donchianSeries, allCandles);
          }
        }

        // Recreate Support & Resistance series
        if (showSupportResistance) {
          supportResistanceSeries = recreateSupportResistanceSeries(
            chart,
            supportResistanceSeries
          );
          // Re-update data with current candles
          if (chartLayer) {
            updateSupportResistanceData(supportResistanceSeries, allCandles);
          }
        }

        // Recreate Position reference lines
        positionReferenceLines = recreatePositionReferenceLines(
          chart,
          positionReferenceLines
        );
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

      // Update Support & Resistance data
      updateSupportResistanceData(supportResistanceSeries, candles);

      // Update Position reference lines
      updatePositionReferenceLines(positionReferenceLines, chart);

      if (candles.length > 0) {
        earliestLoadedRef.current = candles[0].from as number;
      }

      // Subscribe to candle changes
      chartLayer.subscribeOnLastCandleChanged(async (candle: Candle) => {
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

          // Update Support & Resistance with the latest data
          updateSupportResistanceData(
            supportResistanceSeries,
            allCandles,
            true
          );
        } catch (error) {
          console.warn("Error updating candle data:", error);
        }
      });
      unsubscribeFunctions.push(() => {
        chartLayer.unsubscribeOnLastCandleChanged(() => {});
      });

      // Subscribe to consistency recovery

      chartLayer.subscribeOnConsistencyRecovered(async () => {
        if (isDisposed) return;

        try {
          const all = chartLayer.getAllCandles();
          series.setData(format(all));

          // Recalculate Bollinger Bands after consistency recovery
          updateBollingerBandsData(bollingerBandsSeries, all);

          // Recalculate Donchian Channels after consistency recovery
          updateDonchianData(donchianSeries, all);

          // Recalculate Support & Resistance after consistency recovery
          updateSupportResistanceData(supportResistanceSeries, all);
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

                // Update Support & Resistance with new historical data
                updateSupportResistanceData(supportResistanceSeries, moreData);
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

      // Clean up Support & Resistance series
      try {
        destroySupportResistanceSeries(chart, supportResistanceSeries);
      } catch (error) {
        console.warn("Error destroying Support & Resistance series:", error);
      }

      // Clean up Position reference lines
      try {
        destroyPositionReferenceLines(chart, positionReferenceLines);
      } catch (error) {
        console.warn("Error destroying Position reference lines:", error);
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
    showSupportResistance,
    supportResistanceConfig,
    createSupportResistanceSeries,
    updateSupportResistanceData,
    destroySupportResistanceSeries,
    onThemeChange,
    recreateBollingerBandsSeries,
    recreateDonchianSeries,
    recreateSupportResistanceSeries,
    createPositionReferenceLines,
    updatePositionReferenceLines,
    destroyPositionReferenceLines,
    recreatePositionReferenceLines,
  ]);

  return (
    <div
      ref={containerRef}
      className="relative mt-0 w-full animate-fade-in"
      style={{ height: chartHeight }}
    >
      <div className="absolute top-0 left-0 z-100">
        <div
          className="px-3 animate-fade-in"
          style={{
            background: "var(--glass-bg)",
            backdropFilter: "blur(2px)",
            border: "1px solid var(--glass-border)",
            borderRadius: "12px",
            boxShadow: "var(--glass-shadow)",
          }}
        >
          <GraphHeader activeId={activeId} />
        </div>
      </div>
    </div>
  );
}

const GraphHeader = ({ activeId }: { activeId: number }) => {
  const { activeInformation } = useDigitalOptionsStore();
  const active = activeInformation[activeId];
  return (
    <div>
      {active && (
        <Text size="md" fw={700}>
          {active.name}
        </Text>
      )}
      <div className="flex items-center gap-4">
        {active && (
          <div className="flex flex-col items-start gap-2 animate-fade-in">
            <Image
              src={active.imageUrl}
              alt={active.name}
              width={45}
              height={45}
            />
          </div>
        )}
        <div className="flex flex-col gap-0">
          <BollingerBandsComponent />
          <DonchianComponent />
          <SupportResistanceComponent />
        </div>
      </div>
    </div>
  );
};
