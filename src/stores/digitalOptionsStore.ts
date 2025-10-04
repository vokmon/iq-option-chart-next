"use client";

import { create } from "zustand";
import { DigitalOptionsUnderlying, Active } from "@quadcode-tech/client-sdk-js";

interface ActiveInformation {
  [activeId: number]: Active;
}

interface DigitalOptionsStore {
  actives: DigitalOptionsUnderlying[];
  activeInformation: ActiveInformation;
  isLoading: boolean;
  isError: boolean;
  error: Error | null;
  lastFetched: number | null;

  // Actions
  setActives: (actives: DigitalOptionsUnderlying[]) => void;
  setActiveInformation: (activeId: number, data: Active) => void;
  setLoading: (isLoading: boolean) => void;
  setError: (error: Error | null) => void;
  setLastFetched: (timestamp: number) => void;
  clearError: () => void;
}

export const useDigitalOptionsStore = create<DigitalOptionsStore>((set) => ({
  actives: [],
  activeInformation: {},
  isLoading: false,
  isError: false,
  error: null,
  lastFetched: null,

  setActives: (actives: DigitalOptionsUnderlying[]) => {
    set({
      actives,
      isError: false,
      error: null,
      lastFetched: Date.now(),
    });
  },

  setActiveInformation: (activeId: number, data: Active) => {
    set((state) => ({
      activeInformation: {
        ...state.activeInformation,
        [activeId]: data,
      },
    }));
  },

  setLoading: (isLoading: boolean) => {
    set({ isLoading });
  },

  setError: (error: Error | null) => {
    set({
      error,
      isError: !!error,
      isLoading: false,
    });
  },

  setLastFetched: (timestamp: number) => {
    set({ lastFetched: timestamp });
  },

  clearError: () => {
    set({
      error: null,
      isError: false,
    });
  },
}));
