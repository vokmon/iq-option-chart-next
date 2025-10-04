import { useOpenPositionsStore } from "@/stores/positions/openPositionsStore";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useTransition } from "react";
import { useSdk } from "../useSdk";

const REFRESH_INTERVAL_OPEN_POSITIONS = 1000 * 60 * 5; // 5 minutes
const QUERY_KEY_OPEN_POSITIONS = ["openPositions"];

export function useGetOpenPositions() {
  const { sdk } = useSdk();
  const { setOpenPositions } = useOpenPositionsStore();

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [_, startTransition] = useTransition();

  const query = useQuery({
    queryKey: QUERY_KEY_OPEN_POSITIONS,
    queryFn: async () => {
      try {
        const positions = await sdk.positions();
        const allOpenPositions = await positions.getOpenedPositions();

        // Update the store with the fetched open positions
        startTransition(() => {
          setOpenPositions(allOpenPositions);
        });

        return allOpenPositions;
      } catch (error) {
        console.error("Error fetching open positions:", error);
        throw error;
      }
    },
    enabled: !!sdk,
    retry: 2,
    refetchOnWindowFocus: true,
    refetchIntervalInBackground: false,
    refetchInterval: REFRESH_INTERVAL_OPEN_POSITIONS,
  });

  return query;
}

export const useRefetchOpenPositions = () => {
  const queryClient = useQueryClient();

  const refetchOpenPositions = () => {
    queryClient.refetchQueries({ queryKey: QUERY_KEY_OPEN_POSITIONS });
  };

  return { refetchOpenPositions };
};
