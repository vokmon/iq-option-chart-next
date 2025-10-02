"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";
import { DigitalOptionsUnderlying } from "@quadcode-tech/client-sdk-js";
import { type BollingerBandsConfig } from "@/types/indicators/bollingerBands";
import { type DonchianConfig } from "@/types/indicators/donchian";
import { type StochasticConfig } from "@/types/indicators/stochastic";
import { type SupportResistanceConfig } from "@/types/indicators/supportResistance";

export const MAX_ASSETS = 7;

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
  supportResistance: {
    enabled: boolean;
    config: SupportResistanceConfig;
  };
}

export interface AssetState {
  id: string;
  name: string;
  asset: DigitalOptionsUnderlying | null;
  candleSize: number;
  indicators: AssetIndicatorSettings;
  isEmpty: boolean;
}

interface AssetStore {
  assets: AssetState[];
  activeAssetId: string | null;
  maxAssets: number;

  // Actions
  addAsset: (asset?: DigitalOptionsUnderlying) => string;
  removeAsset: (assetId: string) => void;
  setActiveAsset: (assetId: string) => void;
  updateAsset: (
    assetId: string,
    asset: DigitalOptionsUnderlying | null
  ) => void;
  updateCandleSize: (assetId: string, candleSize: number) => void;
  updateIndicators: (
    assetId: string,
    indicators: Partial<AssetIndicatorSettings>
  ) => void;
  getAvailableAssets: (
    allAssets: DigitalOptionsUnderlying[]
  ) => DigitalOptionsUnderlying[];
  canAddAsset: () => boolean;
  canRemoveAsset: (assetId: string) => boolean;
  getActiveAsset: () => AssetState | undefined;
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
  supportResistance: {
    enabled: true,
    config: { boxPeriod: 25 },
  },
};

const createEmptyAsset = (): AssetState => ({
  id: `asset_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
  name: "New Asset",
  asset: null,
  candleSize: 60,
  indicators: JSON.parse(JSON.stringify(defaultIndicators)), // Deep clone
  isEmpty: true,
});

const createAssetWithData = (asset: DigitalOptionsUnderlying): AssetState => ({
  id: `asset_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
  name: (asset.name ?? `Asset ${asset.activeId}`).replace(/-op$/i, ""),
  asset,
  candleSize: 60,
  indicators: JSON.parse(JSON.stringify(defaultIndicators)), // Deep clone
  isEmpty: false,
});

export const useAssetStore = create<AssetStore>()(
  persist(
    (set, get) => ({
      assets: [],
      activeAssetId: null,
      maxAssets: MAX_ASSETS,

      addAsset: (asset?: DigitalOptionsUnderlying) => {
        const state = get();
        // Don't allow adding new assets if we're at max capacity
        if (state.assets.length >= state.maxAssets) {
          return state.activeAssetId || "";
        }

        // Don't allow adding new assets if there's already an empty asset
        const hasEmptyAsset = state.assets.some((asset) => asset.isEmpty);
        if (hasEmptyAsset) {
          return state.activeAssetId || "";
        }

        const newAsset = asset
          ? createAssetWithData(asset)
          : createEmptyAsset();

        set((state) => ({
          assets: [...state.assets, newAsset],
          activeAssetId: newAsset.id,
        }));

        // Sync trading store with new asset
        if (typeof window !== "undefined") {
          import("./tradingStore").then(({ useTradingStore }) => {
            const tradingStore = useTradingStore.getState();
            const assetIds = [...state.assets, newAsset].map((a) => a.id);
            tradingStore.syncWithAssets(assetIds);
          });
        }

        return newAsset.id;
      },

      removeAsset: (assetId: string) => {
        const state = get();
        if (state.assets.length <= 1) return; // Cannot remove last asset

        const assetIndex = state.assets.findIndex(
          (asset) => asset.id === assetId
        );
        if (assetIndex === -1) return;

        const newAssets = state.assets.filter((asset) => asset.id !== assetId);
        let newActiveAssetId = state.activeAssetId;

        // If we're removing the active asset, switch to another asset
        if (state.activeAssetId === assetId) {
          if (assetIndex > 0) {
            newActiveAssetId = newAssets[assetIndex - 1].id;
          } else if (newAssets.length > 0) {
            newActiveAssetId = newAssets[0].id;
          } else {
            newActiveAssetId = null;
          }
        }

        set({
          assets: newAssets,
          activeAssetId: newActiveAssetId,
        });

        // Sync trading store - remove trading data for deleted asset
        if (typeof window !== "undefined") {
          import("./tradingStore").then(({ useTradingStore }) => {
            const tradingStore = useTradingStore.getState();
            const assetIds = newAssets.map((a) => a.id);
            tradingStore.syncWithAssets(assetIds);
          });
        }
      },

      setActiveAsset: (assetId: string) => {
        const state = get();
        const assetExists = state.assets.some((asset) => asset.id === assetId);
        if (assetExists) {
          set({ activeAssetId: assetId });
        }
      },

      updateAsset: (
        assetId: string,
        asset: DigitalOptionsUnderlying | null
      ) => {
        set((state) => ({
          assets: state.assets.map((assetState) =>
            assetState.id === assetId
              ? {
                  ...assetState,
                  asset,
                  name: asset
                    ? (asset.name ?? `Asset ${asset.activeId}`).replace(
                        /-op$/i,
                        ""
                      )
                    : "New Asset",
                  isEmpty: asset === null,
                }
              : assetState
          ),
        }));
      },

      updateCandleSize: (assetId: string, candleSize: number) => {
        set((state) => ({
          assets: state.assets.map((assetState) =>
            assetState.id === assetId
              ? { ...assetState, candleSize }
              : assetState
          ),
        }));
      },

      updateIndicators: (
        assetId: string,
        indicators: Partial<AssetIndicatorSettings>
      ) => {
        set((state) => ({
          assets: state.assets.map((assetState) =>
            assetState.id === assetId
              ? {
                  ...assetState,
                  indicators: {
                    ...assetState.indicators,
                    ...indicators,
                    // Deep merge indicator configs
                    ...(indicators.bollingerBands && {
                      bollingerBands: {
                        ...assetState.indicators.bollingerBands,
                        ...indicators.bollingerBands,
                      },
                    }),
                    ...(indicators.donchian && {
                      donchian: {
                        ...assetState.indicators.donchian,
                        ...indicators.donchian,
                      },
                    }),
                    ...(indicators.stochastic && {
                      stochastic: {
                        ...assetState.indicators.stochastic,
                        ...indicators.stochastic,
                      },
                    }),
                    ...(indicators.supportResistance && {
                      supportResistance: {
                        ...assetState.indicators.supportResistance,
                        ...indicators.supportResistance,
                      },
                    }),
                  },
                }
              : assetState
          ),
        }));
      },

      getAvailableAssets: (allAssets: DigitalOptionsUnderlying[]) => {
        const state = get();
        const usedAssetIds = new Set(
          state.assets
            .filter((assetState) => assetState.asset !== null)
            .map((assetState) => assetState.asset!.activeId)
        );

        return allAssets.filter((asset) => !usedAssetIds.has(asset.activeId));
      },

      canAddAsset: () => {
        const state = get();
        // Don't allow adding new assets if we're at max capacity
        if (state.assets.length >= state.maxAssets) {
          return false;
        }
        // Don't allow adding new assets if there's already an empty asset
        const hasEmptyAsset = state.assets.some(
          (assetState) => assetState.isEmpty
        );
        return !hasEmptyAsset;
      },

      canRemoveAsset: (assetId: string) => {
        const state = get();
        return (
          state.assets.length > 1 &&
          state.assets.some((assetState) => assetState.id === assetId)
        );
      },

      getActiveAsset: () => {
        const state = get();
        return state.assets.find(
          (assetState) => assetState.id === state.activeAssetId
        );
      },
    }),
    {
      name: "asset-storage",
      partialize: (state) => ({
        assets: state.assets,
        activeAssetId: state.activeAssetId,
      }),
    }
  )
);
