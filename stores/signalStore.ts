"use client";

import { SignalType } from "@/types/signal/Signal";
import { create } from "zustand";

interface SignalStore {
  // Data - Map of activeId (assetId) to signal
  signals: Record<number, SignalType>;

  // Actions
  setSignal: (activeId: number, signal: SignalType) => void;
  getSignal: (activeId: number) => SignalType | undefined;
  removeSignal: (activeId: number) => void;
  clearAllSignals: () => void;
  hasSignal: (activeId: number) => boolean;
  getAllSignals: () => Record<number, SignalType>;
}

export const useSignalStore = create<SignalStore>((set, get) => ({
  // Initial state
  signals: {},

  // Actions
  setSignal: (activeId: number, signal: SignalType) => {
    set((state) => ({
      signals: {
        ...state.signals,
        [activeId]: signal,
      },
    }));
  },

  getSignal: (activeId: number) => {
    const state = get();
    return state.signals[activeId];
  },

  removeSignal: (activeId: number) => {
    set((state) => {
      const newSignals = { ...state.signals };
      delete newSignals[activeId];
      return { signals: newSignals };
    });
  },

  clearAllSignals: () => {
    set({ signals: {} });
  },

  hasSignal: (activeId: number) => {
    const state = get();
    return activeId in state.signals;
  },

  getAllSignals: () => {
    const state = get();
    return { ...state.signals };
  },
}));
