import { useSdk } from "@/hooks/useSdk";
import { getClosedPositionsForSelectedBalance } from "@/utils/closePositionsUtils";
import { useQuery } from "@tanstack/react-query";

export default function useGetClosedPositionsByDate({
  dates,
  balanceId,
}: {
  dates: Date[];
  balanceId?: number;
}) {
  const { sdk } = useSdk();

  const query = useQuery({
    queryKey: ["report", "closedPositionsByDate", dates, balanceId],
    queryFn: async () => {
      const allClosedPositions = await getClosedPositionsForSelectedBalance({
        sdk,
        dates: dates,
      });

      const selectedClosedPositions = allClosedPositions.filter(
        (position) => position.balanceId === balanceId
      );

      return selectedClosedPositions;
    },
    enabled: !!sdk && !!dates && dates.length > 0 && !!balanceId,
  });

  return query;
}
