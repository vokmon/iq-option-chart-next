import { useQuery } from "@tanstack/react-query";
import { useSdk } from "./useSdk";
import { usePositionsStore } from "@/stores/positionsStore";
import { Position } from "@quadcode-tech/client-sdk-js";
import { useTransition } from "react";

const REFRESH_INTERVAL_CLOSE_POSITIONS = 50000;
const REFRESH_INTERVAL_OPEN_POSITIONS = 10000;

export function useGetOpenPositions() {
  const { sdk } = useSdk();
  const {
    setOpenPositions,
    setOpenPositionsLoading,
    setOpenPositionsError,
    clearOpenPositionsError,
  } = usePositionsStore();

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [_, startTransition] = useTransition();

  const query = useQuery({
    queryKey: ["openPositions"],
    queryFn: async () => {
      try {
        setOpenPositionsLoading(true);
        clearOpenPositionsError();

        const positions = await sdk.positions();
        const allOpenPositions = await positions.getOpenedPositions();

        // Update the store with the fetched open positions
        startTransition(() => {
          setOpenPositions(allOpenPositions);
        });

        return allOpenPositions;
      } catch (error) {
        setOpenPositionsError(error as Error);
        throw error;
      } finally {
        setOpenPositionsLoading(false);
      }
    },
    enabled: !!sdk,
    retry: 2,
    refetchOnWindowFocus: false,
    refetchIntervalInBackground: true,
    refetchInterval: REFRESH_INTERVAL_OPEN_POSITIONS,
  });

  return {
    isLoading: query.isLoading,
    isError: query.isError,
    error: query.error,
    refetch: query.refetch,
  };
}

export function useGetClosedPositions() {
  const { sdk } = useSdk();
  const {
    setClosedPositions,
    setClosedPositionsLoading,
    setClosedPositionsError,
    clearClosedPositionsError,
  } = usePositionsStore();

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [_, startTransition] = useTransition();

  const query = useQuery({
    queryKey: ["closedPositions"],
    queryFn: async () => {
      try {
        setClosedPositionsLoading(true);
        clearClosedPositionsError();

        const positions = await sdk.positions();
        const now = sdk.currentTime();
        const allClosedPositionsHistory = await positions.getPositionsHistory();

        await allClosedPositionsHistory.fetchPrevPage();

        const allClosedPositions: Position[] = [];
        while (true) {
          const positions = allClosedPositionsHistory.getPositions();
          if (positions.length === 0) {
            if (allClosedPositionsHistory.hasPrevPage()) {
              allClosedPositionsHistory.fetchPrevPage();
              continue;
            }
            break;
          }

          let foundDifferentDay = false;
          positions.forEach((position) => {
            if (position.closeTime) {
              const closeDate = new Date(position.closeTime);
              const currentDate = new Date(now);
              const isSameDay =
                closeDate.getFullYear() === currentDate.getFullYear() &&
                closeDate.getMonth() === currentDate.getMonth() &&
                closeDate.getDate() === currentDate.getDate();

              if (isSameDay) {
                allClosedPositions.push(position);
              } else {
                foundDifferentDay = true;
              }
            }
          });

          if (foundDifferentDay) {
            break;
          }
        }

        // Update the store with the fetched closed positions
        startTransition(() => {
          setClosedPositions(allClosedPositions);
        });

        return allClosedPositions;
      } catch (error) {
        setClosedPositionsError(error as Error);
        throw error;
      } finally {
        setClosedPositionsLoading(false);
      }
    },
    enabled: !!sdk,
    retry: 2,
    refetchOnWindowFocus: false,
    refetchIntervalInBackground: true,
    refetchInterval: REFRESH_INTERVAL_CLOSE_POSITIONS,
  });

  return {
    isLoading: query.isLoading,
    isError: query.isError,
    error: query.error,
    refetch: query.refetch,
  };
}
