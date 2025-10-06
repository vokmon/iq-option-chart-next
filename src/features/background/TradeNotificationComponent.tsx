"use client";

import { useGoalFulfillmentStore } from "@/stores/notifications/goalFulfillmentStore";
import useCalculateGoalFulfillment from "./hooks/notification/useCalculateGoalFulfillment";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import ProfitFulfillmentDialog from "@/components/display/notifications/trade-goal/ProfitFulfillmentDialog";
import LossFulfillmentDialog from "@/components/display/notifications/trade-goal/LossFulfillmentDialog";
import { GoalFulfillmentType } from "@/stores/notifications/goalFulfillmentStore";

export default function TradeNotificationComponent() {
  useCalculateGoalFulfillment();
  const {
    getAllFulfillments,
    hasUnacknowledgedFulfillment,
    acknowledgeFulfillment,
  } = useGoalFulfillmentStore();
  const router = useRouter();

  const [isProfitModalOpen, setIsProfitModalOpen] = useState(false);
  const [isLossModalOpen, setIsLossModalOpen] = useState(false);

  const fulfillments = getAllFulfillments();
  const hasUnacknowledged = hasUnacknowledgedFulfillment();

  const unacknowledgedFulfillments = fulfillments.filter(
    (f) => !f.acknowledged
  );

  const profitFulfillments = unacknowledgedFulfillments.filter(
    (f) => f.type === GoalFulfillmentType.PROFIT
  );
  const lossFulfillments = unacknowledgedFulfillments.filter(
    (f) => f.type === GoalFulfillmentType.LOSS
  );

  useEffect(() => {
    if (hasUnacknowledged) {
      if (profitFulfillments.length > 0) {
        setIsProfitModalOpen(true);
      }
      if (lossFulfillments.length > 0) {
        setIsLossModalOpen(true);
      }
    }
  }, [hasUnacknowledged, profitFulfillments.length, lossFulfillments.length]);

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
