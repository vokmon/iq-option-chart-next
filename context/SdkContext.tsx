"use client";
import { createContext } from "react";
import { ClientSdk } from "@quadcode-tech/client-sdk-js";

export const SdkContext = createContext<{
  sdk: ClientSdk | null;
  setSdk: (sdk: ClientSdk | null) => void;
} | null>(null);
