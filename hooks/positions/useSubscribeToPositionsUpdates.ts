import { useSdk } from "../useSdk";
import { usePositionsStore } from "@/stores/positionsStore";
import { Positions } from "@quadcode-tech/client-sdk-js";
import { useEffect, useRef, useTransition } from "react";

export const useSubscribeToPositionsUpdates = () => {
  const positionsRef = useRef<Positions | null>(null);
  const positionsTimeoutRef = useRef<{ [key: number]: NodeJS.Timeout }>({});
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [_, startTransition] = useTransition();

  const { sdk } = useSdk();
  const {
    openPositions,
    upsertOpenPosition,
    removeOpenPosition,
    addClosedPositionOnce,
  } = usePositionsStore();

  useEffect(() => {
    // Safe guard to ensure the positions will be closed after the expiration time
    const positionsTimeout = () => {
      openPositions.forEach((position) => {
        const timeoutId = setTimeout(
          () => {
            startTransition(() => {
              removeOpenPosition(position.externalId!);
              addClosedPositionOnce(position);
            });
          },
          position.expirationTime
            ? position.expirationTime?.getTime() - Date.now()
            : 60
        );
        positionsTimeoutRef.current[position.externalId!] = timeoutId;
      });
    };

    const subscribeToPositions = async () => {
      positionsRef.current = await sdk.positions();
      positionsRef.current.subscribeOnUpdatePosition((position) => {
        if (position.status?.toLowerCase().includes("closed")) {
          startTransition(() => {
            removeOpenPosition(position.externalId!);
            addClosedPositionOnce(position);
          });
          clearTimeout(positionsTimeoutRef.current[position.externalId!]);
          delete positionsTimeoutRef.current[position.externalId!];
        } else {
          startTransition(() => {
            upsertOpenPosition(position);
          });
        }
      });
    };

    subscribeToPositions();
    positionsTimeout();
    return () => {
      positionsRef.current?.unsubscribeOnUpdatePosition(() => {});
      Object.values(positionsTimeoutRef.current).forEach((timeout) => {
        clearTimeout(timeout);
      });
      positionsTimeoutRef.current = {};
    };
  }, [
    openPositions,
    removeOpenPosition,
    sdk,
    addClosedPositionOnce,
    upsertOpenPosition,
  ]);
};
