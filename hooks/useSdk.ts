import { useSdkStore } from "../stores/sdkStore";
import type { ClientSdk } from "@quadcode-tech/client-sdk-js";

export const useSdk = (): {
  sdk: ClientSdk;
  setSdk: (sdk: ClientSdk | null) => void;
} => {
  const sdk = useSdkStore((state) => state.sdk);
  const setSdk = useSdkStore((state) => state.setSdk);

  if (!sdk) {
    throw new Error("useSdk must be used within SdkProvider");
  }

  return { sdk, setSdk };
};
