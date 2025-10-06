"use client";

import { useRouter } from "next/navigation";
import { useGoalFulfillmentStore } from "@/stores/notifications/goalFulfillmentStore";
import { BalanceGoalFulfillment } from "@/stores/notifications/goalFulfillmentStore";

interface UseGoalNotificationActionsProps {
  profitFulfillments: BalanceGoalFulfillment[];
  lossFulfillments: BalanceGoalFulfillment[];
  setIsProfitModalOpen: (open: boolean) => void;
  setIsLossModalOpen: (open: boolean) => void;
}

export function useGoalNotificationActions({
  profitFulfillments,
  lossFulfillments,
  setIsProfitModalOpen,
  setIsLossModalOpen,
}: UseGoalNotificationActionsProps) {
  const { acknowledgeFulfillment } = useGoalFulfillmentStore();
  const router = useRouter();

  const handleProfitClose = () => {
    // Acknowledge profit fulfillments
    profitFulfillments.forEach((fulfillment) => {
      acknowledgeFulfillment(
        fulfillment.balance.balanceId.toString(),
        fulfillment.id
      );
    });
    setIsProfitModalOpen(false);
  };

  const handleLossClose = () => {
    // Acknowledge loss fulfillments
    lossFulfillments.forEach((fulfillment) => {
      acknowledgeFulfillment(
        fulfillment.balance.balanceId.toString(),
        fulfillment.id
      );
    });
    setIsLossModalOpen(false);
  };

  const handleGoToReports = () => {
    // Close all modals first
    setIsProfitModalOpen(false);
    setIsLossModalOpen(false);
    // Navigate to reports
    router.push("/trade/reports");
  };

  return {
    handleProfitClose,
    handleLossClose,
    handleGoToReports,
  };
}
