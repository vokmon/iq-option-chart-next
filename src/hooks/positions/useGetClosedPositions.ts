import { useTransition } from "react";
import { useSdk } from "../useSdk";
import { useClosedPositionsStore } from "@/stores/positions/closedPositionsStore";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { getClosedPositionsForSelectedBalance } from "@/utils/closePositionsUtils";

const REFRESH_INTERVAL_CLOSE_POSITIONS = 1000 * 60 * 5; // 5 minutes
const QUERY_KEY_CLOSED_POSITIONS = ["closedPositions"];

export function useGetClosedPositions() {
  const { sdk } = useSdk();
  const { setClosedPositions } = useClosedPositionsStore();

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [_, startTransition] = useTransition();

  const query = useQuery({
    queryKey: QUERY_KEY_CLOSED_POSITIONS,
    queryFn: async () => {
      try {
        const now = sdk.currentTime();
        const allClosedPositions = await getClosedPositionsForSelectedBalance({
          sdk,
          dates: [now],
        });

        // Update the store with the fetched closed positions
        startTransition(() => {
          setClosedPositions(Object.values(allClosedPositions));
        });

        return allClosedPositions;
      } catch (error) {
        console.error("Error fetching closed positions:", error);
        throw error;
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

export const useClosedPositionsLoading = () => {
  const queryClient = useQueryClient();
  return (
    queryClient.getQueryState(QUERY_KEY_CLOSED_POSITIONS)?.status === "pending"
  );
};
