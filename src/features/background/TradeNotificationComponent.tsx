"use client";

import useCalculateGoalFulfillment from "./hooks/notification/goal-fulfullment/useCalculateGoalFulfillment";
import { useGoalNotificationState } from "./hooks/notification/goal-fulfullment/useGoalNotificationState";
import { useGoalNotificationActions } from "./hooks/notification/goal-fulfullment/useGoalNotificationActions";
import ProfitFulfillmentDialog from "@/components/display/notifications/dialog/trade-goal/ProfitFulfillmentDialog";
import LossFulfillmentDialog from "@/components/display/notifications/dialog/trade-goal/LossFulfillmentDialog";

export default function TradeNotificationComponent() {
  useCalculateGoalFulfillment();

  const {
    isProfitModalOpen,
    isLossModalOpen,
    hasUnacknowledged,
    unacknowledgedFulfillments,
    profitFulfillments,
    lossFulfillments,
    setIsProfitModalOpen,
    setIsLossModalOpen,
  } = useGoalNotificationState();

  const { handleProfitClose, handleLossClose, handleGoToReports } =
    useGoalNotificationActions({
      profitFulfillments,
      lossFulfillments,
      setIsProfitModalOpen,
      setIsLossModalOpen,
    });

  if (!hasUnacknowledged) {
    return null;
  }

  return (
    <>
      <ProfitFulfillmentDialog
        isOpen={isProfitModalOpen}
        onClose={handleProfitClose}
        onGoToReports={handleGoToReports}
        fulfillments={unacknowledgedFulfillments}
      />
      <LossFulfillmentDialog
        isOpen={isLossModalOpen}
        onClose={handleLossClose}
        onGoToReports={handleGoToReports}
        fulfillments={unacknowledgedFulfillments}
      />
    </>
  );
}
