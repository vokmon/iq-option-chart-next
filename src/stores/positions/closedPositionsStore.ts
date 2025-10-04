"use client";

import { create } from "zustand";
import { Position } from "@quadcode-tech/client-sdk-js";

interface PositionsStore {
  closedPositions: Position[];

  // Actions

  setClosedPositions: (positions: Position[]) => void;
  addClosedPosition: (position: Position) => void;
  addClosedPositionOnce: (position: Position) => boolean;
}

export const useClosedPositionsStore = create<PositionsStore>((set) => ({
  // Initial state
  closedPositions: [],

  setClosedPositions: (positions: Position[]) => {
    set({
      closedPositions: positions,
    });
  },

  addClosedPosition: (position: Position) => {
    set((state) => ({
      closedPositions: [position, ...state.closedPositions],
    }));
  },

  addClosedPositionOnce: (position: Position) => {
    let added = false;
    set((state) => {
      const existingIndex = state.closedPositions.findIndex(
        (p) => p.externalId === position.externalId
      );

      if (existingIndex === -1) {
        added = true;
        return { closedPositions: [position, ...state.closedPositions] };
      } else {
        added = false;
        return state;
      }
    });
    return added;
  },
}));
