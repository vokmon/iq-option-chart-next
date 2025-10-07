import { useSdk } from "@/hooks/useSdk";
import { getClosedPositionsForSelectedBalance } from "@/utils/closePositionsUtils";
import { useQuery } from "@tanstack/react-query";

export default function useGetClosedPositionsByDate({
  dates,
}: {
  dates: Date[];
}) {
  const { sdk } = useSdk();

  const query = useQuery({
    queryKey: ["report", "closedPositionsByDate", dates],
    queryFn: async () => {
      const allClosedPositions = await getClosedPositionsForSelectedBalance({
        sdk,
        dates: dates,
      });
      return allClosedPositions;
    },
    enabled: !!sdk && !!dates && dates.length > 0,
  });

  return query;
}
