import { useTransition } from "react";
import { useSdk } from "../useSdk";
import { usePositionsStore } from "@/stores/positionsStore";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { Position } from "@quadcode-tech/client-sdk-js";

const REFRESH_INTERVAL_CLOSE_POSITIONS = 1000 * 60 * 5; // 5 minutes
const QUERY_KEY_CLOSED_POSITIONS = ["closedPositions"];
let isFetching = false;

export function useGetClosedPositions() {
  const { sdk } = useSdk();
  const { setClosedPositions } = usePositionsStore();

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [_, startTransition] = useTransition();

  const query = useQuery({
    queryKey: QUERY_KEY_CLOSED_POSITIONS,
    queryFn: async () => {
      try {
        const positions = await sdk.positions();
        const now = sdk.currentTime();

        const allClosedPositionsHistory = await positions.getPositionsHistory();

        if (!isFetching) {
          await allClosedPositionsHistory.fetchPrevPage();
          isFetching = true;
        }

        const allClosedPositions: { [key: number]: Position } = {};
        while (true) {
          const positions = allClosedPositionsHistory.getPositions();
          if (positions.length === 0) {
            if (allClosedPositionsHistory.hasPrevPage()) {
              await allClosedPositionsHistory.fetchPrevPage();
              continue;
            }
            break;
          }

          let foundDifferentDay = false;

          positions.forEach((position) => {
            if (position.closeTime) {
              const closeDate = new Date(position.closeTime);
              const currentDate = now;
              const isSameDay =
                closeDate.getFullYear() === currentDate.getFullYear() &&
                closeDate.getMonth() === currentDate.getMonth() &&
                closeDate.getDate() === currentDate.getDate();

              if (isSameDay) {
                // allClosedPositions.push(position);
                allClosedPositions[position.externalId!] = position;
              } else {
                foundDifferentDay = true;
              }
            }
          });

          if (foundDifferentDay) {
            break;
          }
          await allClosedPositionsHistory.fetchPrevPage();
        }

        // Update the store with the fetched closed positions
        startTransition(() => {
          setClosedPositions(Object.values(allClosedPositions));
        });

        return allClosedPositions;
      } catch (error) {
        console.error("Error fetching closed positions:", error);
        throw error;
      } finally {
      }
    },
    enabled: !!sdk,
    retry: 2,
    refetchOnWindowFocus: true,
    refetchIntervalInBackground: false,
    refetchInterval: REFRESH_INTERVAL_CLOSE_POSITIONS,
  });

  return query;
}

export const useRefetchClosedPositions = () => {
  const queryClient = useQueryClient();

  const refetchClosedPositions = () => {
    queryClient.refetchQueries({ queryKey: QUERY_KEY_CLOSED_POSITIONS });
  };

  return { refetchClosedPositions };
};
