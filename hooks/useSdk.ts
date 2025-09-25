import { useContext } from "react";
import { SdkContext } from "../context/SdkContext";
import type { ClientSdk } from "@quadcode-tech/client-sdk-js";

export const useSdk = (): {
  sdk: ClientSdk;
  setSdk: (sdk: ClientSdk) => void;
} => {
  const context = useContext(SdkContext);
  const sdk = context?.sdk;
  if (!sdk) {
    throw new Error("useSdk must be used within SdkProvider");
  }
  return { sdk, setSdk: context.setSdk };
};
