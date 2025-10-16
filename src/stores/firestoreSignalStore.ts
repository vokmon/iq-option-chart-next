import { create } from "zustand";
import { persist } from "zustand/middleware";
import { SignalTimeframe, SignalType } from "@/types/signal/FireStoreSignal";

interface FirestoreSignalState {
  selectedTimeframe: SignalTimeframe;
  selectedSignalType: SignalType;
  setSelectedTimeframe: (timeframe: SignalTimeframe) => void;
  setSelectedSignalType: (signalType: SignalType) => void;
  reset: () => void;
}

const defaultState = {
  selectedTimeframe: "oneMinute" as SignalTimeframe,
  selectedSignalType: "reversal" as SignalType,
};

export const useFirestoreSignalStore = create<FirestoreSignalState>()(
  persist(
    (set) => ({
      ...defaultState,

      setSelectedTimeframe: (timeframe) =>
        set({ selectedTimeframe: timeframe }),

      setSelectedSignalType: (signalType) =>
        set({ selectedSignalType: signalType }),

      reset: () => set(defaultState),
    }),
    {
      name: "firestore-signal-storage", // unique name for localStorage key
      // Only persist the selected values, not the entire state
      partialize: (state) => ({
        selectedTimeframe: state.selectedTimeframe,
        selectedSignalType: state.selectedSignalType,
      }),
    }
  )
);
