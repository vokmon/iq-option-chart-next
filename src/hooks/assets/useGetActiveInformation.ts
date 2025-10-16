import { useQuery } from "@tanstack/react-query";
import { useSdk } from "../useSdk";
import { useDigitalOptionsStore } from "@/stores/digitalOptionsStore";
import { Active } from "@quadcode-tech/client-sdk-js";
import { useTransition } from "react";
import { useAssetStore } from "@/stores/assets/assetStore";
import { useClosedPositionsStore } from "@/stores/positions/closedPositionsStore";

export function useGetActiveInformation(additonalIds: number[] = []) {
  const { sdk } = useSdk();
  const { actives, activeInformation, setActiveInformation } =
    useDigitalOptionsStore();
  const { assets } = useAssetStore();
  const { closedPositions } = useClosedPositionsStore();

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [_, startTransition] = useTransition();

  const activeInformationIds = Object.keys(activeInformation).map((id) =>
    parseInt(id)
  );

  const closedPositionsIds = closedPositions.map((p) => p.activeId);
  const assetsIds = assets.map((a) => a.asset?.activeId);

  const allActiveIds = [
    ...assetsIds.filter((id) => id !== undefined),
    ...closedPositionsIds.filter((id) => id !== undefined),
    ...actives.map((a) => a.activeId),
    ...additonalIds,
  ];
  const uniqueActiveIds = [...new Set(allActiveIds)];

  const activeIdsToFetch = uniqueActiveIds.filter(
    (id) => !activeInformationIds.includes(id)
  );

  const query = useQuery({
    queryKey: ["activeInformation", activeIdsToFetch],
    queryFn: async (): Promise<Record<number, Active>> => {
      if (!sdk || !actives.length) {
        throw new Error("SDK or actives not available");
      }

      const activesSdk = sdk.actives();
      const activeInformation: Record<number, Active> = {};

      // Fetch active information in batches
      const BATCH_SIZE = 10; // Process 5 actives at a time
      const batches = [];

      for (let i = 0; i < activeIdsToFetch.length; i += BATCH_SIZE) {
        batches.push(activeIdsToFetch.slice(i, i + BATCH_SIZE));
      }

      for (const batch of batches) {
        const promises = batch.map(async (activeId) => {
          try {
            const activeData = await (await activesSdk).getActive(activeId);
            return { activeId: activeId, data: activeData };
          } catch (error) {
            console.error(`Failed to fetch active ${activeId}:`, error);
            return { activeId: activeId, data: null, error };
          }
        });

        const results = await Promise.allSettled(promises);

        // Process results and update store
        results.forEach((result) => {
          if (result.status === "fulfilled" && result.value.data) {
            const { activeId, data } = result.value;
            activeInformation[activeId] = data;
            startTransition(() => {
              setActiveInformation(activeId, data);
            });
          }
        });
      }

      return activeInformation;
    },
    enabled: !!sdk && actives.length > 0,
    // staleTime: 5 * 60 * 1000, // 5 minutes
    // gcTime: 10 * 60 * 1000, // 10 minutes
    retry: 2,
    refetchOnWindowFocus: false,
  });

  return {
    isLoading: query.isLoading,
    isError: query.isError,
    error: query.error,
    refetch: query.refetch,
  };
}
