import { useQuery } from "@tanstack/react-query";

import { useSdk } from "@/hooks/useSdk";
import { useTradingStore } from "@/stores/tradingStore";
import { useAssetStore } from "@/stores/assetStore";

export interface UseOrderReferenceLinesProps {
  activeId: number;
}

export function useOrderReferenceLines({
  activeId,
}: UseOrderReferenceLinesProps) {
  const { sdk } = useSdk();
  const { getAllOrders, removeOrder } = useTradingStore();
  const { getActiveAsset } = useAssetStore();
  const activeAsset = getActiveAsset();
  const assetOrdersOfAsset = getAllOrders(activeAsset?.id || "");
  // Use React Query to fetch order data
  const result = useQuery({
    queryKey: ["orderReferenceData", activeId, assetOrdersOfAsset],
    queryFn: async () => {
      if (!sdk || !activeAsset?.id) return [];

      try {
        const assetOrdersOfAsset = getAllOrders(activeAsset.id);

        // Early return if no orders to process
        if (assetOrdersOfAsset.length === 0) return [];

        const orderIds = new Set(assetOrdersOfAsset.map((order) => order.id));

        // Wait for 1 second to ensure the positions are updated
        await new Promise((resolve) => setTimeout(resolve, 1000));

        const positions = await sdk.positions();
        const allOpenPositions = await positions.getOpenedPositions();

        // Create a Set of all open order IDs for O(1) lookup instead of O(n) includes
        const allOpenOrderIds = new Set(
          allOpenPositions.flatMap((position) => position.orderIds || [])
        );

        // Find orders to remove (orders that are no longer open)
        const ordersToRemove = assetOrdersOfAsset
          .filter((order) => !allOpenOrderIds.has(order.id))
          .map((order) => order.id);

        // Remove closed orders from store
        ordersToRemove.forEach((orderId) => {
          removeOrder(activeAsset.id, orderId);
        });

        // Find positions that have orders matching our asset's orders
        const positionsToDrawReferenceLines = allOpenPositions.filter(
          (position) =>
            position.orderIds?.some((orderId) => orderIds.has(orderId))
        );

        positionsToDrawReferenceLines.forEach((position) => {
          setTimeout(
            () => {
              position.orderIds?.forEach((orderId) => {
                removeOrder(activeAsset.id, orderId);
              });
            },
            position.expirationTime
              ? position.expirationTime?.getTime() - Date.now()
              : 55000 // 55 seconds
          );
        });
        return positionsToDrawReferenceLines;
      } catch (error) {
        console.warn("Error fetching order data:", error);
        return [];
      }
    },
  });

  return result;
}
