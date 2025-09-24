"use client";
import { type ReactNode, useEffect, useRef, useState } from "react";
import { ClientSdk, SsidAuthMethod } from "@quadcode-tech/client-sdk-js";
// import { ClientSdk, LoginPasswordAuthMethod, SsidAuthMethod } from "./sdk";
import { SdkContext } from "../context/SdkContext";
import LoadingPage from "../features/graphs/components/LoadingPage";
import { getCookie } from "@/utils/cookies";

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

      const ssid = getCookie("ssid");

      if (!ssid) {
        console.warn("No SSID cookie found. User may not be logged in.");
        // You might want to redirect to login page here
        // router.push("/login");
        return;
      }

      try {
        const sdk = await Promise.race([
          ClientSdk.create(
            NEXT_PUBLIC_WEB_SOCKET_URL!,
            82,
            // new LoginPasswordAuthMethod(
            //   `${window.location.origin}/api`,
            //   NEXT_PUBLIC_IQ_OPTION_USER!,
            //   NEXT_PUBLIC_IQ_OPTION_PASSWORD!
            // )
            new SsidAuthMethod(ssid),
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
