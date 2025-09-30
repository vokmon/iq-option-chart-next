"use client";

import { create } from "zustand";
import { Position } from "@quadcode-tech/client-sdk-js";

interface PositionsStore {
  // Data
  openPositions: Position[];
  closedPositions: Position[];

  // Actions
  setOpenPositions: (positions: Position[]) => void;
  setClosedPositions: (positions: Position[]) => void;
}

export const usePositionsStore = create<PositionsStore>((set, get) => ({
  // Initial state
  openPositions: [],
  closedPositions: [],

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
}));
