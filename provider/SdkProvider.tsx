"use client";
import { type ReactNode, useEffect, useRef, useState } from "react";
import {
  ClientSdk,
  LoginPasswordAuthMethod,
} from "@quadcode-tech/client-sdk-js";
// import { ClientSdk, LoginPasswordAuthMethod, SsidAuthMethod } from "./sdk";
import { SdkContext } from "../context/SdkContext";
import LoadingPage from "../features/graphs/components/LoadingPage";

const NEXT_PUBLIC_WEB_SOCKET_URL = process.env.NEXT_PUBLIC_WEB_SOCKET_URL;
const NEXT_PUBLIC_IQ_OPTION_USER = process.env.NEXT_PUBLIC_IQ_OPTION_USER;
const NEXT_PUBLIC_IQ_OPTION_PASSWORD =
  process.env.NEXT_PUBLIC_IQ_OPTION_PASSWORD;

export const SdkProvider = ({ children }: { children: ReactNode }) => {
  const [sdk, setSdk] = useState<ClientSdk | null>(null);
  const hasInitializedRef = useRef(false);

  useEffect(() => {
    if (hasInitializedRef.current) {
      return;
    }

    hasInitializedRef.current = true;

    const init = async () => {
      const timeoutPromise = new Promise<never>((_, reject) =>
        setTimeout(() => reject(new Error("SDK init timeout")), 10000)
      );

      try {
        const sdk = await Promise.race([
          ClientSdk.create(
            NEXT_PUBLIC_WEB_SOCKET_URL!,
            82,
            new LoginPasswordAuthMethod(
              `${window.location.origin}/api`,
              NEXT_PUBLIC_IQ_OPTION_USER!,
              NEXT_PUBLIC_IQ_OPTION_PASSWORD!
            ),
            {
              host: window.location.origin,
            }
          ),
          timeoutPromise,
        ]);

        setSdk(sdk);
      } catch (err) {
        console.error("Failed to initialize SDK:", err);
      }
    };

    init().catch(console.error);
  }, []);

  if (!sdk) return <LoadingPage />;

  return <SdkContext.Provider value={sdk}>{children}</SdkContext.Provider>;
};
