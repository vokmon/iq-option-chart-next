import { useQuery } from "@tanstack/react-query";
import { useSdk } from "./useSdk";
import { useDigitalOptionsStore } from "@/stores/digitalOptionsStore";
import { DigitalOptionsUnderlying } from "@quadcode-tech/client-sdk-js";

export function useDigitalOptions() {
  const { sdk } = useSdk();
  const {
    actives,
    isLoading: storeLoading,
    isError: storeError,
    error: storeErrorObj,
    setActives,
    setLoading,
    setError,
  } = useDigitalOptionsStore();

  const query = useQuery({
    queryKey: ["digitalOptions", "actives"],
    queryFn: async (): Promise<DigitalOptionsUnderlying[]> => {
      if (!sdk) {
        throw new Error("SDK not available");
      }

      setLoading(true);
      setError(null);

      try {
        const now = sdk.currentTime();
        const digitalOptions = await sdk.digitalOptions();
        const actives = digitalOptions.getUnderlyingsAvailableForTradingAt(now);
        // Update the store with the fetched data
        setActives(actives);

        return actives;
      } catch (error) {
        const errorObj =
          error instanceof Error
            ? error
            : new Error("Failed to fetch digital options");
        setError(errorObj);
        throw errorObj;
      } finally {
        setLoading(false);
      }
    },
    enabled: !!sdk,
    // staleTime: 5 * 60 * 1000, // 5 minutes
    // gcTime: 10 * 60 * 1000, // 10 minutes
    // retry: 2,
    refetchOnWindowFocus: false,
  });

  return {
    actives,
    isLoading: query.isLoading || storeLoading,
    isError: query.isError || storeError,
    error: query.error || storeErrorObj,
    refetch: query.refetch,
  };
}
