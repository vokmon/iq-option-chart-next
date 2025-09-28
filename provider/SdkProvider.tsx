"use client";

import { type ReactNode, useEffect, useRef, useState } from "react";
import {
  ClientSdk,
  LoginPasswordAuthMethod,
  SsidAuthMethod,
} from "@quadcode-tech/client-sdk-js";
import { useSdkStore } from "../stores/sdkStore";
import LoadingPage from "../features/graphs/components/LoadingPage";
import { getCookie } from "@/utils/cookies";
import { AuthenticationRequiredDialog } from "../components/dialogs/AuthenticationRequiredDialog";

// Constants
const NEXT_PUBLIC_WEB_SOCKET_URL = process.env.NEXT_PUBLIC_WEB_SOCKET_URL;
const NEXT_PUBLIC_IQ_OPTION_USER = process.env.NEXT_PUBLIC_IQ_OPTION_USER;
const NEXT_PUBLIC_IQ_OPTION_PASSWORD =
  process.env.NEXT_PUBLIC_IQ_OPTION_PASSWORD;
const NEXT_PUBLIC_IQ_OPTION_PLATFORM_ID =
  process.env.NEXT_PUBLIC_IQ_OPTION_PLATFORM_ID;
const MAX_RETRIES = 3;
const TIMEOUT_MS = 5000;

// Helper functions
const createTimeout = (
  attempt: number
): { timeoutPromise: Promise<never>; clearTimeout: () => void } => {
  let timeoutId: NodeJS.Timeout;

  const timeoutPromise = new Promise<never>((_, reject) => {
    timeoutId = setTimeout(
      () =>
        reject(
          new Error(`SDK init timeout (attempt ${attempt}/${MAX_RETRIES})`)
        ),
      TIMEOUT_MS
    );
  });

  return {
    timeoutPromise,
    clearTimeout: () => clearTimeout(timeoutId),
  };
};

const createSdk = async (ssid: string): Promise<ClientSdk> => {
  return ClientSdk.create(
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
  );
};

const initializeSdkWithRetry = async (ssid: string): Promise<ClientSdk> => {
  let lastError: Error | null = null;

  for (let attempt = 1; attempt <= MAX_RETRIES; attempt++) {
    let timeoutCleanup: (() => void) | undefined;

    try {
      console.log(
        `Attempting to initialize SDK (attempt ${attempt}/${MAX_RETRIES})`
      );

      const timeout = createTimeout(attempt);
      timeoutCleanup = timeout.clearTimeout;

      const sdk = await Promise.race([createSdk(ssid), timeout.timeoutPromise]);

      console.log(`SDK initialized successfully on attempt ${attempt}`);
      return sdk;
    } catch (err) {
      lastError = err as Error;
      console.error(
        `SDK initialization failed on attempt ${attempt}/${MAX_RETRIES}:`,
        err
      );

      if (attempt < MAX_RETRIES) {
        await new Promise((resolve) => setTimeout(resolve, 1000));
      }
    } finally {
      // Clean up timeout if it exists
      if (timeoutCleanup) {
        timeoutCleanup();
      }
    }
  }

  throw new Error(
    `SDK initialization failed after ${MAX_RETRIES} attempts. Last error: ${lastError?.message}`
  );
};

const initializeSdkWithReconnection = async (
  ssid: string,
  setSdk: (sdk: ClientSdk) => void,
  setShowSessionDialog: (show: boolean) => void
): Promise<void> => {
  try {
    const sdk = await initializeSdkWithRetry(ssid);
    setSdk(sdk);

    // Subscribe to connection state changes
    (await sdk.wsConnectionState()).subscribeOnStateChanged(async (state) => {
      console.log("WS Connection State:", state);

      if (state === "disconnected") {
        console.log("WebSocket disconnected, attempting reconnection...");
        await initializeSdkWithReconnection(ssid, setSdk, setShowSessionDialog);
      }
    });
  } catch (error) {
    console.error("Failed to initialize SDK:", error);
    setShowSessionDialog(true);
  }
};

export const SdkProvider = ({ children }: { children: ReactNode }) => {
  const setSdk = useSdkStore((state) => state.setSdk);
  const sdk = useSdkStore((state) => state.sdk);
  const hasInitializedRef = useRef(false);
  const [showSessionDialog, setShowSessionDialog] = useState(false);

  useEffect(() => {
    if (hasInitializedRef.current) return;
    hasInitializedRef.current = true;

    const init = async () => {
      const ssid = getCookie("ssid");
      if (!ssid) {
        console.warn("No SSID cookie found. User may not be logged in.");
        setShowSessionDialog(true);
        return;
      }

      try {
        await initializeSdkWithReconnection(ssid, setSdk, setShowSessionDialog);
      } catch (err) {
        console.error("Failed to initialize SDK:", err);
        setShowSessionDialog(true);
      }
    };

    init();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <>
      {!sdk ? <LoadingPage /> : children}
      <AuthenticationRequiredDialog isOpen={showSessionDialog} />
    </>
  );
};
