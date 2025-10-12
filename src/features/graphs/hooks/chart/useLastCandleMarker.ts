import { useCallback, useRef } from "react";
import {
  createSeriesMarkers,
  type ISeriesApi,
  type UTCTimestamp,
  type ISeriesMarkersPluginApi,
  type Time,
} from "lightweight-charts";
import { Candle } from "@quadcode-tech/client-sdk-js";
import { formatSecondsToMMSS } from "@/utils/dateTime";

export function useLastCandleMarker() {
  const markersPluginRef = useRef<ISeriesMarkersPluginApi<Time> | null>(null);

  const updateMarker = useCallback((candle: Candle) => {
    if (!markersPluginRef.current) return;

    const remainingTime = (candle.to * 1000 - new Date().getTime()) / 1000;
    const text = `${formatSecondsToMMSS(remainingTime)}`;

    markersPluginRef.current.setMarkers([
      {
        time: candle.from as UTCTimestamp,
        position: "belowBar",
        color: "white",
        shape: "circle",
        size: 0,
        text: text,
      },
    ]);
  }, []);

  const initializeMarker = useCallback(
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    (series: ISeriesApi<any, Time>, initialCandle: Candle) => {
      // Create the markers plugin
      markersPluginRef.current = createSeriesMarkers(series);

      // Update marker with initial candle
      updateMarker(initialCandle);
    },
    [updateMarker]
  );

  const updateCandle = useCallback(
    (candle: Candle) => {
      updateMarker(candle);
    },
    [updateMarker]
  );

  const cleanup = useCallback(() => {
    markersPluginRef.current = null;
  }, []);

  return {
    initializeMarker,
    updateCandle,
    cleanup,
  };
}
