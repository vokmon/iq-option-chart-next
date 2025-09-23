import { useContext } from "react";
import { SdkContext } from "../context/SdkContext";
import type { ClientSdk } from "@quadcode-tech/client-sdk-js";

export const useSdk = (): ClientSdk => {
  const sdk = useContext(SdkContext);
  if (!sdk) {
    throw new Error("useSdk must be used within SdkProvider");
  }
  return sdk;
};
