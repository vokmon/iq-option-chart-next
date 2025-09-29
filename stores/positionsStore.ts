"use client";

import { create } from "zustand";
import { Position } from "@quadcode-tech/client-sdk-js";

interface PositionsStore {
  // Data
  openPositions: Position[];
  closedPositions: Position[];

  // Open positions states
  isOpenPositionsLoading: boolean;
  isOpenPositionsError: boolean;
  openPositionsError: Error | null;

  // Closed positions states
  isClosedPositionsLoading: boolean;
  isClosedPositionsError: boolean;
  closedPositionsError: Error | null;

  // Actions
  setOpenPositions: (positions: Position[]) => void;
  setClosedPositions: (positions: Position[]) => void;
  clearAllPositions: () => void;

  // Open positions actions
  setOpenPositionsLoading: (isLoading: boolean) => void;
  setOpenPositionsError: (error: Error | null) => void;
  clearOpenPositionsError: () => void;

  // Closed positions actions
  setClosedPositionsLoading: (isLoading: boolean) => void;
  setClosedPositionsError: (error: Error | null) => void;
  clearClosedPositionsError: () => void;
}

export const usePositionsStore = create<PositionsStore>((set, get) => ({
  // Initial state
  openPositions: [],
  closedPositions: [],

  // Open positions initial state
  isOpenPositionsLoading: false,
  isOpenPositionsError: false,
  openPositionsError: null,

  // Closed positions initial state
  isClosedPositionsLoading: false,
  isClosedPositionsError: false,
  closedPositionsError: null,

  // Actions
  setOpenPositions: (positions: Position[]) => {
    set({
      openPositions: positions,
    });
  },

  setClosedPositions: (positions: Position[]) => {
    set({
      closedPositions: positions,
    });
  },

  clearAllPositions: () => {
    set({
      openPositions: [],
      closedPositions: [],
    });
  },

  // Open positions actions
  setOpenPositionsLoading: (isLoading: boolean) => {
    set({ isOpenPositionsLoading: isLoading });
  },

  setOpenPositionsError: (error: Error | null) => {
    set({
      openPositionsError: error,
      isOpenPositionsError: !!error,
      isOpenPositionsLoading: false,
    });
  },

  clearOpenPositionsError: () => {
    set({
      openPositionsError: null,
      isOpenPositionsError: false,
    });
  },

  // Closed positions actions
  setClosedPositionsLoading: (isLoading: boolean) => {
    set({ isClosedPositionsLoading: isLoading });
  },

  setClosedPositionsError: (error: Error | null) => {
    set({
      closedPositionsError: error,
      isClosedPositionsError: !!error,
      isClosedPositionsLoading: false,
    });
  },

  clearClosedPositionsError: () => {
    set({
      closedPositionsError: null,
      isClosedPositionsError: false,
    });
  },
}));
