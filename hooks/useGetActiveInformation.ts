import { useQuery } from "@tanstack/react-query";
import { useSdk } from "./useSdk";
import { useDigitalOptionsStore } from "@/stores/digitalOptionsStore";
import { Active } from "@quadcode-tech/client-sdk-js";

export function useGetActiveInformation() {
  const { sdk } = useSdk();
  const { actives, setActiveInformation } = useDigitalOptionsStore();

  const query = useQuery({
    queryKey: ["activeInformation", actives.map((a) => a.activeId)],
    queryFn: async (): Promise<Record<number, Active>> => {
      if (!sdk || !actives.length) {
        throw new Error("SDK or actives not available");
      }

      const activesSdk = sdk.actives();
      const activeInformation: Record<number, Active> = {};

      // Fetch all active information in parallel
      const promises = actives.map(async (active) => {
        try {
          const activeData = await (
            await activesSdk
          ).getActive(active.activeId);
          return { activeId: active.activeId, data: activeData };
        } catch (error) {
          console.error(`Failed to fetch active ${active.activeId}:`, error);
          return { activeId: active.activeId, data: null, error };
        }
      });

      const results = await Promise.allSettled(promises);

      // Process results and update store
      results.forEach((result) => {
        if (result.status === "fulfilled" && result.value.data) {
          const { activeId, data } = result.value;
          activeInformation[activeId] = data;
          setActiveInformation(activeId, data);
        }
      });

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
