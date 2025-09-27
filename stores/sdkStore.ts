"use client";

import { create } from "zustand";
import { ClientSdk } from "@quadcode-tech/client-sdk-js";

interface SdkState {
  sdk: ClientSdk | null;
  setSdk: (sdk: ClientSdk | null) => void;
}

export const useSdkStore = create<SdkState>((set) => ({
  sdk: null,
  setSdk: (sdk: ClientSdk | null) => {
    set({ sdk });
  },
}));
