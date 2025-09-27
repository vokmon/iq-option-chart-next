"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";
import { DigitalOptionsUnderlying } from "@quadcode-tech/client-sdk-js";
import { type BollingerBandsConfig } from "@/types/indicators/bollingerBands";
import { type DonchianConfig } from "@/types/indicators/donchian";
import { type StochasticConfig } from "@/types/indicators/stochastic";

export interface AssetIndicatorSettings {
  bollingerBands: {
    enabled: boolean;
    config: BollingerBandsConfig;
  };
  donchian: {
    enabled: boolean;
    config: DonchianConfig;
  };
  stochastic: {
    enabled: boolean;
    config: StochasticConfig;
  };
}

export interface AssetChartState {
  id: string;
  name: string;
  asset: DigitalOptionsUnderlying | null;
  candleSize: number;
  indicators: AssetIndicatorSettings;
  isEmpty: boolean;
}

interface AssetChartStore {
  charts: AssetChartState[];
  activeChartId: string | null;
  maxCharts: number;

  // Actions
  addChart: (asset?: DigitalOptionsUnderlying) => string;
  removeChart: (chartId: string) => void;
  setActiveChart: (chartId: string) => void;
  updateChartAsset: (
    chartId: string,
    asset: DigitalOptionsUnderlying | null
  ) => void;
  updateChartCandleSize: (chartId: string, candleSize: number) => void;
  updateChartIndicators: (
    chartId: string,
    indicators: Partial<AssetIndicatorSettings>
  ) => void;
  getAvailableAssets: (
    allAssets: DigitalOptionsUnderlying[]
  ) => DigitalOptionsUnderlying[];
  canAddChart: () => boolean;
  canRemoveChart: (chartId: string) => boolean;
}

const defaultIndicators: AssetIndicatorSettings = {
  bollingerBands: {
    enabled: true,
    config: { period: 14, stdDev: 2 },
  },
  donchian: {
    enabled: true,
    config: { period: 20 },
  },
  stochastic: {
    enabled: true,
    config: { kPeriod: 13, dPeriod: 3, smoothing: 3 },
  },
};

const createEmptyChart = (): AssetChartState => ({
  id: `chart_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
  name: "New Chart",
  asset: null,
  candleSize: 60,
  indicators: JSON.parse(JSON.stringify(defaultIndicators)), // Deep clone
  isEmpty: true,
});

const createChartWithAsset = (
  asset: DigitalOptionsUnderlying
): AssetChartState => ({
  id: `chart_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
  name: (asset.name ?? `Asset ${asset.activeId}`).replace(/-op$/i, ""),
  asset,
  candleSize: 60,
  indicators: JSON.parse(JSON.stringify(defaultIndicators)), // Deep clone
  isEmpty: false,
});

export const useAssetChartStore = create<AssetChartStore>()(
  persist(
    (set, get) => ({
      charts: [],
      activeChartId: null,
      maxCharts: 15,

      addChart: (asset?: DigitalOptionsUnderlying) => {
        const state = get();
        // Don't allow adding new charts if we're at max capacity
        if (state.charts.length >= state.maxCharts) {
          return state.activeChartId || "";
        }

        // Don't allow adding new charts if there's already an empty tab
        const hasEmptyTab = state.charts.some((chart) => chart.isEmpty);
        if (hasEmptyTab) {
          return state.activeChartId || "";
        }

        const newChart = asset
          ? createChartWithAsset(asset)
          : createEmptyChart();

        set((state) => ({
          charts: [...state.charts, newChart],
          activeChartId: newChart.id,
        }));

        return newChart.id;
      },

      removeChart: (chartId: string) => {
        const state = get();
        if (state.charts.length <= 1) return; // Cannot remove last chart

        const chartIndex = state.charts.findIndex(
          (chart) => chart.id === chartId
        );
        if (chartIndex === -1) return;

        const newCharts = state.charts.filter((chart) => chart.id !== chartId);
        let newActiveChartId = state.activeChartId;

        // If we're removing the active chart, switch to another chart
        if (state.activeChartId === chartId) {
          if (chartIndex > 0) {
            newActiveChartId = newCharts[chartIndex - 1].id;
          } else if (newCharts.length > 0) {
            newActiveChartId = newCharts[0].id;
          } else {
            newActiveChartId = null;
          }
        }

        set({
          charts: newCharts,
          activeChartId: newActiveChartId,
        });
      },

      setActiveChart: (chartId: string) => {
        const state = get();
        const chartExists = state.charts.some((chart) => chart.id === chartId);
        if (chartExists) {
          set({ activeChartId: chartId });
        }
      },

      updateChartAsset: (
        chartId: string,
        asset: DigitalOptionsUnderlying | null
      ) => {
        set((state) => ({
          charts: state.charts.map((chart) =>
            chart.id === chartId
              ? {
                  ...chart,
                  asset,
                  name: asset
                    ? (asset.name ?? `Asset ${asset.activeId}`).replace(
                        /-op$/i,
                        ""
                      )
                    : "New Chart",
                  isEmpty: asset === null,
                }
              : chart
          ),
        }));
      },

      updateChartCandleSize: (chartId: string, candleSize: number) => {
        set((state) => ({
          charts: state.charts.map((chart) =>
            chart.id === chartId ? { ...chart, candleSize } : chart
          ),
        }));
      },

      updateChartIndicators: (
        chartId: string,
        indicators: Partial<AssetIndicatorSettings>
      ) => {
        set((state) => ({
          charts: state.charts.map((chart) =>
            chart.id === chartId
              ? {
                  ...chart,
                  indicators: {
                    ...chart.indicators,
                    ...indicators,
                    // Deep merge indicator configs
                    ...(indicators.bollingerBands && {
                      bollingerBands: {
                        ...chart.indicators.bollingerBands,
                        ...indicators.bollingerBands,
                      },
                    }),
                    ...(indicators.donchian && {
                      donchian: {
                        ...chart.indicators.donchian,
                        ...indicators.donchian,
                      },
                    }),
                    ...(indicators.stochastic && {
                      stochastic: {
                        ...chart.indicators.stochastic,
                        ...indicators.stochastic,
                      },
                    }),
                  },
                }
              : chart
          ),
        }));
      },

      getAvailableAssets: (allAssets: DigitalOptionsUnderlying[]) => {
        const state = get();
        const usedAssetIds = new Set(
          state.charts
            .filter((chart) => chart.asset !== null)
            .map((chart) => chart.asset!.activeId)
        );

        return allAssets.filter((asset) => !usedAssetIds.has(asset.activeId));
      },

      canAddChart: () => {
        const state = get();
        // Don't allow adding new charts if we're at max capacity
        if (state.charts.length >= state.maxCharts) {
          return false;
        }
        // Don't allow adding new charts if there's already an empty tab
        const hasEmptyTab = state.charts.some((chart) => chart.isEmpty);
        return !hasEmptyTab;
      },

      canRemoveChart: (chartId: string) => {
        const state = get();
        return (
          state.charts.length > 1 &&
          state.charts.some((chart) => chart.id === chartId)
        );
      },
    }),
    {
      name: "asset-storage",
      partialize: (state) => ({
        charts: state.charts,
        activeChartId: state.activeChartId,
      }),
    }
  )
);
