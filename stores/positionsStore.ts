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
  addOpenPosition: (position: Position) => void;
  addClosedPosition: (position: Position) => void;
  removeOpenPosition: (externalId: number) => void;
  updateOpenPosition: (externalId: number, position: Position) => void;
  upsertOpenPosition: (position: Position) => void;
  addClosedPositionOnce: (position: Position) => boolean;
}

export const usePositionsStore = create<PositionsStore>((set) => ({
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

  addOpenPosition: (position: Position) => {
    set((state) => ({
      openPositions: [position, ...state.openPositions],
    }));
  },

  addClosedPosition: (position: Position) => {
    set((state) => ({
      closedPositions: [position, ...state.closedPositions],
    }));
  },

  removeOpenPosition: (externalId: number) => {
    set((state) => ({
      openPositions: state.openPositions.filter(
        (position) => position.externalId !== externalId
      ),
    }));
  },

  updateOpenPosition: (externalId: number, position: Position) => {
    set((state) => ({
      openPositions: state.openPositions.map((p) =>
        p.externalId === externalId ? position : p
      ),
    }));
  },

  upsertOpenPosition: (position: Position) => {
    set((state) => {
      const existingIndex = state.openPositions.findIndex(
        (p) => p.externalId === position.externalId
      );

      if (existingIndex >= 0) {
        // Update existing position
        const updatedPositions = [...state.openPositions];
        updatedPositions[existingIndex] = position;
        return { openPositions: updatedPositions };
      } else {
        // Add new position at the beginning
        return { openPositions: [position, ...state.openPositions] };
      }
    });
  },

  addClosedPositionOnce: (position: Position) => {
    let wasAdded = false;
    set((state) => {
      const existingIndex = state.closedPositions.findIndex(
        (p) => p.externalId === position.externalId
      );

      if (existingIndex === -1) {
        wasAdded = true;
        return { closedPositions: [position, ...state.closedPositions] };
      } else {
        wasAdded = false;
        return state;
      }
    });

    console.log("wasAdded", wasAdded);
    return wasAdded;
  },
}));
