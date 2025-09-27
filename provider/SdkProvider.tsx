"use client";

import { type ReactNode, useEffect, useRef } from "react";
import {
  ClientSdk,
  LoginPasswordAuthMethod,
  SsidAuthMethod,
} from "@quadcode-tech/client-sdk-js";
import { useSdkStore } from "../stores/sdkStore";
import LoadingPage from "../features/graphs/components/LoadingPage";
import { getCookie } from "@/utils/cookies";
import { authService } from "../services/authService";

const NEXT_PUBLIC_WEB_SOCKET_URL = process.env.NEXT_PUBLIC_WEB_SOCKET_URL;
const NEXT_PUBLIC_IQ_OPTION_USER = process.env.NEXT_PUBLIC_IQ_OPTION_USER;
const NEXT_PUBLIC_IQ_OPTION_PASSWORD =
  process.env.NEXT_PUBLIC_IQ_OPTION_PASSWORD;
const NEXT_PUBLIC_IQ_OPTION_PLATFORM_ID =
  process.env.NEXT_PUBLIC_IQ_OPTION_PLATFORM_ID;

export const SdkProvider = ({ children }: { children: ReactNode }) => {
  const setSdk = useSdkStore((state) => state.setSdk);
  const sdk = useSdkStore((state) => state.sdk);
  const hasInitializedRef = useRef(false);

  useEffect(() => {
    if (hasInitializedRef.current) {
      return;
    }

    hasInitializedRef.current = true;

    const init = async () => {
      let timeoutId: NodeJS.Timeout | undefined;

      const timeoutPromise = new Promise<never>((_, reject) => {
        timeoutId = setTimeout(
          () => reject(new Error("SDK init timeout")),
          15000
        );
      });

      const ssid = getCookie("ssid");

      if (!ssid) {
        console.warn("No SSID cookie found. User may not be logged in.");
        if (timeoutId) clearTimeout(timeoutId);
        await authService.performLogout();
        return;
      }

      try {
        const sdk = await Promise.race([
          ClientSdk.create(
            NEXT_PUBLIC_WEB_SOCKET_URL!,
            Number(NEXT_PUBLIC_IQ_OPTION_PLATFORM_ID!),
            NEXT_PUBLIC_IQ_OPTION_USER
              ? new LoginPasswordAuthMethod(
                  `${window.location.origin}/api`,
                  NEXT_PUBLIC_IQ_OPTION_USER!,
                  NEXT_PUBLIC_IQ_OPTION_PASSWORD!
                )
              : new SsidAuthMethod(ssid),
            {
              host: window.location.origin,
            }
          ),
          timeoutPromise,
        ]);

        if (timeoutId) clearTimeout(timeoutId);
        setSdk(sdk);
      } catch (err) {
        if (timeoutId) clearTimeout(timeoutId);
        console.error("Failed to initialize SDK:", err);
        await authService.performLogout();
      }
    };

    init().catch(async (err) => {
      console.error(err);
      await authService.performLogout();
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Show loading page if SDK is not initialized
  if (!sdk) {
    return <LoadingPage />;
  }

  return <>{children}</>;
};
