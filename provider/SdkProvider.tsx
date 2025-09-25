"use client";
import { type ReactNode, useEffect, useRef, useState } from "react";
import {
  ClientSdk,
  LoginPasswordAuthMethod,
  SsidAuthMethod,
} from "@quadcode-tech/client-sdk-js";
import { SdkContext } from "../context/SdkContext";
import LoadingPage from "../features/graphs/components/LoadingPage";
import { getCookie } from "@/utils/cookies";
import { useRouter } from "next/navigation";

const NEXT_PUBLIC_WEB_SOCKET_URL = process.env.NEXT_PUBLIC_WEB_SOCKET_URL;
const NEXT_PUBLIC_IQ_OPTION_USER = process.env.NEXT_PUBLIC_IQ_OPTION_USER;
const NEXT_PUBLIC_IQ_OPTION_PASSWORD =
  process.env.NEXT_PUBLIC_IQ_OPTION_PASSWORD;

export const SdkProvider = ({ children }: { children: ReactNode }) => {
  const [sdk, setSdk] = useState<ClientSdk | null>(null);
  const hasInitializedRef = useRef(false);

  const router = useRouter();
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
          10000
        );
      });

      const ssid = getCookie("ssid");

      if (!ssid) {
        console.warn("No SSID cookie found. User may not be logged in.");
        // You might want to redirect to login page here
        if (timeoutId) clearTimeout(timeoutId);
        router.push("/login");
        return;
      }

      try {
        const sdk = await Promise.race([
          ClientSdk.create(
            NEXT_PUBLIC_WEB_SOCKET_URL!,
            82,
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

        // Clear the timeout since SDK initialization succeeded
        if (timeoutId) clearTimeout(timeoutId);
        setSdk(sdk);
      } catch (err) {
        // Clear the timeout on error as well
        if (timeoutId) clearTimeout(timeoutId);
        console.error("Failed to initialize SDK:", err);
        router.push("/login");
      }
    };

    init().catch((err) => {
      console.error(err);
      router.push("/login");
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  if (!sdk) return <LoadingPage />;

  return (
    <SdkContext.Provider value={{ sdk, setSdk }}>
      {children}
    </SdkContext.Provider>
  );
};
